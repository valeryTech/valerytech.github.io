{{- $links := slice -}}
{{- range . -}}
  {{- $page := . -}}
  {{- $title := .Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- if and (not .Draft) (.OutputFormats.Get "HTML") -}}
    {{- range .Aliases -}}
      {{- $links = $links | append (printf "- [%s](%s) → [%s](%s)\n" . (. | absURL) $title $page.Permalink) -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- with $links -}}
  {{- printf "\n## Legacy URLs and redirects\n\n" -}}
  {{- range . -}}{{- printf "%s" . -}}{{- end -}}
{{- end -}}
