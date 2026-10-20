{{- $page := .page -}}
{{- if and (not $page.Draft) ($page.OutputFormats.Get "HTML") -}}
  {{- $title := $page.Title | plainify | htmlUnescape -}}
  {{- $title = replace (replace $title "[" "\\[") "]" "\\]" -}}
  {{- printf "- [%s](%s)" $title $page.RelPermalink -}}
  {{- if not .compact -}}
    {{- $summary := $page.Description -}}
    {{- if or (not $summary) (eq $summary "Default Description") -}}
      {{- $summary = $page.Summary | plainify | htmlUnescape -}}
    {{- end -}}
    {{- $summary = replaceRE `\s+` " " $summary | strings.TrimSpace -}}
    {{- with $summary -}}
      {{- printf " — %s" (. | truncate 240) -}}
    {{- end -}}
  {{- end -}}
  {{- printf "\n" -}}
{{- end -}}
