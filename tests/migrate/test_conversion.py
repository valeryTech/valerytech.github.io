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
        self.assertIn("```md\n> [!note] Example\n> Keep this literal inside the code block.", body)
        self.assertIn(r"Inline math: \(x = y + 1\).", body)
        self.assertIn(r"\[f(x) = x^2\]", body)
        self.assertIn(r"tracking \(R_0\)", body)
        self.assertIn("Price stays literal at $10 a month.", body)
        self.assertIn(r"Escaped prices stay literal at \$10 and \$20.", body)
        self.assertIn(
            r"Shell code uses `$HOME` and `$PATH`; model math uses \(R_D\).",
            body,
        )
        self.assertIn(
            "\\[\n"
            "\\begin{aligned}\n"
            "a &= b \\\\\n"
            "c &= d\n"
            "\\end{aligned}\n"
            "\\]",
            body,
        )
        self.assertIn("Inline math stays literal here: $not_converted$.", body)
        self.assertIn("$$\nblock_math_stays_literal\n$$", body)

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

    def test_normalize_math_delimiters_preserves_multiline_display_layout(self) -> None:
        text = (
            "$$\n"
            "\\begin{aligned}\n"
            "a &= b \\\\\n"
            "c &= d\n"
            "\\end{aligned}\n"
            "$$"
        )

        normalized = normalize_math_delimiters(text)

        self.assertEqual(
            normalized,
            "\\[\n"
            "\\begin{aligned}\n"
            "a &= b \\\\\n"
            "c &= d\n"
            "\\end{aligned}\n"
            "\\]",
        )

    def test_normalize_math_delimiters_preserves_canonical_and_literal_delimiters(self) -> None:
        text = (
            r"Canonical inline \(x + y\) stays canonical." "\n"
            r"Canonical block \[x + y\] stays canonical." "\n"
            r"Escaped prices \$10 and \$20 stay literal." "\n"
            r"Escaped price markers \$\$ and \$\$\$ stay literal." "\n"
            "An unmatched $ delimiter stays literal."
        )

        self.assertEqual(normalize_math_delimiters(text), text)

    def test_normalize_math_delimiters_preserves_dollars_in_inline_code(self) -> None:
        examples = (
            "Use `$HOME` and `$PATH`.",
            "Vim uses `$`; Haskell uses `<$>`.",
            "Inline code containing `$$` stays literal.",
        )

        for text in examples:
            with self.subTest(text=text):
                self.assertEqual(normalize_math_delimiters(text), text)

    def test_normalize_math_delimiters_preserves_arbitrary_length_and_multiline_code_spans(self) -> None:
        text = (
            "Double backticks preserve ``a `single` backtick and $HOME``.\n"
            "A multiline span: ```first line\n"
            "$HOME and $$ remain literal\n"
            "last line```."
        )

        self.assertEqual(normalize_math_delimiters(text), text)

    def test_normalize_math_delimiters_converts_math_beside_inline_code(self) -> None:
        text = "Use `$HOME`, ``the `$PATH` variable``, and model $R_D$."

        normalized = normalize_math_delimiters(text)

        self.assertEqual(
            normalized,
            r"Use `$HOME`, ``the `$PATH` variable``, and model \(R_D\).",
        )

    def test_normalize_math_delimiters_converts_display_math_beside_inline_code(self) -> None:
        text = "Inline code `$$` stays literal.\n\n$$\nf(x) = x^2\n$$"

        self.assertEqual(
            normalize_math_delimiters(text),
            "Inline code `$$` stays literal.\n\n\\[f(x) = x^2\\]",
        )

    def test_normalize_math_delimiters_does_not_pair_dollars_across_inline_code(self) -> None:
        text = "$left `literal code` right$"

        self.assertEqual(normalize_math_delimiters(text), text)

    def test_normalize_math_delimiters_treats_unmatched_backticks_as_text(self) -> None:
        text = "Inline $x ` y$ remains math."

        self.assertEqual(
            normalize_math_delimiters(text),
            r"Inline \(x ` y\) remains math.",
        )

    def test_normalize_math_delimiters_is_idempotent(self) -> None:
        text = "Inline $x + y$ and code `$HOME`.\n\n$$\nf(x) = x^2\n$$"

        normalized = normalize_math_delimiters(text)

        self.assertEqual(normalize_math_delimiters(normalized), normalized)


if __name__ == "__main__":
    unittest.main()
