{{- $page := .page -}}
{{- if and (not $page.Draft) (not $page.Params.agent_map_exclude) ($page.OutputFormats.Get "HTML") -}}
  {{- $title := $page.Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- printf "- [%s](%s)" $title $page.RelPermalink -}}
  {{- with partial "agent-map/status.html" $page -}}
    {{- printf " **[%s]**" . -}}
  {{- end -}}
  {{- if and (not .compact) (ne $page.Params.agent_map_descriptions false) -}}
    {{- with partial "main/navigation-description.html" $page -}}
      {{- /* Plain-text summaries can contain code such as [x](app://{{id}}); escape brackets so Hugo doesn't parse them as links. */ -}}
      {{- printf " — %s" (replace (replace . "[" "\\[") "]" "\\]") -}}
    {{- end -}}
  {{- end -}}
  {{- printf "\n" -}}
{{- end -}}
