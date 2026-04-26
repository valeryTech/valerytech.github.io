from __future__ import annotations

import unittest

from scripts.migrate.conversion import RenderContext, convert_document
from scripts.migrate.parser import parse_document
from tests.migrate.support import FIXTURE_ROOT, make_run, make_workspace


class ConversionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workspace = make_workspace()
        self.run = make_run(self.workspace)

    def tearDown(self) -> None:
        self.workspace.cleanup()

    def test_conversion_rewrites_links_and_preserves_code(self) -> None:
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        document = parse_document(note.source_path.read_text(encoding="utf-8"))
        rendered = convert_document(
            document,
            RenderContext(
                note=note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )
        body = "\n\n".join(rendered.body_parts)
        self.assertIn('[Caching]({{< ref "system-design/topics/caching" >}})', body)
        self.assertIn("```md\n> [!note] Example\n> Keep this literal inside the code block.\n```", body)

    def test_conversion_strips_duplicate_title_heading_and_reports_unresolved_links(self) -> None:
        title_note = next(
            note
            for note in self.run.plan.notes
            if note.target_ref == "system-design/integrated-test-pages/explicit-title-override"
        )
        title_doc = parse_document(title_note.source_path.read_text(encoding="utf-8"))
        title_rendered = convert_document(
            title_doc,
            RenderContext(
                note=title_note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )
        self.assertNotIn("# Explicit Title Override", "\n\n".join(title_rendered.body_parts))

        unresolved_note = next(
            note
            for note in self.run.plan.notes
            if note.target_ref == "system-design/integrated-test-pages/unresolved-links"
        )
        unresolved_doc = parse_document(unresolved_note.source_path.read_text(encoding="utf-8"))
        unresolved_rendered = convert_document(
            unresolved_doc,
            RenderContext(
                note=unresolved_note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )
        body = "\n\n".join(unresolved_rendered.body_parts)
        self.assertIn("[[missing-note]]", body)
        self.assertTrue(any(item.code == "unresolved-link" for item in self.run.report.warnings))


if __name__ == "__main__":
    unittest.main()
