{{- printf "# %s: website map for agents\n\n" site.Title -}}
{{- printf "Start with a main section map or a selected document. Each section map contains all its documents, grouped by subsection.\n\n" -}}
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
{{- $information := slice site.Home -}}
{{- partial "agent-map/entry.md" (dict "page" site.Home "compact" true) -}}
{{- range site.Home.RegularPages.ByTitle -}}
  {{- $information = $information | append . -}}
  {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
{{- end -}}
{{- range site.Sections.ByTitle -}}
  {{- if and (ne .Section "agent-map") (not (.OutputFormats.Get "agentText")) -}}
    {{- range where site.Pages "Section" .Section -}}
      {{- $information = $information | append . -}}
      {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- range where site.Pages "Kind" "in" (slice "taxonomy" "term") -}}
  {{- $information = $information | append . -}}
  {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
{{- end -}}
{{- printf "- [Page not found](%s)\n" ("404.html" | relURL) -}}
{{- partial "agent-map/aliases.md" $information -}}
{{- printf "\nGenerated with the website. Follow the section-map links to discover the complete published collection.\n" -}}
