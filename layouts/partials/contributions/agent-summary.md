{{- $records := partial "contributions/records.html" . -}}
{{- printf "## Contributions and connections\n\n" -}}
{{- range $records -}}
  {{- printf "- [%s](%s): %s\n" .Title .RelPermalink (.Description | plainify) -}}
{{- end -}}
{{- with site.GetPage "/contributions" -}}
  {{- printf "\n[Full contribution records](%s)" .RelPermalink -}}
{{- end -}}
{{- range where site.RegularPages "Params.contribution_route_id" "from-uncertainty-to-commitment" -}}
  {{- printf " · [Reading route: %s](%s)\n\n" .Title .RelPermalink -}}
{{- end -}}
