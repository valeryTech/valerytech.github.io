from __future__ import annotations

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
        smoke_path = self.workspace.content_root / "system-design/integrated-test-pages/migration-smoke.md"
        self.assertTrue(api_path.exists())
        self.assertTrue(index_path.exists())
        self.assertTrue(smoke_path.exists())

        api_content = api_path.read_text(encoding="utf-8")
        index_content = index_path.read_text(encoding="utf-8")
        smoke_content = smoke_path.read_text(encoding="utf-8")
        self.assertIn('title: "Api"', api_content)
        self.assertIn('figure src="api.assets/api-diagram.png"', api_content)
        self.assertIn('[Caching Doc]({{< ref "system-design/topics/caching" >}})', api_content)
        self.assertIn(r"Inline math: \(x = y + 1\).", api_content)
        self.assertIn("\\[\nf(x) = x^2\n\\]", api_content)
        self.assertIn("Price stays literal at $10 a month.", api_content)
        self.assertIn(r"tracking \(R_0\)", api_content)
        self.assertIn(r"System design root with inline math \(n^2\).", index_content)
        self.assertIn("\\[\nQ = \\lambda \\times W\n\\]", index_content)
        self.assertIn('[System Elements]({{< ref "system-design/elements/elements" >}})', smoke_content)
        self.assertIn("[[missing-note]]", smoke_content)

        second = self.run_pipeline("sync")
        self.assertEqual(second, 0)
        self.assertEqual(api_content, api_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
