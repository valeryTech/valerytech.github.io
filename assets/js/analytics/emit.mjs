export function sendAnalyticsEvent(name, parameters = {}) {
  window.siteAnalytics?.emit(name, parameters);
}
