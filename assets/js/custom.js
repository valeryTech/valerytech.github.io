import {
  getCodeLanguage,
  getDownloadDetails,
  getNavigationArea,
  getNotFoundDetails,
  classifyOutboundDestination,
  pathWithoutQuery,
  scrollDepthBucket,
  searchQueryLengthBucket,
  toUrl,
} from "./analytics/helpers.mjs";
import { initStickyNavigation } from "./navigation/sticky-context.mjs";

function initTopLevelSidebarAccordion() {
  const sidebars = document.querySelectorAll(".section-nav");

  for (const sidebar of sidebars) {
    const topLevelGroups = Array.from(
      sidebar.querySelectorAll(".sidebar-group.depth-1 > details")
    );

    for (const group of topLevelGroups) {
      group.addEventListener("toggle", () => {
        if (!group.open) {
          return;
        }

        for (const sibling of topLevelGroups) {
          if (sibling !== group) {
            sibling.open = false;
          }
        }
      });
    }
  }
}

function initFontPreference() {
  const preferenceAttribute = "data-font-preference";
  const cookieName = "font-preference";
  const validPreferences = new Set(["system", "jost"]);
  const navigation = document.querySelector(
    "#font-preference-container"
  );

  if (!navigation || document.getElementById("fontPreference")) {
    return;
  }

  const control = document.createElement("div");
  control.className = "font-preference-control";

  const label = document.createElement("label");
  label.htmlFor = "fontPreference";
  label.textContent = "Font";

  const select = document.createElement("select");
  select.id = "fontPreference";
  select.className = "font-preference-select";

  for (const [value, name] of [
    ["system", "System"],
    ["jost", "Jost"],
  ]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = name;
    select.append(option);
  }

  const savedPreference =
    document.documentElement.getAttribute(preferenceAttribute);
  select.value =
    validPreferences.has(savedPreference) ? savedPreference : "system";

  select.addEventListener("change", () => {
    const preference = select.value;
    if (!validPreferences.has(preference)) {
      return;
    }

    document.documentElement.setAttribute(preferenceAttribute, preference);
    document.cookie = `${cookieName}=${preference}; Max-Age=31536000; Path=/; SameSite=Lax`;
    sendAnalyticsEvent("display_preference_changed", {
      preference_type: "font",
      preference_value: preference,
    });
  });

  control.append(label, select);

  navigation.append(control);
}

function sendAnalyticsEvent(name, parameters = {}) {
  window.siteAnalytics?.emit(name, parameters);
}

function getLinkTargetMode(link, event) {
  if (
    link.target === "_blank" ||
    event.button === 1 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return "new_tab";
  }

  return "current_tab";
}

function initNavigationAnalytics() {
  function trackNavigation(event) {
    const link = event.target.closest?.("a[href]");
    if (!link || event.defaultPrevented) return;

    const destination = toUrl(link.href, window.location.href);
    if (!destination) return;

    const navigationArea = getNavigationArea(link);
    const download = getDownloadDetails(link, destination);
    if (download) {
      sendAnalyticsEvent("resource_downloaded", {
        ...download,
        destination_host: destination.hostname,
        navigation_area: navigationArea,
        target_mode: getLinkTargetMode(link, event),
      });
      return;
    }

    if (destination.origin === window.location.origin) {
      if (destination.pathname !== window.location.pathname) {
        sendAnalyticsEvent("internal_navigation", {
          source_path: window.location.pathname,
          destination_path: destination.pathname,
          navigation_area: navigationArea,
          target_mode: getLinkTargetMode(link, event),
        });
      } else if (
        destination.hash &&
        destination.hash !== window.location.hash
      ) {
        sendAnalyticsEvent("toc_navigation", {
          page_path: window.location.pathname,
          target_id: decodeURIComponent(destination.hash.slice(1)),
          navigation_area: navigationArea,
        });
      }
      return;
    }

    if (
      !["http:", "https:", "mailto:", "tel:"].includes(destination.protocol)
    ) {
      return;
    }

    sendAnalyticsEvent("outbound_navigation", {
      destination_host: destination.hostname,
      destination_category: classifyOutboundDestination(
        destination,
        navigationArea
      ),
      contact_method:
        destination.protocol === "mailto:"
          ? "email"
          : destination.protocol === "tel:"
            ? "phone"
            : undefined,
      navigation_area: navigationArea,
      target_mode: getLinkTargetMode(link, event),
    });
  }

  document.addEventListener("click", trackNavigation);
  document.addEventListener("auxclick", (event) => {
    if (event.button === 1) trackNavigation(event);
  });
}

function initCopyAnalytics() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(".hextra-code-copy-btn, #copy-markdown, [data-copy-markdown]");
    if (!button) return;

    const isMarkdown = button.id === "copy-markdown" || button.hasAttribute("data-copy-markdown");
    sendAnalyticsEvent("copy_requested", {
      resource_type: isMarkdown ? "markdown" : "code",
      code_language: isMarkdown ? undefined : getCodeLanguage(button),
    });
  });
}

function initSearchAnalytics() {
  const modal = document.getElementById("hextra-search-dialog");
  const input = modal?.querySelector(".hextra-search-input");
  const results = document.getElementById("hextra-search-results");
  if (!modal || !input || !results) return;

  let pendingOpenSource = "other";
  let searchState = null;

  function resultCount() {
    return results.querySelectorAll("a[role=option]").length;
  }

  function updateState() {
    if (!searchState) return;
    searchState.queryLength = input.value.trim().length;
    searchState.resultCount = resultCount();
  }

  function completeSearch(selected) {
    if (!searchState || searchState.completed || searchState.queryLength === 0)
      return;
    updateState();
    searchState.completed = true;
    sendAnalyticsEvent("search_completed", {
      query_length_bucket: searchQueryLengthBucket(searchState.queryLength),
      result_count: searchState.resultCount,
      has_results: searchState.resultCount > 0,
      result_selected: selected,
    });
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-search-open]")) {
      pendingOpenSource = window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile";
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      pendingOpenSource = "keyboard";
    }
  });

  new MutationObserver(() => {
    if (modal.open) {
      searchState = { completed: false, queryLength: input.value.trim().length, resultCount: resultCount() };
      sendAnalyticsEvent("search_opened", { open_source: pendingOpenSource });
      pendingOpenSource = "other";
    } else {
      completeSearch(false);
      searchState = null;
    }
  }).observe(modal, { attributes: true, attributeFilter: ["open"] });

  input.addEventListener("input", () => {
    window.requestAnimationFrame(updateState);
  });

  new MutationObserver(updateState).observe(results, {
    childList: true,
    subtree: true,
  });

  results.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link || !searchState) return;

    updateState();
    const links = Array.from(
      results.querySelectorAll("a[role=option]")
    );
    const destination = toUrl(link.href, window.location.href);
    sendAnalyticsEvent("search_result_selected", {
      query_length_bucket: searchQueryLengthBucket(searchState.queryLength),
      result_count: searchState.resultCount,
      result_position: links.indexOf(link) + 1,
      destination_path: destination
        ? pathWithoutQuery(destination.href, window.location.href)
        : undefined,
      selection_method: event.detail === 0 ? "keyboard" : "pointer",
    });
    completeSearch(true);
  });
}

function initDisplayPreferenceAnalytics() {
  const root = document.documentElement;
  let previousTheme = root.classList.contains("dark") ? "dark" : "light";

  new MutationObserver(() => {
    const theme = root.classList.contains("dark") ? "dark" : "light";
    if (theme && theme !== previousTheme) {
      previousTheme = theme;
      sendAnalyticsEvent("display_preference_changed", {
        preference_type: "theme",
        preference_value: theme,
      });
    }
  }).observe(root, { attributes: true, attributeFilter: ["class"] });
}

function getVisiblePagePercent() {
  const pageHeight = document.documentElement.scrollHeight;
  if (pageHeight <= 0) {
    return 100;
  }

  return Math.min(
    100,
    Math.round(((window.scrollY + window.innerHeight) / pageHeight) * 100)
  );
}

function initReaderEngagementAnalytics() {
  const requiredActiveSeconds = 10;
  const requiredVisiblePercent = 25;
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
    interactionCount = Math.min(1000, interactionCount + 1);
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
      completed: engaged && maxVisiblePercent >= 90,
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
    { passive: true }
  );
  window.addEventListener("resize", updateVisiblePercent);
  document.addEventListener("visibilitychange", () => {
    tick();
  });
  window.addEventListener("pagehide", sendSummary, { once: true });

  window.setInterval(tick, 1000);
}

function initNotFoundAnalytics() {
  if (window.siteAnalytics?.context?.page_kind === "404") {
    sendAnalyticsEvent(
      "not_found_viewed",
      getNotFoundDetails(
        window.location.href,
        document.referrer,
        window.siteAnalytics.context.site_release
      )
    );
  }
}

function initCustomBehavior() {
  initTopLevelSidebarAccordion();
  initFontPreference();
  initStickyNavigation();
  initNavigationAnalytics();
  initCopyAnalytics();
  initSearchAnalytics();
  initDisplayPreferenceAnalytics();
  initReaderEngagementAnalytics();
  initNotFoundAnalytics();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCustomBehavior);
} else {
  initCustomBehavior();
}
