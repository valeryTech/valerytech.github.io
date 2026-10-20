{{- $section := .section -}}
{{- with $section.OutputFormats.Get "agentText" -}}
  {{- if not $section.Draft -}}
    {{- $title := $section.Title | plainify | htmlUnescape -}}
    {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
    {{- printf "- [%s](%s)" $title .Permalink -}}
    {{- if not $.compact -}}
      {{- with $section.Description -}}
        {{- if ne . "Default Description" -}}
          {{- printf " — %s" (. | plainify | htmlUnescape | replaceRE `\s+` " " | truncate 240) -}}
        {{- end -}}
      {{- end -}}
    {{- end -}}
    {{- printf "\n" -}}
  {{- end -}}
{{- end -}}
