export function initTopLevelSidebarAccordion() {
  const sidebars = document.querySelectorAll(".section-nav");

  for (const sidebar of sidebars) {
    const topLevelGroups = Array.from(sidebar.querySelectorAll(".sidebar-group.depth-1 > details"));

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
