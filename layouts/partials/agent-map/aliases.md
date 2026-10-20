{{- $links := slice -}}
{{- range . -}}
  {{- $page := . -}}
  {{- $title := .Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- if and (not .Draft) (not .Params.agent_map_exclude) (.OutputFormats.Get "HTML") -}}
    {{- range .Aliases -}}
      {{- $links = $links | append (printf "- [%s](%s) → [%s](%s)\n" . (. | relURL) $title $page.RelPermalink) -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- with $links -}}
  {{- printf "\n## Legacy URLs and redirects\n\n" -}}
  {{- range . -}}{{- printf "%s" . -}}{{- end -}}
{{- end -}}
