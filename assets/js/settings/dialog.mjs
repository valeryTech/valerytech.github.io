import { initSettingsForm } from "./form.mjs";

export function initSettingsDialog(preferences, config) {
  const template = document.getElementById("site-settings-dialog-template");
  if (
    !template ||
    typeof HTMLDialogElement === "undefined" ||
    typeof HTMLDialogElement.prototype.showModal !== "function"
  )
    return;
  let dialog;
  let form;
  let opener;
  let outsidePointer = false;

  for (const link of document.querySelectorAll("a[data-site-settings-open]"))
    link.setAttribute("aria-haspopup", "dialog");

  function outside(event) {
    const box = dialog.getBoundingClientRect();
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    );
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-site-settings-open]");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (!dialog) {
      document.body.append(template.content.cloneNode(true));
      dialog = document.getElementById("site-settings-dialog");
      const header = dialog.querySelector("header");
      new ResizeObserver(() => {
        dialog.style.setProperty(
          "--site-settings-header-height",
          `${header.getBoundingClientRect().height}px`,
        );
      }).observe(header);
      dialog.querySelector("[data-settings-close]").addEventListener("click", () => dialog.close());
      // Escape dismisses this dialog before any background mobile menu.
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") event.stopPropagation();
      });
      dialog.addEventListener("pointerdown", (event) => {
        outsidePointer = event.target === dialog && outside(event);
      });
      dialog.addEventListener("click", (event) => {
        if (outsidePointer && event.target === dialog && outside(event)) dialog.close();
        outsidePointer = false;
      });
      dialog.addEventListener("close", () => {
        document.documentElement.classList.remove("site-settings-open");
        const target =
          opener?.getClientRects().length ?
            opener
          : [...document.querySelectorAll("[data-settings-focus-fallback]")].find(
              (element) => element.getClientRects().length,
            );
        target?.focus({ preventScroll: true });
      });
    }
    if (dialog.open) return;
    opener = link;
    document.documentElement.classList.add("site-settings-open");
    dialog.showModal();
    form ??= initSettingsForm(dialog.querySelector("form"), preferences, config);
    form.refresh();
  });
}
