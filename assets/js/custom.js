import {
  getCodeLanguage,
  getDownloadDetails,
  getNavigationArea,
  classifyOutboundDestination,
  pathWithoutQuery,
  scrollDepthBucket,
  searchQueryLengthBucket,
  toUrl,
} from "./analytics/helpers.mjs";

function initTocActiveState() {
  const tocLinks = Array.from(
    document.querySelectorAll('#toc a[href^="#"], #TableOfContents a[href^="#"]')
  );

  if (tocLinks.length === 0) {
    return;
  }

  const sections = [];
  const seen = new Set();

  for (const link of tocLinks) {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#" || seen.has(hash)) {
      continue;
    }

    const sectionId = decodeURIComponent(hash.slice(1));
    const section = document.getElementById(sectionId);
    if (!section) {
      continue;
    }

    seen.add(hash);
    sections.push({ hash, section });
  }

  if (sections.length === 0) {
    return;
  }

  let currentHash = null;

  function getDirectChildAnchor(listItem) {
    for (const child of listItem.children) {
      if (child.tagName === "A" && child.getAttribute("href")?.startsWith("#")) {
        return child;
      }
    }

    return null;
  }

  function markAncestorLinks(link) {
    let listItem = link.closest("li");

    while (listItem) {
      const parentListItem = listItem.parentElement?.closest("li");
      if (!parentListItem) {
        break;
      }

      const parentLink = getDirectChildAnchor(parentListItem);
      if (parentLink && parentLink !== link) {
        parentLink.classList.add("active-ancestor");
      }

      listItem = parentListItem;
    }
  }

  function keepDesktopTocLinkVisible(link) {
    const container = link.closest(".docs-toc");
    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const padding = 24;

    if (linkRect.top < containerRect.top + padding) {
      container.scrollTop -= containerRect.top + padding - linkRect.top;
    } else if (linkRect.bottom > containerRect.bottom - padding) {
      container.scrollTop += linkRect.bottom - (containerRect.bottom - padding);
    }
  }

  function setActive(hash) {
    for (const link of tocLinks) {
      const isActive = link.getAttribute("href") === hash;
      link.classList.toggle("active", isActive);
      link.classList.remove("active-ancestor");
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    }

    const activeLinks = tocLinks.filter((link) => link.getAttribute("href") === hash);
    for (const link of activeLinks) {
      markAncestorLinks(link);
    }

    if (hash !== currentHash) {
      const visibleDesktopLink = activeLinks.find(
        (link) => link.closest(".docs-toc") && link.offsetParent !== null
      );
      if (visibleDesktopLink) {
        keepDesktopTocLinkVisible(visibleDesktopLink);
      }
      currentHash = hash;
    }
  }

  function findActiveHash() {
    const activationLine =
      window.scrollY + Math.max(120, Math.round(window.innerHeight * 0.35));
    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (nearBottom) {
      return sections[sections.length - 1].hash;
    }

    let activeHash = sections[0].hash;

    for (const entry of sections) {
      const top = entry.section.getBoundingClientRect().top + window.scrollY;
      if (top <= activationLine) {
        activeHash = entry.hash;
      } else {
        break;
      }
    }

    return activeHash;
  }

  let ticking = false;

  function updateActiveState() {
    ticking = false;
    setActive(findActiveHash());
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateActiveState);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("hashchange", requestUpdate);

  requestUpdate();
}

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
    "#offcanvasNavMain .offcanvas-body"
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

  const colorModeButton = document.getElementById("buttonColorMode");
  const socialMenu = document.getElementById("socialMenu");
  const insertionPoint = colorModeButton || socialMenu;

  if (insertionPoint?.parentElement === navigation) {
    navigation.insertBefore(control, insertionPoint);
  } else {
    navigation.append(control);
  }
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
    const button = event.target.closest?.(".btn-copy, #copy-markdown");
    if (!button) return;

    const isMarkdown = button.id === "copy-markdown";
    sendAnalyticsEvent("copy_requested", {
      resource_type: isMarkdown ? "markdown" : "code",
      code_language: isMarkdown ? undefined : getCodeLanguage(button),
    });
  });
}

function initSearchAnalytics() {
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("query");
  const results = document.getElementById("searchResults");
  if (!modal || !input || !results) return;

  let pendingOpenSource = "other";
  let searchState = null;

  function resultCount() {
    return results.querySelectorAll("article.search-result").length;
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

  for (const [id, source] of [
    ["searchToggleDesktop", "desktop"],
    ["searchToggleMobile", "mobile"],
  ]) {
    document.getElementById(id)?.addEventListener("click", () => {
      pendingOpenSource = source;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      pendingOpenSource = "keyboard";
    }
  });

  modal.addEventListener("shown.bs.modal", () => {
    searchState = {
      completed: false,
      queryLength: 0,
      resultCount: 0,
    };
    sendAnalyticsEvent("search_opened", { open_source: pendingOpenSource });
    pendingOpenSource = "other";
  });

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
      results.querySelectorAll("article.search-result a[href]")
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

  modal.addEventListener("hidden.bs.modal", () => {
    completeSearch(false);
    searchState = null;
  });
}

function initDisplayPreferenceAnalytics() {
  const root = document.documentElement;
  let previousTheme = root.getAttribute("data-bs-theme");

  new MutationObserver(() => {
    const theme = root.getAttribute("data-bs-theme");
    if (theme && theme !== previousTheme) {
      previousTheme = theme;
      sendAnalyticsEvent("display_preference_changed", {
        preference_type: "theme",
        preference_value: theme,
      });
    }
  }).observe(root, { attributes: true, attributeFilter: ["data-bs-theme"] });
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
    sendAnalyticsEvent("not_found_viewed", {
      requested_path: window.location.pathname,
    });
  }
}

function initCustomBehavior() {
  initTocActiveState();
  initTopLevelSidebarAccordion();
  initFontPreference();
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
