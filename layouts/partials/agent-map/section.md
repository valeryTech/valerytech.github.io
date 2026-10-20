{{- $title := .Title | plainify | htmlUnescape -}}
{{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
{{- printf "# %s: section map for agents\n\n" $title -}}
{{- printf "[Main map](%s) · [This map](%s) · [Section overview](%s)\n\n" ((site.Home.OutputFormats.Get "agentText").Permalink) ((.OutputFormats.Get "agentText").Permalink) .Permalink -}}
{{- with .Description -}}
  {{- if ne . "Default Description" -}}
    {{- printf "%s\n\n" (. | plainify | htmlUnescape | replaceRE `\s+` " " | truncate 240) -}}
  {{- end -}}
{{- end -}}
{{- printf "All documents in this collection are listed below, grouped by subsection.\n\n" -}}
{{- if .RegularPages -}}
  {{- printf "## Documents\n\n" -}}
{{- end -}}
{{- partial "agent-map/contents.md" (dict "section" . "level" 2) -}}
{{- partial "agent-map/aliases.md" (where site.Pages "Section" .Section) -}}
{{- printf "\nUse the main map to explore other collections. Descriptions come from note metadata or the page summary; working notes and versions retain their own scope.\n" -}}
