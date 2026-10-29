from __future__ import annotations

from textwrap import dedent
import unittest

from scripts.migrate.pipeline import run
from tests.migrate.support import make_workspace


class MigrationPipelineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workspace = make_workspace()

    def tearDown(self) -> None:
        self.workspace.cleanup()

    def run_pipeline(self, command: str) -> int:
        return run(
            command=command,
            source_root=self.workspace.source_root,
            config_path=self.workspace.config_path,
            content_root=self.workspace.content_root,
            work_root=self.workspace.work_root,
            report_root=self.workspace.report_root,
            repo_root=self.workspace.root,
        )

    def test_check_stages_output_without_touching_content(self) -> None:
        result = self.run_pipeline("check")
        self.assertEqual(result, 0)
        self.assertFalse((self.workspace.content_root / "system-design").exists())
        self.assertTrue((self.workspace.work_root / "content/system-design/topics/api.md").exists())
        self.assertTrue((self.workspace.report_root / "check.json").exists())

    def test_sync_generates_hugo_content_and_is_deterministic(self) -> None:
        first = self.run_pipeline("sync")
        self.assertEqual(first, 0)

        api_path = self.workspace.content_root / "system-design/topics/api.md"
        index_path = self.workspace.content_root / "system-design/_index.md"
        topics_index_path = self.workspace.content_root / "system-design/topics/_index.md"
        smoke_path = self.workspace.content_root / "system-design/integrated-test-pages/migration-smoke.md"
        self.assertTrue(api_path.exists())
        self.assertTrue(index_path.exists())
        self.assertTrue(topics_index_path.exists())
        self.assertTrue(smoke_path.exists())

        api_content = api_path.read_text(encoding="utf-8")
        index_content = index_path.read_text(encoding="utf-8")
        topics_index_content = topics_index_path.read_text(encoding="utf-8")
        smoke_content = smoke_path.read_text(encoding="utf-8")
        self.assertIn('title: "Api"', api_content)
        self.assertIn("sidebar:\n  weight: 20", api_content)
        self.assertIn("sidebar:\n  weight: 10", topics_index_content)
        self.assertIn('figure src="api.assets/api-diagram.png"', api_content)
        self.assertIn('[Caching Doc]({{< ref "system-design/topics/caching" >}})', api_content)
        self.assertIn(r"Inline math: \(x = y + 1\).", api_content)
        self.assertIn(r"\[f(x) = x^2\]", api_content)
        self.assertIn("Price stays literal at $10 a month.", api_content)
        self.assertIn(r"Escaped prices stay literal at \$10 and \$20.", api_content)
        self.assertIn(
            r"Shell code uses `$HOME` and `$PATH`; model math uses \(R_D\).",
            api_content,
        )
        self.assertIn(
            "\\[\n"
            "\\begin{aligned}\n"
            "a &= b \\\\\n"
            "c &= d\n"
            "\\end{aligned}\n"
            "\\]",
            api_content,
        )
        self.assertIn("Inline math stays literal here: $not_converted$.", api_content)
        self.assertIn("$$\nblock_math_stays_literal\n$$", api_content)
        self.assertIn(r"tracking \(R_0\)", api_content)
        self.assertIn(r"System design root with inline math \(n^2\).", index_content)
        self.assertIn(r"\[Q = \lambda \times W\]", index_content)
        self.assertIn('[System Elements]({{< ref "system-design/elements/elements" >}})', smoke_content)
        self.assertIn("[[missing-note]]", smoke_content)

        second = self.run_pipeline("sync")
        self.assertEqual(second, 0)
        self.assertEqual(api_content, api_path.read_text(encoding="utf-8"))

    def test_sync_preserves_navigation_metadata_without_hiding_published_drafts(self) -> None:
        source = self.workspace.source_root / "system-design/topics/api.md"
        source.write_text(
            "---\ndocument_status: draft\nagent_map_exclude: true\n---\n"
            + source.read_text(encoding="utf-8"), encoding="utf-8",
        )

        self.assertEqual(self.run_pipeline("sync"), 0)
        generated = (self.workspace.content_root / "system-design/topics/api.md").read_text(encoding="utf-8")
        self.assertIn('document_status: "draft"', generated)
        self.assertIn("agent_map_exclude: true", generated)
        self.assertIn("draft: false", generated)

    def test_contribution_import_preserves_records_and_excludes_project_context(self) -> None:
        project = self.workspace.source_root / "projects/valery-tech"
        project.mkdir(parents=True)
        (project / "contributions.md").write_text(
            '---\ntitle: Contributions\nshowTitle: true\n---\n'
            '[[investigation-composition|Read the record]]\n', encoding="utf-8",
        )
        (project / "investigation-composition.md").write_text(
            '---\ntitle: Composable investigations\n'
            'description: One canonical contribution summary.\n'
            'contribution_id: investigation-composition\ncontribution_order: 1\n'
            'showTitle: true\n---\n[[system-design/topics/api|Primary source]]\n',
            encoding="utf-8",
        )
        (project / "route.md").write_text(
            '---\ncontribution_route_id: from-uncertainty-to-commitment\n---\n'
            '[[investigation-composition]]\n', encoding="utf-8",
        )
        for name in ("implementation-notes.md", "author-review.md"):
            (project / name).write_text("Local project context, not public copy.\n", encoding="utf-8")
        with self.workspace.config_path.open("a", encoding="utf-8") as config:
            config.write(dedent('''

                [[imports]]
                name = "contributions"
                source_subtree = "projects/valery-tech"
                target_subtree = "contributions"
                root_index_source = "contributions.md"
                selection_mode = "opt-in"
                selection_paths = ["contributions.md", "investigation-composition.md", "route.md"]
                include = ["*.md"]
            '''))

        self.assertEqual(self.run_pipeline("sync"), 0)
        generated = self.workspace.content_root / "contributions"
        self.assertEqual(
            {path.name for path in generated.iterdir()},
            {"_index.md", "investigation-composition.md", "route.md"},
        )
        record = (generated / "investigation-composition.md").read_text(encoding="utf-8")
        self.assertIn('contribution_id: "investigation-composition"', record)
        self.assertIn('contribution_order: "1"', record)
        self.assertIn('description: "One canonical contribution summary."', record)
        self.assertIn('showTitle: true', record)
        self.assertIn('[Primary source]({{< ref "system-design/topics/api" >}})', record)
        self.assertIn(
            '[Read the record]({{< ref "contributions/investigation-composition" >}})',
            (generated / "_index.md").read_text(encoding="utf-8"),
        )
        self.assertIn(
            'contribution_route_id: "from-uncertainty-to-commitment"',
            (generated / "route.md").read_text(encoding="utf-8"),
        )

    def test_sync_publishes_attachment_links_and_preserves_snapshot_origin(self) -> None:
        source = self.workspace.source_root / "system-design/topics/api.md"
        snapshot = source.parent / "snapshot.html"
        snapshot.write_text(
            '<a href="/settings/apps">Settings</a>'
            '<a href="#local">Section</a>'
            '<a href="https://other.example/">External</a>'
            '<svg><use href="/icons.svg#icon"></use></svg>',
            encoding="utf-8",
        )
        source.write_text(
            "Source: [Original conversation](https://original.example/conversation)\n\n"
            "[Snapshot](snapshot.html)\n\n![[snapshot.html]]\n\n"
            + source.read_text(encoding="utf-8"),
            encoding="utf-8",
        )

        self.assertEqual(self.run_pipeline("sync"), 0)
        generated = (self.workspace.content_root / "system-design/topics/api.md").read_text(encoding="utf-8")
        self.assertIn('[Snapshot](/system-design/topics/api.assets/snapshot.html)', generated)
        self.assertIn('[snapshot.html](/system-design/topics/api.assets/snapshot.html)', generated)
        html = (self.workspace.content_root / "system-design/topics/api.assets/snapshot.html").read_text(encoding="utf-8")
        self.assertIn('href="https://original.example/settings/apps"', html)
        self.assertIn('href="https://original.example/icons.svg#icon"', html)
        self.assertIn('href="#local"', html)
        self.assertIn('href="https://other.example/"', html)
        self.assertIn('href="/settings/apps"', snapshot.read_text(encoding="utf-8"))

    def test_sync_copies_markdown_images_and_reports_missing_images(self) -> None:
        source = self.workspace.source_root / "system-design/topics/api.md"
        image = source.parent / "image (1).svg"
        image.write_text('<svg xmlns="http://www.w3.org/2000/svg"></svg>', encoding="utf-8")
        source.write_text(
            '![Diagram](<image (1).svg>)\n\n'
            '![Missing diagram](missing.png)\n\n'
            '![](https://example.com/external.png)\n\n'
            + source.read_text(encoding="utf-8"),
            encoding="utf-8",
        )

        self.assertEqual(self.run_pipeline("sync"), 0)
        generated = (self.workspace.content_root / "system-design/topics/api.md").read_text(encoding="utf-8")
        self.assertIn('![Diagram](api.assets/image-1.svg)', generated)
        self.assertIn('\nMissing diagram\n', generated)
        self.assertNotIn('missing.png', generated)
        self.assertIn('![](https://example.com/external.png)', generated)
        copied = self.workspace.content_root / "system-design/topics/api.assets/image-1.svg"
        self.assertEqual(copied.read_bytes(), image.read_bytes())
        report = (self.workspace.report_root / "sync.json").read_text(encoding="utf-8")
        self.assertIn('Could not resolve image missing.png', report)

    def test_sync_uses_section_title_for_synthetic_root_index(self) -> None:
        source = self.workspace.source_root / "ai/collab-and-joint-work/note.md"
        source.parent.mkdir(parents=True)
        source.write_text("# Note\n", encoding="utf-8")
        self.workspace.config_path.write_text(
            dedent(
                """
                [defaults]
                include = ["**/*.md", "*.md"]

                [defaults.frontmatter]
                draft = false
                toc = true

                [[imports]]
                name = "ai"
                source_root_kind = "external"
                source_subtree = "ai"
                target_subtree = "ai"
                section_title = "AI"
                selection_mode = "opt-in"
                selection_paths = ["collab-and-joint-work"]
                """
            ).strip()
            + "\n",
            encoding="utf-8",
        )

        result = self.run_pipeline("sync")

        self.assertEqual(result, 0)
        root_index = (self.workspace.content_root / "ai/_index.md").read_text(
            encoding="utf-8"
        )
        self.assertIn('title: "AI"', root_index)
        self.assertIn('linkTitle: "AI"', root_index)


if __name__ == "__main__":
    unittest.main()
