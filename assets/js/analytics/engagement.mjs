import { scrollDepthBucket } from "./helpers.mjs";
import { sendAnalyticsEvent } from "./emit.mjs";

function getVisiblePagePercent() {
  const pageHeight = document.documentElement.scrollHeight;
  if (pageHeight <= 0) {
    return 100;
  }

  return Math.min(100, Math.round(((window.scrollY + window.innerHeight) / pageHeight) * 100));
}

export function initReaderEngagementAnalytics(config) {
  const { requiredActiveSeconds, requiredVisiblePercent } = config;
  const startedAt = performance.now();
  let activeMilliseconds = 0;
  let lastTick = startedAt;
  let wasVisible = !document.hidden;
  let hasInteracted = false;
  let maxVisiblePercent = getVisiblePagePercent();
  let interactionCount = 0;
  let hasSentEngaged = false;
  let hasSentSummary = false;

  function markInteraction() {
    hasInteracted = true;
    interactionCount = Math.min(config.maxInteractions, interactionCount + 1);
  }

  function updateVisiblePercent() {
    maxVisiblePercent = Math.max(maxVisiblePercent, getVisiblePagePercent());
  }

  function accrue(now) {
    if (wasVisible) {
      activeMilliseconds += now - lastTick;
    }
    lastTick = now;
    wasVisible = !document.hidden;
  }

  function tick() {
    const now = performance.now();
    accrue(now);
    updateVisiblePercent();

    if (
      !hasSentEngaged &&
      hasInteracted &&
      activeMilliseconds >= requiredActiveSeconds * 1000 &&
      maxVisiblePercent >= requiredVisiblePercent
    ) {
      hasSentEngaged = true;
      sendAnalyticsEvent("reader_engaged", {
        active_seconds: Math.round(activeMilliseconds / 1000),
        visible_percent: maxVisiblePercent,
      });
    }
  }

  function sendSummary() {
    if (hasSentSummary) return;
    hasSentSummary = true;
    tick();

    const activeSeconds = Math.round(activeMilliseconds / 1000);
    const engaged =
      hasInteracted &&
      activeSeconds >= requiredActiveSeconds &&
      maxVisiblePercent >= requiredVisiblePercent;

    sendAnalyticsEvent("reading_summary", {
      active_seconds: activeSeconds,
      elapsed_seconds: Math.round((performance.now() - startedAt) / 1000),
      max_scroll_percent: maxVisiblePercent,
      scroll_bucket: scrollDepthBucket(maxVisiblePercent),
      interaction_count: interactionCount,
      engaged,
      completed: engaged && maxVisiblePercent >= config.completedVisiblePercent,
    });
  }

  for (const eventName of ["pointerdown", "keydown"]) {
    document.addEventListener(eventName, markInteraction, {
      passive: true,
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      markInteraction();
      updateVisiblePercent();
    },
    { passive: true },
  );
  window.addEventListener("resize", updateVisiblePercent);
  document.addEventListener("visibilitychange", () => {
    tick();
  });
  window.addEventListener("pagehide", sendSummary, { once: true });

  window.setInterval(tick, config.tickMilliseconds);
}
