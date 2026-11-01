// Branch disclosures shared by the sidebar tree and the page outline. Each
// toggle precedes its label link and controls the list named by aria-controls;
// toggles whose links share an href (the outline and its popover copy) move together.
// A heading button cycles Collapse all → Restore → Expand all. Restore returns
// the branches saved by the last Collapse all; toggling one branch starts over.
// Choices last for the tab session under the given storage key.

// Each entry names the action the button performs next.
const bulkActions = {
  collapse: { label: "Collapse all sections", next: "restore" },
  restore: { label: "Restore sections", next: "expand" },
  expand: { label: "Expand all sections", next: "collapse" },
};

function savedState(storageKey) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved?.branches && typeof saved.branches === "object") return saved;
  } catch {
    // Blocked or malformed storage starts from the rendered menu.
  }
  return { branches: {} };
}

const branchKey = (toggle) => toggle.nextElementSibling.getAttribute("href");
const isOpen = (toggle) => toggle.getAttribute("aria-expanded") === "true";

function setBranch(toggle, open) {
  document.getElementById(toggle.getAttribute("aria-controls")).hidden = !open;
  const label = `${open ? "Collapse" : "Expand"} ${toggle.nextElementSibling.textContent.trim()}`;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", label);
  toggle.title = label;
}

// keepOpen(toggle) names branches that open on arrival regardless of saved choices.
export function initDisclosures({ toggles, bulkButtons, storageKey, keepOpen = () => false }) {
  const state = savedState(storageKey);
  const groups = new Map();
  for (const toggle of toggles) {
    const key = branchKey(toggle);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(toggle);
  }
  for (const [key, members] of groups) {
    const open = state.branches[key];
    const keep = members.some(keepOpen);
    for (const toggle of members) {
      if (keep) setBranch(toggle, true);
      else if (typeof open === "boolean") setBranch(toggle, open);
      else setBranch(toggle, isOpen(toggle));
      toggle.hidden = false;
    }
  }

  function showAction(action) {
    for (const button of bulkButtons) {
      button.dataset.action = action;
      button.setAttribute("aria-label", bulkActions[action].label);
      button.title = bulkActions[action].label;
    }
  }

  if (!groups.size) return;
  showAction(bulkActions[state.next] ? state.next : "collapse");
  for (const button of bulkButtons) button.hidden = false;

  function save(changes) {
    for (const [key, open] of changes) {
      for (const toggle of groups.get(key)) setBranch(toggle, open);
      state.branches[key] = open;
    }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Blocked storage keeps the toggles working for this page.
    }
  }

  for (const button of bulkButtons) {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const current = new Map([...groups].map(([key, members]) => [key, isOpen(members[0])]));
      // Expand all → Collapse all keeps the arrangement the cycle started from.
      if (action === "collapse") state.snapshot ??= Object.fromEntries(current);
      const target = {
        collapse: () => false,
        restore: (key) => state.snapshot?.[key] ?? current.get(key),
        expand: () => true,
      }[action];
      state.next = bulkActions[action].next;
      save([...groups.keys()].map((key) => [key, target(key)]));
      showAction(state.next);
    });
  }
  for (const toggle of toggles) {
    toggle.addEventListener("click", () => {
      delete state.snapshot;
      state.next = "collapse";
      save([[branchKey(toggle), !isOpen(toggle)]]);
      showAction("collapse");
    });
  }
}
