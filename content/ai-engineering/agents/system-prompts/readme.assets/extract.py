"""Copy the system prompts of OpenCode, Cline and Roomote into Markdown files.

Usage: python3 -I extract.py <dir with the opencode, cline and Roomote checkouts> <output dir>

The script reads the prompt text from each repository's source files. It doesn't run any code from
the repositories. Where a prompt is put together from several strings, the script joins the same
strings in the same way as the source code does. Each source file and anchor the script needs must
exist, or the script stops with an error, so a change in a repository shows up as a failure here.
"""

import os
import re
import shutil
import subprocess
import sys

REPOS, OUT = sys.argv[1], sys.argv[2]

# Same rule as codex/build.py: placeholders and tags such as <X>, <env> or </summary> are wrapped in
# backticks so that Markdown shows them. This version also allows attributes, as in
# <user_input mode="...">. Text inside code fences or backticks, autolinks and paths are left alone.
PLACEHOLDER = re.compile(r"(?<!\w)<(/?[A-Za-z][\w .=\"'-]*)>")


def show_placeholders(text):
    lines, fence = [], False
    for line in text.split("\n"):
        if line.lstrip().startswith(("```", "~~~")):
            fence = not fence
        elif not fence:
            # Even-numbered parts lie outside inline code spans.
            parts = line.split("`")
            parts[::2] = [PLACEHOLDER.sub(r"`<\1>`", part) for part in parts[::2]]
            line = "`".join(parts)
        lines.append(line)
    return "\n".join(lines)


def read(repo, rel):
    return open(os.path.join(REPOS, repo, rel), encoding="utf-8").read()


def literal_at(src, i):
    """Read the JavaScript string literal that starts at src[i]. Returns (value, end index)."""
    quote = src[i]
    assert quote in "'\"`", src[i : i + 40]
    out, j = [], i + 1
    escapes = {"n": "\n", "t": "\t", "\\": "\\", "'": "'", '"': '"', "`": "`", "$": "$"}
    while src[j] != quote:
        c = src[j]
        if c == "\\":
            out.append(escapes[src[j + 1]])
            j += 2
            continue
        if quote == "`" and src.startswith("${", j):
            end = src.index("}", j)
            out.append("\0" + src[j + 2 : end] + "\0")  # interpolation, resolved by the caller
            j = end + 1
            continue
        out.append(c)
        j += 1
    return "".join(out), j + 1


def literal(src, anchor):
    """The first string literal after a unique anchor text."""
    assert src.count(anchor) == 1, anchor
    i = src.index(anchor) + len(anchor)
    i = min(src.index(q, i) for q in "'\"`" if q in src[i:])
    return literal_at(src, i)[0]


def literals(src, start, end):
    """All string literals between two unique anchors, in order."""
    assert src.count(start) == 1 and src.count(end) >= 1, (start, end)
    i, stop, found = src.index(start) + len(start), src.index(end, src.index(start)), []
    while True:
        nxt = [src.index(q, i) for q in "'\"`" if q in src[i:stop]]
        if not nxt:
            return found
        value, i = literal_at(src, min(nxt))
        found.append(value)


def fill(text, values):
    """Resolve ${name} interpolations left by literal_at."""
    def sub(m):
        assert m.group(1) in values, m.group(1)
        return values[m.group(1)]

    out = re.sub("\0([^\0]*)\0", sub, text)
    assert "\0" not in out
    return out


def write(folder, name, text):
    path = os.path.join(OUT, folder, "prompts", name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(show_placeholders(text.strip("\n")) + "\n")


def copy_license(repo, folder):
    for name in ("LICENSE", "NOTICE"):
        path = os.path.join(REPOS, repo, name)
        if os.path.exists(path):
            shutil.copyfile(path, os.path.join(OUT, folder, name))


def commit(repo):
    return subprocess.run(
        ["git", "-C", os.path.join(REPOS, repo), "log", "-1", "--format=%H %cs"],
        capture_output=True, text=True, check=True,
    ).stdout.strip()


# ---------------------------------------------------------------- OpenCode

def opencode():
    core = "packages/core/src/"
    # The tool guidance lines from session/system-prompt.ts, for a session that has the shell, write
    # and edit tools.
    sp = read("opencode", core + "session/system-prompt.ts")
    guidance = "\n".join(
        literals(sp, 'tools.includes("shell")', 'tools.includes("write")')
        + literals(sp, 'tools.includes("write")', 'tools.includes("edit")')
        + literals(sp, 'tools.includes("edit")', "return prompt.replace")[:1]
    )

    def render(text):
        return text.replace("${OPENCODE_TOOL_GUIDANCE}", guidance)

    write("opencode", "base.md", render(read("opencode", core + "session/runner/prompt/system.txt")))
    for name in ("gpt", "gpt-astra", "kimi", "meta", "trinity", "anthropic"):
        text = render(read("opencode", core + f"plugin/system-prompt/{name}.txt"))
        write("opencode", f"model-{name}.md", text)

    agents = read("opencode", core + "plugin/agent.ts")
    for name in ("EXPLORE", "TITLE", "SUMMARY"):
        write("opencode", f"agent-{name.lower()}.md", literal(agents, f"const PROMPT_{name} ="))

    claude = read("opencode", core + "plugin/provider/claude-agent/language-model/system-prompt.ts")
    write("opencode", "claude-code-append.md", literal(claude, "append:\n"))

    for group, names in (("goal", ("kickoff", "reminder", "continuation", "judge")),
                         ("command", ("initialize", "review", "schedule"))):
        for name in names:
            write("opencode", f"{group}-{name}.md", read("opencode", core + f"plugin/{group}/{name}.txt"))
    for name in ("patch", "todowrite"):
        write("opencode", f"tool-{name}.md", read("opencode", core + f"tool/{name}.txt"))
    copy_license("opencode", "opencode")


# ---------------------------------------------------------------- Cline

def cline():
    base = "sdk/packages/shared/src/prompt/"
    act = literal(read("cline", base + "system/act.ts"), "CLINE_SYSTEM_PROMPT_ACT_MODE =")
    yolo = literal(read("cline", base + "system/yolo.ts"), "CLINE_SYSTEM_PROMPT_YOLO_MODE =")
    src = read("cline", base + "cline.ts")
    mode_tags = literal(src, "export const MODE_TAG_INSTRUCTIONS =")
    plan_base = literal(src, "const PLAN_MODE_INSTRUCTIONS_BASE =")
    values = {"PLAN_MODE_INSTRUCTIONS_BASE": plan_base}
    plan = fill(literal(src, "export const PLAN_MODE_INSTRUCTIONS ="), values)
    plan_manual = fill(literal(src, "export const PLAN_MODE_INSTRUCTIONS_MANUAL_SWITCH ="), values)

    # buildClineSystemPrompt: {{CLINE_RULES}} becomes the caller's rules, then the mode tag text
    # (not in yolo mode), then the plan-mode text (plan mode only), joined by blank lines.
    # {{CLINE_METADATA}} is filled only for the Cline provider; the other placeholders are kept.
    def build(prompt, rules):
        return prompt.replace("{{CLINE_RULES}}", "\n\n".join(rules)).strip()

    write("cline", "act.md", build(act, [mode_tags]))
    write("cline", "plan.md", build(act, [mode_tags, plan]))
    write("cline", "plan-vscode.md", build(act, [mode_tags, plan_manual]))
    write("cline", "yolo.md", build(yolo, []))
    write("cline", "cloud-computer-use.md",
          literal(read("cline", "sdk/packages/core/src/cloud/computer-use-prompt.ts"),
                  "export const CLOUD_COMPUTER_USE_PROMPT ="))
    copy_license("cline", "cline")


# ---------------------------------------------------------------- Roomote

def roomote():
    base = "packages/cloud-agents/src/"
    style = read("Roomote", base + "style-guidance.ts")
    ownership = literal(style, "export const ROOMOTE_OWNERSHIP_GUIDANCE =")
    nomenclature = literal(style, "export const ROOMOTE_NOMENCLATURE_GUIDANCE =")
    # DEFAULT_ROOMOTE_STYLE_GUIDANCE: seven sentences, then the two constants above, joined by blank lines.
    sentences = literals(style, "export const DEFAULT_ROOMOTE_STYLE_GUIDANCE = [", "ROOMOTE_NOMENCLATURE_GUIDANCE,\n")
    assert len(sentences) == 7, len(sentences)
    style_section = "\n\n".join(sentences + [nomenclature, ownership])

    sp = read("Roomote", base + "system-prompt.ts")
    direct = literal(sp, "const DIRECT_USER_OPENING =")
    orchestrator = literal(sp, "const ORCHESTRATOR_OPENING =")
    identity = literal(sp, "const ROOMOTE_IDENTITY_SECTION =")
    engineering = literal(sp, "const ORCHESTRATOR_ENGINEERING_SECTION =")

    # Private session text for sandbox tasks (audience 'task').
    ps = read("Roomote", base + "private-session-guidance.ts")
    task_cannot_ask = literals(ps, "const cannotAsk =", "const delegation")[2]
    private = fill(literal(ps, "  return "), {"heading": "#", "cannotAsk": task_cannot_ask, "delegation": ""})

    # buildRoomoteSystemPrompt without a release version, so the release line is left out.
    direct_prompt = "\n\n".join([direct, identity, f"# Personality\n\n{style_section}"])
    orchestrator_prompt = "\n\n".join([orchestrator, identity, f"{engineering}\n\n{nomenclature}\n\n{ownership}"])
    write("roomote", "system-direct-user.md", direct_prompt)
    write("roomote", "system-orchestrator.md", orchestrator_prompt)
    write("roomote", "private-session-task.md", private)
    write("roomote", "compact.md", literal(read("Roomote", base + "compact-prompt.ts"), "ROOMOTE_COMPACT_PROMPT ="))
    write("roomote", "multi-agent.md",
          literal(read("Roomote", base + "standard-task-multi-agent-guidance.ts"), "STANDARD_TASK_MULTI_AGENT_GUIDANCE ="))

    sub = read("Roomote", base + "opencode-prompt-subagents.ts")
    explore = literals(sub, "export function createRoomoteExploreAgentPrompt(", "].join('\\n\\n');")
    write("roomote", "subagent-explore.md",
          fill("\n\n".join(explore), {"JSON.stringify(jevgrepSkillPath)": '"<jevgrep skill path>"'}))
    write("roomote", "subagent-proof-judge.md",
          "\n".join(literals(sub, "function createProofJudgeAgentPrompt(): string {", "].join('\\n');")))

    # Judge and advisor prompts for the Fast agent (contextOnly: true). Each element of their arrays
    # is a literal or `options.contextOnly ? a : b`; take `a` from each such pair.
    def context_only(start):
        body = sub[sub.index(start):]
        body = body[body.index("return ["):body.index("].join('\\n');")]
        parts, i = [], 0
        while True:
            nxt = [body.index(q, i) for q in "'\"`" if q in body[i:]]
            if not nxt:
                return "\n".join(parts)
            j = min(nxt)
            value, i = literal_at(body, j)
            if body[:j].rstrip().endswith("?"):
                parts.append(value)  # the `contextOnly` branch; skip the other one
                k = body.index(":", i)
                _, i = literal_at(body, min(body.index(q, k) for q in "'\"`" if q in body[k:]))
            else:
                parts.append(value)

    write("roomote", "subagent-judge-fast.md",
          context_only("export function createRoomoteJudgeAgentPrompt("))
    write("roomote", "subagent-advisor-fast.md",
          context_only("export function createRoomoteAdvisorAgentPrompt("))
    copy_license("Roomote", "roomote")


for folder in ("opencode", "cline", "roomote"):
    shutil.rmtree(os.path.join(OUT, folder, "prompts"), ignore_errors=True)
opencode()
cline()
roomote()
for repo in ("opencode", "cline", "Roomote"):
    print(repo, commit(repo))
