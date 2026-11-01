from __future__ import annotations

from pathlib import Path
from textwrap import dedent
import unittest

from scripts.migrate.config import load_config
from tests.migrate.support import make_workspace


class MigrationConfigTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workspace = make_workspace()

    def tearDown(self) -> None:
        self.workspace.cleanup()

    def write_config(self, body: str) -> None:
        self.workspace.config_path.write_text(dedent(body).strip() + "\n", encoding="utf-8")

    def test_defaults_to_opt_out_with_empty_selection_paths(self) -> None:
        config = load_config(self.workspace.config_path)
        rule = config.imports[0]
        self.assertEqual(rule.selection_mode, "opt-out")
        self.assertEqual(rule.selection_paths, tuple())
        self.assertIsNone(rule.section_title)
        self.assertEqual(
            rule.sidebar_weights,
            {Path("topics"): 10, Path("topics/api"): 20},
        )

    def test_section_title_must_be_non_empty(self) -> None:
        self.write_config(
            """
            [defaults]

            [[imports]]
            name = "ai"
            source_root_kind = "external"
            source_subtree = "ai"
            target_subtree = "ai"
            section_title = "  "
            """
        )

        with self.assertRaisesRegex(ValueError, "section_title"):
            load_config(self.workspace.config_path)

    def test_sidebar_weights_must_use_relative_extensionless_paths(self) -> None:
        invalid_paths = (
            ("/topics", "relative"),
            ("../topics", "'..'"),
            ("topics.md", "extensionless"),
        )
        for invalid_path, message in invalid_paths:
            with self.subTest(path=invalid_path):
                self.write_config(
                    f"""
                    [defaults]

                    [[imports]]
                    name = "system-design"
                    source_root_kind = "external"
                    source_subtree = "system-design"
                    target_subtree = "system-design"

                    [imports.sidebar_weights]
                    "{invalid_path}" = 10
                    """
                )

                with self.assertRaisesRegex(ValueError, message):
                    load_config(self.workspace.config_path)

    def test_sidebar_weights_must_be_numeric(self) -> None:
        self.write_config(
            """
            [defaults]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"

            [imports.sidebar_weights]
            "topics" = "first"
            """
        )

        with self.assertRaisesRegex(ValueError, "must be numeric"):
            load_config(self.workspace.config_path)

    def test_opt_in_requires_selection_paths(self) -> None:
        self.write_config(
            """
            [defaults]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"
            selection_mode = "opt-in"
            """
        )

        with self.assertRaisesRegex(ValueError, "selection_paths"):
            load_config(self.workspace.config_path)

    def test_invalid_selection_mode_fails(self) -> None:
        self.write_config(
            """
            [defaults]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"
            selection_mode = "sometimes"
            """
        )

        with self.assertRaisesRegex(ValueError, "selection_mode"):
            load_config(self.workspace.config_path)

    def test_selection_paths_must_be_relative(self) -> None:
        self.write_config(
            """
            [defaults]

            [[imports]]
            name = "system-design"
            source_root_kind = "external"
            source_subtree = "system-design"
            target_subtree = "system-design"
            selection_mode = "opt-in"
            selection_paths = ["/tmp/outside"]
            """
        )

        with self.assertRaisesRegex(ValueError, "relative paths"):
            load_config(self.workspace.config_path)


if __name__ == "__main__":
    unittest.main()
