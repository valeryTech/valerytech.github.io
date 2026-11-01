{{- printf "# %s: website map for agents\n\n" site.Title -}}
{{- printf "Evaluation and AI are the main collections. The section maps list all published notes.\n\n" -}}
{{- partial "research/agent-summary.md" . -}}
{{- partial "agent-map/status-key.md" . -}}
{{- printf "[Website](%s) · [Main map](%s)\n\n" site.Home.RelPermalink (partial "agent-map/url.html" site.Home) -}}
{{- printf "## Section maps\n\n" -}}
{{- range site.Sections.ByTitle -}}
  {{- partial "agent-map/collection.md" (dict "section" . "compact" true) -}}
{{- end -}}
{{- printf "\n## Main documents\n\n" -}}
{{- $data := hugo.Data -}}
{{- range $data.agent_navigation.main_documents -}}
  {{- with site.GetPage . -}}
    {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
  {{- end -}}
{{- end -}}
{{- printf "\n## Website information\n\n" -}}
{{- partial "agent-map/entry.md" (dict "page" site.Home "compact" true) -}}
{{- range site.Home.RegularPages.ByTitle -}}
  {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
{{- end -}}
{{- range site.Sections.ByTitle -}}
  {{- if and (ne .Section "agent-map") (not (.OutputFormats.Get "agentText")) -}}
    {{- range where site.Pages "Section" .Section -}}
      {{- if ne .Section "research" -}}
        {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
      {{- end -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- range where site.Pages "Kind" "in" (slice "taxonomy" "term") -}}
  {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
{{- end -}}
{{- with site.GetPage "/reading-and-evaluating" -}}
  {{- printf "\n[%s](%s) describes the notes and published model conversations.\n" .Title .RelPermalink -}}
{{- end -}}
{{- printf "\nGenerated from the published pages.\n" -}}
