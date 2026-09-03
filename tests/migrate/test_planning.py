from __future__ import annotations

from pathlib import Path
from textwrap import dedent
import unittest

from scripts.migrate.config import load_config
from scripts.migrate.planning import (
    MigrationFailed,
    build_migration_plan,
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

    def test_collision_fails_plan(self) -> None:
        duplicate = self.workspace.source_root / "system-design/topics/API!.md"
        duplicate.write_text("# Duplicate\n", encoding="utf-8")
        with self.assertRaises(MigrationFailed):
            build_migration_plan(make_run(self.workspace).config, make_run(self.workspace).roots)

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
