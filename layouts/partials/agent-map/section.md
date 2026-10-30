{{- $title := .Title | plainify | htmlUnescape -}}
{{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
{{- printf "# %s: section map for agents\n\n" $title -}}
{{- printf "[Main map](%s) · [This map](%s) · [Section overview](%s)\n\n" (partial "agent-map/url.html" site.Home) (partial "agent-map/url.html" .) .RelPermalink -}}
{{- with .Description -}}
  {{- if ne . "Default Description" -}}
    {{- printf "%s\n\n" (. | plainify | htmlUnescape | replaceRE `\s+` " " | truncate 240) -}}
  {{- end -}}
{{- end -}}
{{- printf "All documents in this collection are listed below, grouped by subsection.\n\n" -}}
{{- partial "agent-map/status-key.md" . -}}
{{- if .RegularPages -}}
  {{- printf "## Documents\n\n" -}}
{{- end -}}
{{- partial "agent-map/contents.md" (dict "section" . "level" 2) -}}
{{- printf "\nUse the main map to explore other collections. Descriptions come from note metadata or the page summary; working notes and versions retain their own scope.\n" -}}
