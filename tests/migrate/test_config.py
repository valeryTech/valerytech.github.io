from __future__ import annotations

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
