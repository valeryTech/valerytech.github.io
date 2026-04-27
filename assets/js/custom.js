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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTocActiveState);
} else {
  initTocActiveState();
}
