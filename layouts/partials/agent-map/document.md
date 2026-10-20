{{- if .IsHome -}}
  {{- partial "agent-map/index.md" . -}}
{{- else -}}
  {{- partial "agent-map/section.md" . -}}
{{- end -}}
