import assert from "node:assert/strict";

export function validateSettingsConfig(ui) {
  const settings = ui.settings;
  const text = (value, label) =>
    assert.ok(typeof value === "string" && value.trim(), `${label} must be nonempty text`);
  for (const key of [
    "title",
    "description",
    "previewHeading",
    "previewText",
    "resetLabel",
    "exportLabel",
    "importLabel",
    "exportFileName",
    "transferHelp",
  ])
    text(settings[key], `settings ${key}`);
  for (const key of [
    "requiresJavaScript",
    "ready",
    "saved",
    "saveFailed",
    "reset",
    "resetFailed",
    "exported",
    "imported",
    "importSaveFailed",
    "importFailed",
  ])
    text(settings.messages?.[key], `settings message ${key}`);
  assert.ok(Array.isArray(settings.sections) && settings.sections.length, "settings need sections");
  const ids = new Set();
  const keys = new Set();
  for (const section of settings.sections) {
    assert.match(section.id, /^[a-z][a-z0-9-]*$/, "settings section id must be stable");
    assert.ok(!ids.has(section.id), "settings section ids must be unique");
    ids.add(section.id);
    text(section.title, "settings section title");
    assert.ok(
      ["columns", "stack"].includes(section.layout),
      "settings section needs a supported layout",
    );
    if (section.help !== undefined) text(section.help, "settings section help");
    if (section.preview !== undefined)
      assert.equal(typeof section.preview, "boolean", "settings preview must be boolean");
    assert.ok(
      Array.isArray(section.fields) && section.fields.length,
      "settings section needs fields",
    );
    for (const field of section.fields) {
      text(field.key, "settings field key");
      assert.ok(!keys.has(field.key), "settings field keys must be unique");
      keys.add(field.key);
      text(field.label, "settings field label");
      if (field.help !== undefined) text(field.help, "settings field help");
      if (field.key === "palette") {
        assert.equal(field.type, "palette", "the palette setting opens the palette editor");
        assert.equal(field.source, undefined, "the palette setting uses ui.palette");
        continue;
      }
      if (["widths.sidebar", "widths.outline"].includes(field.key)) {
        assert.equal(field.type, "range", "pane settings must use range controls");
        assert.equal(
          field.source,
          undefined,
          "pane settings use CSS dimensions, not another source",
        );
        continue;
      }
      const source = field.key === "font" ? "fonts" : field.key;
      const definition = source
        .split(".")
        .reduce((value, key) => (Object.hasOwn(value || {}, key) ? value[key] : undefined), ui);
      assert.ok(
        field.key === "font" ||
          /^display\.(breadcrumbs|textSize|textBrightness|lineSpacing|pinAncestors|headerVisible|sidebarVisible|siteWidth|density|outline)$/.test(
            field.key,
          ),
        `unknown settings field ${field.key}`,
      );
      assert.equal(
        field.source,
        source,
        `settings field ${field.key} needs its owning configuration source`,
      );
      assert.ok(definition, `settings source ${source} must exist`);
      assert.equal(
        field.type,
        typeof definition.default === "boolean" ? "checkbox" : "cycle",
        `settings field ${field.key} has an unsupported control`,
      );
    }
  }
}
