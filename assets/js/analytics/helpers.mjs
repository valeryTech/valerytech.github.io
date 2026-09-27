export const ANALYTICS_SCHEMA_VERSION = 1;

const DOWNLOAD_EXTENSIONS = new Set([
  "csv",
  "doc",
  "docx",
  "epub",
  "json",
  "md",
  "pdf",
  "ppt",
  "pptx",
  "tar",
  "txt",
  "xls",
  "xlsx",
  "xml",
  "zip",
]);

const AI_HOSTS = ["chatgpt.com", "claude.ai", "perplexity.ai"];
const REPOSITORY_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];
const SOCIAL_HOSTS = [
  "bsky.app",
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "mastodon.social",
  "reddit.com",
  "twitter.com",
  "x.com",
  "youtube.com",
];

function hostMatches(hostname, candidates) {
  return candidates.some(
    (candidate) => hostname === candidate || hostname.endsWith(`.${candidate}`)
  );
}

export function toUrl(value, base = "https://example.invalid/") {
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
}

export function pathWithoutQuery(value, base) {
  const url = toUrl(value, base);
  return url?.pathname || "/";
}

export function searchQueryLengthBucket(length) {
  if (length <= 0) return "0";
  if (length <= 3) return "1-3";
  if (length <= 7) return "4-7";
  if (length <= 15) return "8-15";
  return "16+";
}

export function scrollDepthBucket(percent) {
  if (percent < 25) return "0-24";
  if (percent < 50) return "25-49";
  if (percent < 75) return "50-74";
  if (percent < 90) return "75-89";
  return "90-100";
}

export function getNavigationArea(link) {
  if (link.closest("[role='search'], .search-modal, #searchModal")) {
    return "search";
  }

  if (link.closest(".docs-toc, .toc-mobile, #TableOfContents")) {
    return "table_of_contents";
  }

  if (link.closest(".page-nav")) return "previous_next";
  if (link.closest(".docs-sidebar, .section-nav")) return "section_navigation";
  if (link.closest(".breadcrumb")) return "breadcrumb";
  if (link.closest("header, .navbar, #offcanvasNavMain"))
    return "site_navigation";
  if (link.closest("footer, .page-footer")) return "footer";
  if (link.closest("main")) return "content";

  return "other";
}

export function classifyOutboundDestination(url, navigationArea = "other") {
  if (url.protocol === "mailto:") return "contact";
  if (url.protocol === "tel:") return "contact";

  const hostname = url.hostname.toLowerCase();
  if (hostMatches(hostname, AI_HOSTS)) return "ai_tool";
  if (hostMatches(hostname, REPOSITORY_HOSTS)) return "repository";
  if (hostMatches(hostname, SOCIAL_HOSTS)) return "social";
  if (navigationArea === "content") return "reference";
  return "other";
}

export function getDownloadDetails(link, url) {
  const filename = url.pathname.split("/").pop() || "";
  const extension = filename.includes(".")
    ? filename.split(".").pop().toLowerCase()
    : "";
  const isDownload =
    link.hasAttribute("download") || DOWNLOAD_EXTENSIONS.has(extension);

  if (!isDownload) return null;

  return {
    file_type: extension || "unknown",
    resource_path: url.pathname,
  };
}

export function getCodeLanguage(button) {
  const code = button.closest(".highlight")?.querySelector("code");
  if (!code) return "unknown";

  for (const className of code.classList) {
    if (className.startsWith("language-")) {
      return className.slice("language-".length) || "unknown";
    }
  }

  return "unknown";
}

export function sanitizeAnalyticsUrl(value, base) {
  if (typeof value !== "string" || value.length === 0) return value;

  const url = toUrl(value, base);
  if (!url) return value;
  if (url.protocol === "mailto:") return "mailto:";
  if (url.protocol === "tel:") return "tel:";
  if (!["http:", "https:"].includes(url.protocol)) return url.protocol;

  return `${url.origin}${url.pathname}`;
}

export function sanitizePostHogEvent(event, base) {
  if (!event?.properties) return event;

  const properties = { ...event.properties };
  for (const key of [
    "$current_url",
    "$referrer",
    "$initial_referrer",
    "$url",
    "current_url",
    "referrer",
  ]) {
    if (key in properties) {
      properties[key] = sanitizeAnalyticsUrl(properties[key], base);
    }
  }

  if (Array.isArray(properties.$elements)) {
    properties.$elements = properties.$elements.map((element) => {
      if (
        !element ||
        typeof element !== "object" ||
        !("attr__href" in element)
      ) {
        return element;
      }

      return {
        ...element,
        attr__href: sanitizeAnalyticsUrl(element.attr__href, base),
      };
    });
  }

  return { ...event, properties };
}
