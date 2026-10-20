{{- $section := .section -}}
{{- $level := .level -}}
{{- $seen := .seen -}}
{{- if and (not $section.Draft) ($section.OutputFormats.Get "HTML") -}}
  {{- $seen.Set $section.RelPermalink true -}}
  {{- $title := $section.Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- printf "\n%s [%s](%s)\n\n" (strings.Repeat $level "#") $title $section.Permalink -}}
  {{- with $section.Description -}}
    {{- if ne . "Default Description" -}}
      {{- printf "%s\n\n" (. | plainify | htmlUnescape | replaceRE `\s+` " " | truncate 240) -}}
    {{- end -}}
  {{- end -}}
  {{- range $section.RegularPages.ByTitle -}}
    {{- partial "agent-map/entry.md" (dict "page" . "seen" $seen) -}}
  {{- end -}}
  {{- range $section.Sections.ByTitle -}}
    {{- partial "agent-map/section.md" (dict "section" . "level" (math.Min 6 (add $level 1) | int) "seen" $seen) -}}
  {{- end -}}
{{- end -}}
