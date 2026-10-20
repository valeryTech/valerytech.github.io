{{- $seen := newScratch -}}
{{- $map := .OutputFormats.Get "agentMap" -}}
{{- printf "# %s: website map for agents\n\n" site.Title -}}
{{- printf "A navigation index of the published website. Follow the links to read individual pages.\n\n" -}}
{{- printf "Website: [%s](%s) · Markdown map: [%s](%s)\n\n" site.Title site.Home.Permalink $map.Permalink $map.Permalink -}}
{{- printf "## How to use this map\n\n" -}}
{{- printf "- Choose a subject below, then follow its section overview or an individual article.\n" -}}
{{- printf "- Section headings are clickable landing pages. Each article has its own URL and a short description when available.\n" -}}
{{- printf "- Similar titles can refer to different pages. Use the complete URL, especially for evaluation versions v1 and v2.\n" -}}
{{- printf "- Working notes, alternatives, and proposals retain their own scope; a newer filename alone does not establish authority.\n" -}}
{{- printf "- Legacy URLs are listed at the end with their current destinations.\n\n" -}}
{{- printf "## Choose a starting point\n\n" -}}
{{- $startingPoints := slice
  (dict "path" "/ai-engineering/coding-agents" "topic" "Coding agents, context, comprehension, and ownership")
  (dict "path" "/ai-engineering/evaluation" "topic" "AI evaluation, evidence, test coverage, and failure analysis")
  (dict "path" "/ai-engineering/causal-stack" "topic" "AI failure mechanisms, fault families, and controls")
  (dict "path" "/ai-engineering/retrieval" "topic" "Retrieval, representations, and reframing")
  (dict "path" "/ai/operating-model" "topic" "AI operating models, delivery, and production commitments")
  (dict "path" "/ai/discovery" "topic" "Discovery and exploratory design")
  (dict "path" "/ai/system-evaluation" "topic" "Building and reviewing software with AI")
  (dict "path" "/engineering" "topic" "Software architecture, databases, testing, and delivery techniques")
  (dict "path" "/system-design" "topic" "System design frameworks, interviews, requirements, and worked exercises")
  (dict "path" "/projects" "topic" "Engineering project concepts")
-}}
{{- range $startingPoints -}}
  {{- $point := . -}}
  {{- with site.GetPage .path -}}
    {{- if .OutputFormats.Get "HTML" -}}
      {{- printf "- %s: [%s](%s)\n" $point.topic .Title .Permalink -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- printf "\n## Home and information\n\n" -}}
{{- partial "agent-map/entry.md" (dict "page" site.Home "seen" $seen) -}}
{{- range site.Home.RegularPages.ByTitle -}}
  {{- partial "agent-map/entry.md" (dict "page" . "seen" $seen) -}}
{{- end -}}
{{- range site.Sections.ByTitle -}}
  {{- partial "agent-map/section.md" (dict "section" . "level" 2 "seen" $seen) -}}
{{- end -}}
{{- printf "\n## Other published pages\n\n" -}}
{{- range site.Pages.ByTitle -}}
  {{- if not ($seen.Get .RelPermalink) -}}
    {{- partial "agent-map/entry.md" (dict "page" . "seen" $seen) -}}
  {{- end -}}
{{- end -}}
{{- printf "- [Page not found](%s) — Error page for missing URLs.\n" ("404.html" | absURL) -}}
{{- printf "\n## Legacy URLs and redirects\n\n" -}}
{{- range site.Pages.ByTitle -}}
  {{- $page := . -}}
  {{- $title := .Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- if and (not .Draft) (.OutputFormats.Get "HTML") -}}
    {{- range .Aliases -}}
      {{- printf "- [%s](%s) → [%s](%s)\n" . (. | absURL) $title $page.Permalink -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- printf "\nThis map is generated automatically with the website. It lists published pages; pagination URLs repeat the corresponding collections.\n" -}}
