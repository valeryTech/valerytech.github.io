from __future__ import annotations

import unittest

from scripts.migrate.conversion import RenderContext, convert_document
from scripts.migrate.models import MigrationReport
from scripts.migrate.parser import parse_document
from tests.migrate.support import make_run, make_workspace


class LinkResolutionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workspace = make_workspace()

    def tearDown(self) -> None:
        self.workspace.cleanup()

    def render(self, text: str) -> tuple[str, MigrationReport]:
        run = make_run(self.workspace)
        note = next(note for note in run.plan.notes if note.target_ref == "system-design/topics/api")
        rendered = convert_document(
            parse_document(text),
            RenderContext(
                note=note,
                note_index=run.note_index,
                attachment_resolver=run.attachment_resolver,
                report=run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            run.config.frontmatter_defaults,
        )
        return "\n\n".join(rendered.body_parts), run.report

    def test_encoded_filenames_resolve_without_renaming_source_notes(self) -> None:
        cases = [
            ("Key-Value Store.md", "Key-Value%20Store.md", "key-value-store"),
            ("reliability & availability.md", "reliability%20%26%20availability.md", "reliability-availability"),
            ("café.md", "caf%C3%A9.md", "cafe"),
            ("cache#notes.md", "cache%23notes.md", "cache-notes"),
            ("literal%20name.md", "literal%2520name.md", "literal-20name"),
        ]
        for filename, encoded, target in cases:
            with self.subTest(filename=filename):
                path = self.workspace.source_root / "system-design/topics" / filename
                path.write_text("# Example\n", encoding="utf-8")
                body, report = self.render(f"[Example]({encoded}#details)")
                self.assertEqual(body, f'[Example]({{{{< ref "system-design/topics/{target}" >}}}}#details)')
                self.assertFalse(any(item.code == "unresolved-link" for item in report.warnings))

    def test_parent_relative_links_cross_imports_with_different_source_depths(self) -> None:
        engineering = self.workspace.source_root / "topics/engineering/topics/caching.md"
        engineering.parent.mkdir(parents=True)
        engineering.write_text("# Engineering Caching\n", encoding="utf-8")
        with self.workspace.config_path.open("a", encoding="utf-8") as config:
            config.write(
                '\n[[imports]]\n'
                'name = "engineering"\n'
                'source_root_kind = "external"\n'
                'source_subtree = "topics/engineering"\n'
                'target_subtree = "engineering"\n'
                'include = ["**/*.md", "*.md"]\n'
            )

        # A different caching.md already exists in the system-design import.
        # The relative path must select the engineering note, not that basename.
        body, report = self.render(
            "[Engineering cache](../../topics/engineering/topics/caching.md#details)"
        )
        self.assertEqual(body, '[Engineering cache]({{< ref "engineering/topics/caching" >}}#details)')
        self.assertFalse(any(item.code == "unresolved-link" for item in report.warnings))

    def test_existing_unpublished_note_remains_unresolved(self) -> None:
        private = self.workspace.source_root / "private/Hidden Notes.md"
        private.parent.mkdir(parents=True)
        private.write_text("# Private note\n", encoding="utf-8")

        body, report = self.render("[Private](../../private/Hidden%20Notes.md)")
        self.assertEqual(body, "Private")
        self.assertTrue(any(item.code == "unresolved-link" for item in report.warnings))
        self.assertFalse((self.workspace.work_root / "content").exists())
