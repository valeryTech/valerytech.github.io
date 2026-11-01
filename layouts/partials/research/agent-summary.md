{{- printf "## Start here\n\n" -}}
{{- range slice "/ai-engineering/evaluation" "/ai" "/ai-engineering" -}}
  {{- with site.GetPage . -}}
    {{- partial "agent-map/entry.md" (dict "page" . "compact" false) -}}
  {{- end -}}
{{- end -}}
{{- printf "\n" -}}
{{- range slice "/research" "/research/selected-implementations" -}}
  {{- with site.GetPage . -}}
    {{- partial "agent-map/entry.md" (dict "page" . "compact" true) -}}
  {{- end -}}
{{- end -}}
{{- printf "\n" -}}
