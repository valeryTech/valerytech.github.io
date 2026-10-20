{{- $section := .section -}}
{{- $level := .level -}}
{{- range $section.RegularPages.ByTitle -}}
  {{- partial "agent-map/entry.md" (dict "page" .) -}}
{{- end -}}
{{- range $section.Sections.ByTitle -}}
  {{- $title := .Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- printf "\n%s [%s](%s)\n\n" (strings.Repeat $level "#") $title .RelPermalink -}}
  {{- with .Description -}}
    {{- if ne . "Default Description" -}}
      {{- printf "%s\n\n" (. | plainify | htmlUnescape | replaceRE `\s+` " " | truncate 240) -}}
    {{- end -}}
  {{- end -}}
  {{- partial "agent-map/contents.md" (dict "section" . "level" (math.Min 6 (add $level 1) | int)) -}}
{{- end -}}
