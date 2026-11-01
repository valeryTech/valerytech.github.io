{{- $page := .page -}}
{{- if and (not $page.Draft) (not $page.Params.agent_map_exclude) ($page.OutputFormats.Get "HTML") -}}
  {{- $title := $page.Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- printf "- [%s](%s)" $title $page.RelPermalink -}}
  {{- with partial "agent-map/status.html" $page -}}
    {{- printf " **[%s]**" . -}}
  {{- end -}}
  {{- if not .compact -}}
    {{- with partial "main/navigation-description.html" $page -}}
      {{- printf " — %s" . -}}
    {{- end -}}
  {{- end -}}
  {{- printf "\n" -}}
{{- end -}}
