from __future__ import annotations

import unittest

from scripts.migrate.models import Callout, FencedCode, Heading
from scripts.migrate.parser import parse_document
from tests.migrate.support import FIXTURE_ROOT


class ParserTests(unittest.TestCase):
    def test_parse_document_extracts_frontmatter_and_structured_blocks(self) -> None:
        content = (FIXTURE_ROOT / "source_notes/system-design/topics/http.md").read_text(encoding="utf-8")
        document = parse_document(content)
        self.assertEqual(document.frontmatter["title"], "Hypertext Transfer Protocol")
        self.assertEqual(document.frontmatter["linkTitle"], "HTTP")

    def test_parse_document_keeps_fenced_code_opaque(self) -> None:
        content = (FIXTURE_ROOT / "source_notes/system-design/topics/api.md").read_text(encoding="utf-8")
        document = parse_document(content)
        self.assertTrue(any(isinstance(block, FencedCode) for block in document.blocks))
        self.assertTrue(any(isinstance(block, Callout) for block in document.blocks))
        self.assertTrue(any(isinstance(block, Heading) and block.text == "Local Heading" for block in document.blocks))


if __name__ == "__main__":
    unittest.main()
