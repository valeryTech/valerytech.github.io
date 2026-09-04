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

function initCustomBehavior() {
  initTocActiveState();
  initTopLevelSidebarAccordion();
  initFontPreference();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCustomBehavior);
} else {
  initCustomBehavior();
}
