{{- $section := .section -}}
{{- $level := .level -}}
{{- range $section.RegularPages.ByTitle -}}
  {{- partial "agent-map/entry.md" (dict "page" .) -}}
{{- end -}}
{{- range $section.Sections.ByTitle -}}
  {{- $title := .Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- printf "\n%s [%s](%s)" (strings.Repeat $level "#") $title .RelPermalink -}}
  {{- with partial "agent-map/status.html" . -}}
    {{- printf " **[%s]**" . -}}
  {{- end -}}
  {{- printf "\n\n" -}}
  {{- with .Description -}}
    {{- if ne . "Default Description" -}}
      {{- printf "%s\n\n" (. | plainify | htmlUnescape | replaceRE `\s+` " " | truncate 240) -}}
    {{- end -}}
  {{- end -}}
  {{- partial "agent-map/contents.md" (dict "section" . "level" (math.Min 6 (add $level 1) | int)) -}}
{{- end -}}
