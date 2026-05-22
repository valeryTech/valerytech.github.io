from __future__ import annotations

import unittest

from scripts.migrate.conversion import RenderContext, convert_document, normalize_math_delimiters
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
        self.assertIn('[Caching Doc]({{< ref "system-design/topics/caching" >}})', body)
        self.assertIn("```md\n> [!note] Example\n> Keep this literal inside the code block.\n```", body)
        self.assertIn(r"Inline math: \(x = y + 1\).", body)
        self.assertIn(r"\[f(x) = x^2\]", body)
        self.assertIn(r"tracking \(R_0\)", body)
        self.assertIn("Price stays literal at $10 a month.", body)

    def test_conversion_rewrites_absolute_markdown_note_links(self) -> None:
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        caching_note = next(
            candidate for candidate in self.run.plan.notes if candidate.target_ref == "system-design/topics/caching"
        )
        document = parse_document(
            (
                "# Absolute Links\n\n"
                f"[Caching Absolute]({caching_note.source_path.as_posix()})\n\n"
                f"[Caching Section]({caching_note.source_path.as_posix()}#Hot Path)"
            )
        )
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
        self.assertIn('[Caching Absolute]({{< ref "system-design/topics/caching" >}})', body)
        self.assertIn(
            '[Caching Section]({{< ref "system-design/topics/caching" >}}#hot-path)',
            body,
        )

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

    def test_conversion_drops_unresolved_local_markdown_note_links_to_plain_text(self) -> None:
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        document = parse_document("[Missing Doc](missing-note.md)")
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
        self.assertEqual(body, "Missing Doc")
        self.assertTrue(any(item.code == "unresolved-link" for item in self.run.report.warnings))

    def test_normalize_math_delimiters_rewrites_balanced_math_and_preserves_literal_dollars(self) -> None:
        text = (
            "Inline $x^2$ and $y$.\n"
            "\n"
            "$$\n"
            "f(x) = x^2\n"
            "$$\n"
            "\n"
            "Price is $10 a month.\n"
            r"Escaped \$5 stays escaped."
        )

        normalized = normalize_math_delimiters(text)

        self.assertIn(r"Inline \(x^2\) and \(y\).", normalized)
        self.assertIn(r"\[f(x) = x^2\]", normalized)
        self.assertIn("Price is $10 a month.", normalized)
        self.assertIn(r"Escaped \$5 stays escaped.", normalized)

    def test_normalize_math_delimiters_trims_blank_lines_inside_display_math(self) -> None:
        text = "$$\n\nD(P_\\theta(y_i \\mid x, y_{<i})) \\rightarrow y_i\n\n$$"

        normalized = normalize_math_delimiters(text)

        self.assertEqual(normalized, r"\[D(P_\theta(y_i \mid x, y_{<i})) \rightarrow y_i\]")


if __name__ == "__main__":
    unittest.main()
