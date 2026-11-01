from __future__ import annotations

from dataclasses import replace
from pathlib import Path
from textwrap import dedent
import unittest

from scripts.migrate.config import load_config
from scripts.migrate.planning import (
    MigrationFailed,
    build_migration_plan,
    should_include,
    synthetic_index_frontmatter,
)
from tests.migrate.support import make_run, make_workspace


class PlanningTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workspace = make_workspace()

    def tearDown(self) -> None:
        self.workspace.cleanup()

    def write_config(self, body: str) -> None:
        self.workspace.config_path.write_text(dedent(body).strip() + "\n", encoding="utf-8")

    def test_build_plan_supports_external_and_repo_roots(self) -> None:
        run = make_run(self.workspace)
        refs = {note.target_ref for note in run.plan.notes}
        self.assertIn("system-design/topics/api", refs)
        self.assertIn("system-design/integrated-test-pages/migration-smoke", refs)

    def test_subtree_exclusions_cover_all_depths_without_excluding_siblings(self) -> None:
        includes = ("*.md", "**/*.md")
        excludes = ("topics/coordination/**",)
        for name in ["plan.md", "runs/status.md", "runs/pilot/review.md"]:
            self.assertFalse(should_include(Path("topics/coordination") / name, includes, excludes))
        self.assertTrue(should_include(Path("topics/published.md"), includes, excludes))
        self.assertTrue(should_include(Path("topics/coordination-notes.md"), includes, excludes))

    def test_rooted_exclusions_skip_only_the_top_level_directory(self) -> None:
        includes = ("*.md", "**/*.md")
        excludes = ("/input/**", "/draft.md")
        self.assertFalse(should_include(Path("input/note.md"), includes, excludes))
        self.assertFalse(should_include(Path("input/deep/note.md"), includes, excludes))
        self.assertFalse(should_include(Path("draft.md"), includes, excludes))
        self.assertTrue(should_include(Path("design-research/input/note.md"), includes, excludes))
        self.assertTrue(should_include(Path("notes/draft.md"), includes, excludes))
        self.assertTrue(should_include(Path("input.md"), includes, excludes))

    def test_build_plan_skips_markdown_named_directories_but_imports_their_notes(self) -> None:
        directory = self.workspace.source_root / "system-design/topics/agents.md"
        directory.mkdir()
        nested_note = directory / "instructions.md"
        nested_note.write_text("# Instructions\n", encoding="utf-8")

        source_paths = {note.source_path for note in make_run(self.workspace).plan.notes}

        self.assertNotIn(directory, source_paths)
        self.assertIn(nested_note, source_paths)

    def test_collision_fails_plan(self) -> None:
        duplicate = self.workspace.source_root / "system-design/topics/API!.md"
        duplicate.write_text("# Duplicate\n", encoding="utf-8")
        with self.assertRaises(MigrationFailed):
            build_migration_plan(make_run(self.workspace).config, make_run(self.workspace).roots)

    def test_imports_cannot_target_the_pdf_folder(self) -> None:
        self.write_config(
            """
            [[imports]]
            name = "papers"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "sources/papers"
            """
        )
        with self.assertRaisesRegex(MigrationFailed, "PDF folder"):
            make_run(self.workspace)

    def test_opt_in_folder_selection_includes_descendants_and_root_index(self) -> None:
        self.write_config(
            """
            [defaults]
            include = ["**/*.md", "*.md"]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"
            root_index_source = "_index.md"
            selection_mode = "opt-in"
            selection_paths = ["topics"]
            include = ["**/*.md", "*.md"]
            """
        )

        config = load_config(self.workspace.config_path)
        plan = build_migration_plan(config, make_run(self.workspace).roots)
        refs = {note.target_ref for note in plan.notes}

        self.assertIn("system-design", refs)
        self.assertIn("system-design/topics/api", refs)
        self.assertNotIn("system-design/elements/elements", refs)
        self.assertNotIn("system-design/integrated-test-pages/links", refs)

    def test_opt_out_folder_selection_excludes_descendants(self) -> None:
        self.write_config(
            """
            [defaults]
            include = ["**/*.md", "*.md"]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"
            root_index_source = "_index.md"
            selection_mode = "opt-out"
            selection_paths = ["integrated-test-pages"]
            include = ["**/*.md", "*.md"]
            """
        )

        config = load_config(self.workspace.config_path)
        plan = build_migration_plan(config, make_run(self.workspace).roots)
        refs = {note.target_ref for note in plan.notes}

        self.assertIn("system-design", refs)
        self.assertIn("system-design/topics/api", refs)
        self.assertIn("system-design/elements/elements", refs)
        self.assertNotIn("system-design/integrated-test-pages/links", refs)

    def test_missing_selection_path_fails_plan(self) -> None:
        self.write_config(
            """
            [defaults]
            include = ["**/*.md", "*.md"]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"
            selection_mode = "opt-in"
            selection_paths = ["missing-folder"]
            include = ["**/*.md", "*.md"]
            """
        )

        config = load_config(self.workspace.config_path)
        with self.assertRaises(MigrationFailed):
            build_migration_plan(config, make_run(self.workspace).roots)

    def test_public_ai_import_includes_research_sections_and_system_types(self) -> None:
        manifest = Path(__file__).resolve().parents[2] / "scripts/migrate/config.toml"
        config = load_config(manifest)
        ai_rule = next(rule for rule in config.imports if rule.name == "ai")
        config = replace(config, imports=(ai_rule,))
        import_root = self.workspace.source_root / "ai"

        # Materialize the manifest's selections without requiring external notes.
        for selection in ai_rule.selection_paths:
            path = import_root / selection
            if path.suffix == ".md":
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("# Public note\n", encoding="utf-8")
            else:
                path.mkdir(parents=True, exist_ok=True)

        public_notes = {
            "design/ai-system-design/overview.md",
            "design-research/00-overview/02-research-direction.md",
            "design-research/00-index.md",
            "design-research/03-language-and-compiler/mechanism.md",
            "product/operating-model/operating-model.md",
            "system-types/project-examples/ai-project-examples-and-design-model.md",
            "system-types/project-examples/cases/coding-agents-and-harnesses.md",
            "system-types/classification/ais-classification.md",
        }
        private_notes = {
            "product/product-model/in/private-note.md",
            "input/private-note.md",
        }
        for relative in public_notes | private_notes:
            path = import_root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("# Note\n", encoding="utf-8")

        # A public source may refer to an unselected note without publishing it.
        (import_root / "system-types/project-examples/ai-project-examples-and-design-model.md").write_text(
            "# Project examples\n\n"
            "[Private note](../../product/product-model/in/private-note.md)\n",
            encoding="utf-8",
        )
        plan = build_migration_plan(config, make_run(self.workspace).roots)
        targets = {note.source_rel_import.as_posix(): note.target_ref for note in plan.notes}
        selected = set(targets)

        self.assertTrue(public_notes <= selected)
        self.assertTrue(private_notes.isdisjoint(selected))
        self.assertEqual(
            targets["system-types/project-examples/ai-project-examples-and-design-model.md"],
            "ai/system-types/project-examples/ai-project-examples-and-design-model",
        )

    def test_synthetic_index_frontmatter_accepts_title_override(self) -> None:
        config = load_config(self.workspace.config_path)

        frontmatter = synthetic_index_frontmatter(config, Path("ai"), "AI")

        self.assertEqual(frontmatter["title"], "AI")
        self.assertEqual(frontmatter["linkTitle"], "AI")

    def test_unknown_sidebar_weight_target_fails_plan(self) -> None:
        roots = make_run(self.workspace).roots
        self.write_config(
            """
            [defaults]
            include = ["**/*.md", "*.md"]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"

            [imports.sidebar_weights]
            "missing" = 10
            """
        )

        config = load_config(self.workspace.config_path)
        with self.assertRaisesRegex(MigrationFailed, "Unknown sidebar_weights target"):
            build_migration_plan(config, roots)

    def test_conflicting_sidebar_weights_across_imports_fail_plan(self) -> None:
        roots = make_run(self.workspace).roots
        self.write_config(
            """
            [defaults]
            include = ["**/*.md", "*.md"]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"

            [imports.sidebar_weights]
            "integrated-test-pages" = 10

            [[imports]]
            name = "migration-smoke"
            source_root_kind = "repo"
            source_subtree = "tests/migrate/smoke_notes/system-design/integrated-test-pages"
            target_subtree = "system-design/integrated-test-pages"
            include = ["migration-smoke.md"]
            synthesize_section_indexes = false

            [imports.sidebar_weights]
            "." = 20
            """
        )

        config = load_config(self.workspace.config_path)
        with self.assertRaisesRegex(MigrationFailed, "Conflicting sidebar weights"):
            build_migration_plan(config, roots)


if __name__ == "__main__":
    unittest.main()
