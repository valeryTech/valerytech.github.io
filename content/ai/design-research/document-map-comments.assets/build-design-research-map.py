#!/usr/bin/env python3
"""Read the collection and emit a document map without changing any files.

Use --emit markdown or --emit json to print an updated map. Save changes with
apply_patch. Use --check to check the saved maps against the current notes.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "ai/design-research"
SPEC = BASE / "document-map-relations.json"
MAP_COMMENTS = BASE / "document-map-comments.md"
OUTPUTS = {"markdown": BASE / "document-map.md", "json": BASE / "document-map.json"}
EXCLUDED = {p.name for p in OUTPUTS.values()} | {SPEC.name}
INVENTORY_EXCLUDED = EXCLUDED | {MAP_COMMENTS.name}
GROUPS = {
    "00-overview": ("O", "Overview"),
    "01-foundations": ("F", "Foundations"),
    "02-human-ai-collaboration": ("C", "Human and AI collaboration"),
    "03-language-and-compiler": ("L", "Language and compiler"),
    "04-investigation-and-epistemics": ("I", "Investigation and epistemics"),
    "05-runtime-and-execution": ("R", "Runtime and execution"),
    "06-research-reports": ("E", "Research reports and evaluation"),
    "07-sources": ("S", "Captured source material"),
}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def slug(text: str) -> str:
    text = re.sub(r"\[([^]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]*>", "", text).lower()
    return "".join(c for c in text if c in "_- " or
                   unicodedata.category(c)[0] in "LN").replace(" ", "-")


def visible_lines(text: str, preserve_inline=False) -> list[str]:
    """Keep line numbers while excluding fenced code, comments and inline code."""
    result = []
    fence = None
    in_comment = False
    for raw in text.splitlines():
        match = re.match(r"^ {0,3}(`{3,}|~{3,})", raw)
        if fence:
            if match and match[1][0] == fence[0] and len(match[1]) >= len(fence):
                fence = None
            result.append("")
            continue
        if match:
            fence = match[1]
            result.append("")
            continue
        line = raw
        if in_comment:
            end = line.find("-->")
            if end < 0:
                result.append("")
                continue
            line = line[end + 3:]
            in_comment = False
        while "<!--" in line:
            start = line.find("<!--")
            end = line.find("-->", start + 4)
            if end < 0:
                line = line[:start]
                in_comment = True
                break
            line = line[:start] + line[end + 3:]
        if not preserve_inline:
            line = re.sub(r"(`+)(.*?)\1", lambda m: " " * len(m[0]), line)
        result.append(line)
    return result


def headings(text: str) -> list[dict]:
    seen = Counter()
    result = []
    for number, line in enumerate(visible_lines(text, preserve_inline=True), 1):
        match = re.match(r"^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if match:
            base = slug(match[2])
            anchor = base + (f"-{seen[base]}" if seen[base] else "")
            seen[base] += 1
            result.append({"line": number, "level": len(match[1]),
                           "title": match[2], "anchor": anchor})
    return result


def html_anchors(text: str) -> list[str]:
    return sorted({m[1] for line in visible_lines(text) for m in
                   re.finditer(r'<a\s+(?:id|name)=["\']([^"\']+)["\']', line)})


def inline_links(line: str):
    """Read balanced Markdown destinations, including parentheses and titles."""
    pattern = re.compile(r"(?<!!)\[([^\n]+?)\]\(")
    position = 0
    while match := pattern.search(line, position):
        start = match.end()
        position = start
        if start < len(line) and line[start] == "<":
            end = line.find(">", start + 1)
            close = line.find(")", end + 1) if end >= 0 else -1
            if close >= 0:
                yield match[1], line[start + 1:end], "markdown"
                position = close + 1
            continue
        depth = 1
        i = start
        while i < len(line) and depth:
            if line[i] == "\\":
                i += 2
                continue
            if line[i] == "(":
                depth += 1
            elif line[i] == ")":
                depth -= 1
            i += 1
        if depth:
            continue
        value = line[start:i - 1].strip()
        value = re.sub(r"\s+[\"'].*$", "", value)
        yield match[1], value, "markdown"
        position = i


def links(text: str):
    lines = visible_lines(text)
    definitions = {}
    for number, line in enumerate(lines, 1):
        match = re.match(r"^ {0,3}\[([^]^]+)\]:\s*(?:<([^>]+)>|(\S+))", line)
        if match:
            definitions[match[1].casefold()] = (match[2] or match[3], number)
    for number, line in enumerate(lines, 1):
        if re.match(r"^ {0,3}\[[^]]+\]:", line):
            continue
        for label, target, style in inline_links(line):
            yield {"line": number, "label": label, "target": target, "syntax": style}
        for match in re.finditer(r"(?<!!)\[\[([^]\n]+)\]\]", line):
            target, _, alias = match[1].partition("|")
            yield {"line": number, "label": alias or target,
                   "target": target, "syntax": "wiki"}
        masked = re.sub(r"\[\[[^]]+\]\]", "", line)
        masked = re.sub(r"\[[^]]+\]\([^)]*\)", "", masked)
        used = []
        for match in re.finditer(r"(?<!!)\[([^]^]+)\]\[([^]]*)\]", masked):
            key = (match[2] or match[1]).casefold()
            if key in definitions:
                target, definition = definitions[key]
                yield {"line": number, "label": match[1], "target": target,
                       "syntax": "reference", "definitionLine": definition}
                used.append(match.span())
        for start, end in reversed(used):
            masked = masked[:start] + " " * (end - start) + masked[end:]
        for match in re.finditer(r"(?<![!\[])\[([^]^]+)\](?![\](])", masked):
            key = match[1].casefold()
            if key in definitions:
                target, definition = definitions[key]
                yield {"line": number, "label": match[1], "target": target,
                       "syntax": "reference", "definitionLine": definition}


def file_list(root: Path) -> list[Path]:
    run = subprocess.run(["rg", "--files", str(root)], capture_output=True, text=True)
    if run.returncode not in (0, 1):
        raise RuntimeError(run.stderr)
    return sorted(Path(p) for p in run.stdout.splitlines())


def doc_id(relative: str) -> str:
    p = Path(relative)
    if p.parent.name in GROUPS:
        prefix = GROUPS[p.parent.name][0]
        number = re.match(r"\d+", p.name)
        if number:
            return prefix + number[0] + ("C" if p.stem.endswith("-comments") else "")
    return {"00-index.md": "GUIDE", "00-index-comments.md": "GUIDE-C",
            "reassembly-map.md": "AUDIT",
            "declarative-system-config-reassembly.json": "AUDIT-DATA"}.get(relative, relative)


def collect():
    spec = json.loads(SPEC.read_text())
    paths = [p for p in file_list(BASE) if p.name not in INVENTORY_EXCLUDED]
    texts = {}
    nodes = []
    metadata = {}
    descriptions = {}
    index_text = (BASE / "00-index.md").read_text()
    for line in index_text.splitlines():
        match = re.match(r"^- \[([^]]+)\]\(([^)#]+)\): (.+)$", line)
        if match:
            descriptions[match[2]] = {"title": match[1], "description": match[3]}
    for p in paths:
        raw = p.read_bytes()
        relative = p.relative_to(BASE).as_posix()
        text = raw.decode("utf-8") if p.suffix == ".md" else ""
        texts[p] = text
        hs = headings(text)
        title = descriptions.get(relative, {}).get("title")
        title = title or next((h["title"] for h in hs if h["level"] == 1), p.stem)
        kind = "comments" if p.stem.endswith("-comments") else "note"
        if p.name in ("00-index.md", "reassembly-map.md") or p.suffix != ".md":
            kind = "navigation" if p.name == "00-index.md" else "audit"
        node = {"id": doc_id(relative), "path": relative, "title": title, "kind": kind,
                "group": p.parent.name if p.parent != BASE else "collection",
                "bytes": len(raw), "sha256": digest(raw), "headings": hs,
                "htmlAnchors": html_anchors(text)}
        if relative in descriptions:
            node["description"] = descriptions[relative]["description"]
        nodes.append(node)
        metadata[p] = node
    ids = {n["id"]: n for n in nodes}
    if len(ids) != len(nodes):
        raise ValueError("Duplicate document IDs")
    # Index only filenames in the two named note roots for legacy wiki links.
    wiki = defaultdict(list)
    for root in (ROOT, ROOT.parent / "notes-acc"):
        if root.exists():
            for p in file_list(root):
                if p.suffix == ".md":
                    wiki[p.stem].append(p)
    for key in wiki:
        wiki[key] = sorted({p.resolve() for p in wiki[key]})
    edges = {}
    external = {}
    unresolved = []
    invalid_anchors = []
    uri_count = 0
    for p, text in texts.items():
        if not text:
            continue
        for link in links(text):
            target = link["target"]
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target) or target.startswith("//"):
                uri_count += 1
                continue
            name, _, anchor = unquote(target).partition("#")
            if link["syntax"] == "wiki":
                if not name:
                    candidates = [p]
                else:
                    local = p.parent / (name if name.endswith(".md") else name + ".md")
                    if local.exists():
                        candidates = [local]
                    elif "/" in name:
                        candidates = [root / (name if name.endswith(".md") else name + ".md")
                                      for root in (ROOT, ROOT / "ai", ROOT.parent / "notes-acc")]
                        candidates = [x for x in candidates if x.exists()]
                    else:
                        candidates = wiki.get(name.removesuffix(".md"), [])
                if len(candidates) != 1:
                    unresolved.append({"from": metadata[p]["id"], **link,
                                       "reason": "ambiguous" if candidates else "unresolved",
                                       "candidates": [str(x) for x in candidates]})
                    continue
                destination = candidates[0].resolve()
            else:
                destination = (p.parent / name).absolute() if name else p
                destination = Path(os.path.normpath(destination)).resolve()
            if destination.name in INVENTORY_EXCLUDED and destination.parent == BASE:
                continue
            if not destination.exists():
                unresolved.append({"from": metadata[p]["id"], **link, "reason": "missing"})
                continue
            if destination in metadata:
                node = metadata[destination]
            else:
                eid = "local:" + str(destination)
                if eid not in external:
                    raw = destination.read_bytes() if destination.is_file() else b""
                    ext_text = raw.decode("utf-8", errors="replace") if destination.suffix == ".md" else ""
                    hs = headings(ext_text)
                    external[eid] = {"id": eid, "path": str(destination), "kind": "local-reference",
                                     "title": next((h["title"] for h in hs if h["level"] == 1), destination.name),
                                     "bytes": len(raw), "sha256": digest(raw), "headings": hs,
                                     "htmlAnchors": html_anchors(ext_text)}
                node = external[eid]
            if anchor and destination.suffix == ".md":
                valid = {h["anchor"] for h in node["headings"]} | set(node["htmlAnchors"])
                if anchor not in valid and slug(anchor) not in valid:
                    invalid_anchors.append({"from": metadata[p]["id"], **link, "to": node["id"]})
            source = metadata[p]
            kind = "audit-reference" if source["kind"] == "audit" or node["kind"] == "audit" else "explicit-link"
            if node["kind"] == "local-reference":
                kind = "local-reference"
            key = (source["id"], node["id"], kind)
            if key not in edges:
                edges[key] = {"from": key[0], "to": key[1], "kind": kind, "occurrences": []}
            occurrence = {"line": link["line"], "target": target, "syntax": link["syntax"]}
            if occurrence not in edges[key]["occurrences"]:
                edges[key]["occurrences"].append(occurrence)
    sibling = []
    for n in nodes:
        if n["kind"] == "comments":
            parent = n["path"].replace("-comments.md", ".md")
            target = next((x for x in nodes if x["path"] == parent), None)
            if not target:
                raise ValueError(f"Comment has no sibling: {n['path']}")
            sibling.append({"from": n["id"], "to": target["id"], "kind": "comments-on",
                            "evidence": "Matching sibling paths; content is separate from the retained note."})
    semantic = []
    for relation in spec["relations"]:
        if relation["from"] not in ids or relation["to"] not in ids:
            raise ValueError(f"Unknown conceptual endpoint: {relation}")
        checked = []
        for item in relation["evidence"]:
            file = BASE / item["file"]
            lines = texts.get(file, file.read_text()).splitlines()
            matches = [i + 1 for i, line in enumerate(lines) if item["find"] in line]
            if not matches:
                raise ValueError(f"Evidence not found: {item}")
            if item["file"] == '00-index.md' and item["find"].startswith('('):
                primary = re.compile(r'^- \[[^]]+\]' + re.escape(item["find"]) + r':')
                matches = [i for i in matches if primary.match(lines[i - 1])] or matches
            number = matches[0]
            hs = headings("\n".join(lines))
            prior = [h for h in hs if h["line"] <= number]
            checked.append({**item, "line": number, "anchor": prior[-1]["anchor"] if prior else ""})
        semantic.append({**relation, "kind": "conceptual", "status": "editorial interpretation",
                         "evidence": checked})
    for diagram in spec["diagrams"]:
        for number in diagram["relations"]:
            if not 0 <= number < len(semantic):
                raise ValueError("Invalid diagram relationship")
    content_ids = {n["id"] for n in nodes if n["kind"] == "note"}
    related_ids = {r[key] for r in semantic for key in ("from", "to")}
    diagram_ids = {semantic[i][key] for d in spec["diagrams"]
                   for i in d["relations"] for key in ("from", "to")}
    coverage = {"contentNotes": len(content_ids),
                "withConceptualRelationships": len(content_ids & related_ids),
                "inTopicDiagrams": len(content_ids & diagram_ids),
                "withoutConceptualRelationships": sorted(content_ids - related_ids)}
    map_commentary = None
    if MAP_COMMENTS.exists():
        raw = MAP_COMMENTS.read_bytes()
        map_commentary = {"path": MAP_COMMENTS.name, "kind": "editorial-commentary",
                          "bytes": len(raw), "sha256": digest(raw),
                          "includedInInventory": False}
    return {"schemaVersion": 1, "scope": "Files within ai/design-research and their direct local references.",
            "excludedGeneratedFiles": sorted(EXCLUDED),
            "mapCommentary": map_commentary, "conceptualCoverage": coverage,
            "interpretation": "Conceptual links are editorial navigation, not verified dependencies or accepted decisions.",
            "specSha256": digest(SPEC.read_bytes()), "nodes": nodes,
            "localReferences": sorted(external.values(), key=lambda n: n["path"]),
            "links": sorted(edges.values(), key=lambda e: (e["from"], e["to"], e["kind"])),
            "comments": sibling, "conceptualRelations": semantic, "diagrams": spec["diagrams"],
            "findings": {"unresolvedLinks": unresolved, "invalidAnchors": invalid_anchors,
                         "uriLinksNotChecked": uri_count,
                         "limitations": ["External collections are boundary references, not a complete map of notes or notes-acc.",
                                         "Legacy wiki links are resolved only when a local path or unique filename identifies a file.",
                                         "Code, audit table paths in code spans, citations, and plain-text mentions are not document links.",
                                         "Inline links must stay on one line. Setext headings are not indexed; HTML a elements with id or name are indexed.",
                                         "Audit links show recorded history; they do not recheck prior byte-range reconstructions.",
                                         "Local reference titles and hashes describe the present file, which may be a redirect."]}}


def render(data):
    ids = {n["id"]: n for n in data["nodes"]}
    reference = {n["id"]: n for n in data["localReferences"]}
    def link(identifier, short=False):
        n = ids.get(identifier) or reference[identifier]
        label = identifier if short else n["title"]
        path = n["path"]
        if n["kind"] == "local-reference":
            path = os.path.relpath(path, BASE)
        path = path.replace(" ", "%20")
        return f"[{label}]({path})"
    def evidence(item):
        anchor = "#" + item["anchor"] if item["anchor"] else ""
        return f"[Evidence]({item['file']}{anchor}) (line {item['line']})"
    notes = [n for n in data["nodes"] if n["kind"] == "note"]
    comments = data["comments"]
    siblings = {e["to"]: e["from"] for e in comments}
    coverage = data["conceptualCoverage"]
    rows = ["# Design research document map", "",
            "<!-- Generated by _scripts/build_design_research_map.py. Edit document-map-relations.json for conceptual relationships. -->", "",
            "The map covers the current design-research collection and its direct local references. The [index](00-index.md) gives descriptions and a reading order. The [reassembly log](reassembly-map.md) records original text movements and preservation checks.", "",
            "Conceptual arrows show suggested relationships between discussions. They do not establish mathematical dependencies, causal relations, an accepted architecture, or a required research sequence. Original dialogues and sibling comments remain separate.", "",
            f"The snapshot includes {len(notes)} content notes, {len(comments)} sibling comment notes, and {len(data['nodes']) - len(notes) - len(comments)} navigation or audit files. It also records {len(data['localReferences'])} direct local references outside the collection.", "",
            "## How to use the map", "",
            "First, use the topic diagrams to choose a discussion. Second, use the catalogue to follow explicit links and read the sibling comments. Third, use the conceptual relationship table to inspect the reason for each arrow.", "",
            "The IDs identify files. O means overview, F means foundations, C means collaboration, L means language, I means investigation, R means runtime, E means reports and evaluation, and S means source material. A final C identifies a sibling comments file.", "",
            "| Relationship | Meaning | Evidence |", "|---|---|---|",
            "| Conceptual | A suggested relation between the content of two discussions. | A checked passage and its current line number. |",
            "| Explicit link | One document links to another file. | The original link location, stored in the data snapshot. |",
            "| Comments on | A comments file has a matching sibling note. | The current file paths. |",
            "| Local reference | A note links outside the collection. | The current target file and link location. A reference alone does not prove source origin. |",
            "| Audit reference | A link concerns the movement log or another audit file. | The recorded link. Historical checks have not been rerun by the map builder. |", "",
            "## Topic diagrams", "",
            "The diagrams show selected conceptual relations. The complete file catalogue and relationship table follow them, so omitted arrows do not imply that a note is unrelated.", ""]
    coverage_rows = ["## Conceptual coverage", "",
                     f"The relationship table connects {coverage['withConceptualRelationships']} of {coverage['contentNotes']} content notes through {len(data['conceptualRelations'])} authored relationships. The {len(data['diagrams'])} topic diagrams show {coverage['inTopicDiagrams']} content notes. Coverage describes navigation, not completeness of the research or strength of its evidence.", ""]
    if coverage["withoutConceptualRelationships"]:
        coverage_rows.extend(["Catalogue entries without conceptual arrows: " +
                              ", ".join(link(i, True) for i in coverage["withoutConceptualRelationships"]) +
                              ". Their explicit links remain in the catalogue and data snapshot.", ""])
    if data["mapCommentary"]:
        coverage_rows.extend(["The sibling [map comments](document-map-comments.md) explain the reviewed gaps, the historical index, and the remaining work. The comments are separate editorial analysis and are excluded from relationship extraction.", ""])
    position = rows.index("## Topic diagrams")
    rows[position:position] = coverage_rows
    for diagram in data["diagrams"]:
        rows.extend(["### " + diagram["title"], "", diagram["description"], "", "```mermaid", "flowchart TD"])
        selected = [data["conceptualRelations"][i] for i in diagram["relations"]]
        participants = sorted({r[key] for r in selected for key in ("from", "to")})
        for identifier in participants:
            title = ids[identifier]["title"].replace('"', "'")
            rows.append(f'  {identifier}["{identifier}: {title}"]')
        for r in selected:
            rows.append(f'  {r["from"]} -->|"{r["label"]}"| {r["to"]}')
        rows.extend(["```", "", "Documents: " + ", ".join(link(p, True) for p in participants) + ".", ""])
    rows.extend(["## Conceptual relationships", "",
                 "The labels are new interpretation for navigation. Each evidence link opens the relevant section, and the JSON snapshot retains the exact matching text.", "",
                 "| From | Relationship | To | Evidence |", "|---|---|---|---|"])
    for relation in data["conceptualRelations"]:
        refs = list(dict.fromkeys(evidence(e) for e in relation["evidence"]))
        rows.append(f"| {link(relation['from'], True)} | {relation['label']}. {relation['reason']} | {link(relation['to'], True)} | " + "<br>".join(refs) + " |")
    rows.extend(["", "## Boundaries and open choices", "",
                 "The map retains the distinctions below. Grouping discussions does not resolve their differences.", "",
                 "| Discussions | Distinction to retain |", "|---|---|"])
    for boundary in json.loads(SPEC.read_text())["boundaries"]:
        rows.append("| " + ", ".join(link(i, True) for i in boundary["documents"]) + " | " + boundary["text"] + " |")
    rows.extend(["", "## Complete file catalogue", "",
                 "The explicit-link column lists all distinct outgoing links to content notes in the collection. Self-links, comments, navigation, and audit links are kept in the data snapshot but omitted from the column. An empty entry means there is no such explicit link, not that the subjects are unrelated.", ""])
    for group, (_, title) in GROUPS.items():
        group_notes = [n for n in notes if n["group"] == group]
        rows.extend(["### " + title, "", "| Document | Explicit links to content notes | Sibling comments |", "|---|---|---|"])
        for n in group_notes:
            targets = sorted({e["to"] for e in data["links"] if e["from"] == n["id"] and e["to"] in ids and ids[e["to"]]["kind"] == "note" and e["to"] != n["id"]})
            related = ", ".join(link(t, True) for t in targets) or "None recorded."
            comment = link(siblings[n["id"]], True) if n["id"] in siblings else "No sibling."
            rows.append(f"| {n['id']}: {link(n['id'])} | {related} | {comment} |")
        rows.append("")
    rows.extend(["### Collection navigation and audit files", "", "| Document | Role |", "|---|---|"])
    for n in data["nodes"]:
        if n["group"] == "collection":
            rows.append(f"| {n['id']}: {link(n['id'])} | {n['kind']} |")
    rows.extend(["", "## Sources and related local collections", "",
                 "The references below connect the collection to source redirects, retained contextual drafts, project examples, and the sibling interactive-systems collection. Only direct references are mapped. The source and audit logs remain authoritative for original ranges; the map does not infer text origin from a link.", "",
                 "| Referenced file | Linked from |", "|---|---|"])
    for n in data["localReferences"]:
        sources = sorted({e["from"] for e in data["links"] if e["to"] == n["id"]})
        filename = os.path.relpath(n["path"], ROOT.parent)
        path = os.path.relpath(n["path"], BASE).replace(" ", "%20")
        rows.append(f"| [{filename}]({path}) | " + ", ".join(link(s, True) for s in sources) + " |")
    rows.extend(["", "## Navigation findings", "",
                 "The findings are observations about the current files. No existing note or source redirect was repaired while building the map.", ""])
    findings = data["findings"]
    if not findings["unresolvedLinks"] and not findings["invalidAnchors"]:
        rows.append("All extracted local links resolved to existing targets and indexed headings.")
    else:
        rows.extend(["| Document | Line | Reference | Finding |", "|---|---:|---|---|"])
        for issue in findings["unresolvedLinks"] + findings["invalidAnchors"]:
            reason = issue.get("reason", "Heading anchor not indexed.")
            target = issue["target"].replace("|", "&#124;").replace("`", "&#96;")
            if issue.get("candidates"):
                reason += f" ({len(issue['candidates'])} candidate files; no guess made)."
            rows.append(f"| {link(issue['from'], True)} | {issue['line']} | `{target}` | {reason} |")
    rows.extend(["", f"The scan skipped live verification of {findings['uriLinksNotChecked']} URI links, including web and application links. Their presence does not verify a cited claim.", "",
                 "## Data and maintenance", "",
                 "The [data snapshot](document-map.json) contains every mapped file's hash, explicit outgoing and incoming relationships, link occurrences, sibling pairs, conceptual evidence, and navigation findings. Incoming relationships can be found by a relationship's `to` field. The [relationship definitions](document-map-relations.json) contain the authored interpretations and diagram selections.", "",
                 "The map builder reads the notes without changing them. Check the saved map from the notes root:", "", "```sh", "python3 _scripts/build_design_research_map.py --check", "```", "",
                 "After notes change, inspect updated output with `--emit markdown` and `--emit json`, then apply the output to the generated files with a patch. The checker reports stale output rather than rewriting notes. Update evidence passages when the meaning changes, not merely to make a check pass.", "",
                 "The generated map files, relationship definitions, and sibling map comments are excluded from the document inventory to avoid counting the map's own links as evidence. The data snapshot records the map comments separately by path and hash. The index link to the map is also excluded from relationship extraction.", "",
                 "Limits of the scan:", ""])
    rows.extend("- " + s for s in findings["limitations"])
    return "\n".join(rows) + "\n"


def json_output(data):
    # Keep one object per line so link occurrences remain readable without a large file.
    parts = []
    for key, value in data.items():
        if isinstance(value, list):
            body = ",\n".join("    " + json.dumps(v, ensure_ascii=False) for v in value)
            parts.append(f"  {json.dumps(key)}: [\n{body}\n  ]")
        else:
            parts.append(f"  {json.dumps(key)}: " + json.dumps(value, ensure_ascii=False))
    return "{\n" + ",\n".join(parts) + "\n}\n"


def self_test():
    sample = '# Title\n## Same\n## Same\n`[hidden](x.md)`\n```md\n[hidden](y.md)\n```\n[shown](a(b).md#head)\n[angle](<a b.md> "title")\n[[other#Heading|Alias]]\n[full][ref]\n[short]\n[ref]: c.md\n[short]: d.md\n'
    found = list(links(sample))
    assert [x["target"] for x in found] == ['a(b).md#head', 'a b.md', 'other#Heading', 'c.md', 'd.md'], found
    assert [x["line"] for x in found] == [8, 9, 10, 11, 12]
    assert [h["anchor"] for h in headings(sample)] == ['title', 'same', 'same-1']
    assert headings('## The `Contract` type\n')[0]['anchor'] == 'the-contract-type'
    assert html_anchors('<a id="ref-1"></a>\n`<a id="hidden"></a>`\n') == ['ref-1']
    assert not list(links('<!-- [hidden](x.md) -->\n[^cite]: https://x.test\n[^cite]\n'))
    assert doc_id('01-foundations/12-research-terms-and-levels-of-analysis-comments.md') == 'F12C'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--emit', choices=('markdown', 'json'))
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    self_test()
    if args.self_test:
        print('Parser self-tests passed.')
        return
    data = collect()
    outputs = {'markdown': render(data), 'json': json_output(data)}
    if args.emit:
        print(outputs[args.emit], end='')
        return
    stale = [p.name for kind, p in OUTPUTS.items() if not p.exists() or p.read_text() != outputs[kind]]
    report = {'files': len(data['nodes']), 'localReferences': len(data['localReferences']),
              'explicitRelationships': len(data['links']), 'conceptualRelationships': len(data['conceptualRelations']),
              'comments': len(data['comments']), 'unresolvedLinks': len(data['findings']['unresolvedLinks']),
              'invalidAnchors': len(data['findings']['invalidAnchors']), 'staleOutputs': stale}
    print(json.dumps(report, indent=2))
    if args.check and stale:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
