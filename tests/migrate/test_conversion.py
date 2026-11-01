from __future__ import annotations

import unittest
from pathlib import Path

from scripts.migrate.attachments import MAX_PDF_BYTES
from scripts.migrate.conversion import (
    RenderContext,
    convert_document,
    normalize_math_delimiters,
    strip_tracking_parameters,
)
from scripts.migrate.parser import parse_document
from scripts.migrate.paths import build_pdf_output_rel
from scripts.migrate.pdf_lock import KEY_SETTING, LOCK_FILE, MAGIC, PASSWORD_SETTING
from scripts.migrate.planning import MigrationFailed
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

    def test_conversion_rewrites_parent_relative_markdown_note_links(self) -> None:
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        document = parse_document("[Elements](../elements/elements.md)")
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
        self.assertEqual(body, '[Elements]({{< ref "system-design/elements/elements" >}})')

    def test_conversion_rewrites_markdown_note_links_with_parentheses(self) -> None:
        source = self.workspace.source_root / "system-design/topics/input(GTD)/note.md"
        source.parent.mkdir(parents=True)
        source.write_text("# Note\n", encoding="utf-8")
        run = make_run(self.workspace)
        note = next(note for note in run.plan.notes if note.target_ref == "system-design/topics/api")
        for target in (
            "input(GTD)/note.md",
            f"<{source.as_posix()}>",
            f'<{source.as_posix()}> "Reading note"',
        ):
            with self.subTest(target=target):
                rendered = convert_document(
                    parse_document(f"[Reading]({target})"),
                    RenderContext(
                        note=note,
                        note_index=run.note_index,
                        attachment_resolver=run.attachment_resolver,
                        report=run.report,
                        staging_root=self.workspace.work_root / "content",
                    ),
                    run.config.frontmatter_defaults,
                )
                self.assertEqual(
                    "\n\n".join(rendered.body_parts),
                    '[Reading]({{< ref "system-design/topics/input-gtd/note" >}})',
                )

    def test_conversion_does_not_copy_unpublished_markdown_notes_as_attachments(self) -> None:
        unpublished = self.workspace.source_root / "private/hidden.md"
        unpublished.parent.mkdir(parents=True)
        unpublished.write_text("# Hidden\n", encoding="utf-8")
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        document = parse_document(
            "[Hidden](private/hidden.md)\n\n[[private/hidden.md]]"
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
        self.assertEqual(body, "Hidden\n\n[[private/hidden.md]]")
        self.assertFalse((self.workspace.work_root / "content").exists())
        self.assertTrue(any(item.code == "unresolved-link" for item in self.run.report.warnings))

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

    def test_conversion_drops_missing_local_attachment_links_to_plain_text(self) -> None:
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        rendered = convert_document(
            parse_document("[Missing data](missing.json) and [Missing PDF](</missing/paper (1).pdf>)"),
            RenderContext(
                note=note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )

        self.assertEqual("\n\n".join(rendered.body_parts), "Missing data and Missing PDF")
        self.assertEqual(len(self.run.report.warnings), 2)

    def test_conversion_shows_labels_of_unpublished_wiki_links(self) -> None:
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        rendered = convert_document(
            parse_document("See [[drafts/private-note|the draft]] and [[2]]."),
            RenderContext(
                note=note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )

        self.assertEqual("\n\n".join(rendered.body_parts), "See the draft and [[2]].")

    def test_conversion_stores_each_linked_pdf_once_in_its_sources_folder(self) -> None:
        papers = self.workspace.source_root / "sources" / "papers"
        papers.mkdir(parents=True)
        (papers / "Smith 2025 Paper.pdf").write_bytes(b"%PDF-1.7\n")
        (self.workspace.root / LOCK_FILE).write_text(
            f"{KEY_SETTING}={'ab' * 32}\n{PASSWORD_SETTING}=x{{minute}}\n",
            encoding="utf-8",
        )
        staging_root = self.workspace.work_root / "content"
        bodies = []
        for target_ref in (
            "system-design/topics/api",
            "system-design/topics/caching",
            "system-design/integrated-test-pages/migration-smoke",
        ):
            note = next(note for note in self.run.plan.notes if note.target_ref == target_ref)
            rendered = convert_document(
                parse_document("Read [[sources/papers/Smith 2025 Paper.pdf|Smith 2025]]."),
                RenderContext(
                    note=note,
                    note_index=self.run.note_index,
                    attachment_resolver=self.run.attachment_resolver,
                    report=self.run.report,
                    staging_root=staging_root,
                ),
                self.run.config.frontmatter_defaults,
            )
            bodies.append("\n\n".join(rendered.body_parts))

        link = "Read [Smith 2025](/sources/papers/smith-2025-paper.pdf.enc)."
        self.assertEqual(bodies, [link, link, link])
        stored = list(staging_root.rglob("*.pdf*"))
        self.assertEqual(
            [path.relative_to(staging_root).as_posix() for path in stored],
            ["sources/papers/smith-2025-paper.pdf.enc"],
        )
        self.assertTrue(stored[0].read_bytes().startswith(MAGIC))
        self.assertNotIn(b"%PDF", stored[0].read_bytes())
        self.assertEqual(self.run.report.warnings, [])

    def test_pdfs_linked_by_file_name_are_found_anywhere_in_the_vault(self) -> None:
        sources = self.workspace.source_root / "sources"
        for folder in ("papers", "books/one", "books/two"):
            (sources / folder).mkdir(parents=True)
        (sources / "papers" / "Smith 2025 Paper.pdf").write_bytes(b"%PDF-1.7\n")
        (sources / "books" / "one" / "book.pdf").write_bytes(b"%PDF-1.7\n")
        (sources / "books" / "two" / "book.pdf").write_bytes(b"%PDF-1.7\n")
        (self.workspace.root / LOCK_FILE).write_text(
            f"{KEY_SETTING}={'ab' * 32}\n{PASSWORD_SETTING}=x{{minute}}\n",
            encoding="utf-8",
        )
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        # The second link is written as it is inside a table.
        rendered = convert_document(
            parse_document("Read [[Smith 2025 Paper.pdf|Smith]], [[one/book.pdf\\|one]] and [[book.pdf|either]]."),
            RenderContext(
                note=note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )

        self.assertEqual(
            "\n\n".join(rendered.body_parts),
            "Read [Smith](/sources/papers/smith-2025-paper.pdf.enc), "
            "[one](/sources/books/one/book.pdf.enc) and either.",
        )
        self.assertIn("ambiguous-pdf", [item.code for item in self.run.report.warnings])

    def test_links_lose_tracking_parameters_only(self) -> None:
        self.assertEqual(
            strip_tracking_parameters(
                "[A](https://a.org/p?utm_source=chatgpt.com), "
                "[B](https://a.org/q?id=3&utm_source=chatgpt.com#part), "
                "see https://a.org/r?utm_source=chatgpt.com. Also https://a.org/s?id=1&x=%2F."
            ),
            "[A](https://a.org/p), [B](https://a.org/q?id=3#part), "
            "see https://a.org/r. Also https://a.org/s?id=1&x=%2F.",
        )

    def test_pdfs_outside_sources_keep_their_vault_folders(self) -> None:
        root = self.workspace.source_root
        self.assertEqual(
            build_pdf_output_rel(root, root / "system-design/topics/../topics/Big Diagram.pdf"),
            Path("sources/system-design/topics/big-diagram.pdf.enc"),
        )
        self.assertEqual(
            build_pdf_output_rel(root, Path("/elsewhere/Paper.pdf")),
            Path("sources/paper.pdf.enc"),
        )

    def test_conversion_stops_when_pdfs_cannot_be_encrypted(self) -> None:
        sources = self.workspace.source_root / "sources"
        sources.mkdir()
        (sources / "paper.pdf").write_bytes(b"%PDF-1.7\n")
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        context = RenderContext(
            note=note,
            note_index=self.run.note_index,
            attachment_resolver=self.run.attachment_resolver,
            report=self.run.report,
            staging_root=self.workspace.work_root / "content",
        )

        with self.assertRaisesRegex(MigrationFailed, LOCK_FILE):
            convert_document(
                parse_document("Read [[sources/paper.pdf|The Paper]]."),
                context,
                self.run.config.frontmatter_defaults,
            )
        self.assertEqual(list(self.workspace.work_root.rglob("*.pdf*")), [])

    def test_conversion_leaves_oversized_pdfs_out(self) -> None:
        books = self.workspace.source_root / "sources"
        books.mkdir()
        with (books / "book.pdf").open("wb") as book:
            book.truncate(MAX_PDF_BYTES + 1)
        note = next(note for note in self.run.plan.notes if note.target_ref == "system-design/topics/api")
        rendered = convert_document(
            parse_document("Read [[sources/book.pdf|The Book]]."),
            RenderContext(
                note=note,
                note_index=self.run.note_index,
                attachment_resolver=self.run.attachment_resolver,
                report=self.run.report,
                staging_root=self.workspace.work_root / "content",
            ),
            self.run.config.frontmatter_defaults,
        )

        self.assertEqual("\n\n".join(rendered.body_parts), "Read The Book.")
        self.assertIn("oversized-pdf", [item.code for item in self.run.report.warnings])

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

    def test_normalize_math_delimiters_preserves_escaped_wiki_links_as_literal_brackets(self) -> None:
        text = r"Literal \[\[analysis-1\]\], math \[x^2\], and code `\[\[literal\]\]`."

        self.assertEqual(
            normalize_math_delimiters(text),
            r"Literal &#91;&#91;analysis-1&#93;&#93;, math \[x^2\], and code `\[\[literal\]\]`.",
        )

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
