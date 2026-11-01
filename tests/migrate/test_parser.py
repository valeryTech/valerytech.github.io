from __future__ import annotations

import unittest
from typing import cast

from scripts.migrate.conversion import RenderContext, convert_block
from scripts.migrate.models import Callout, FencedCode, Heading, MarkdownChunk
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

    def test_parse_document_drops_tag_lines_outside_code(self) -> None:
        document = parse_document(
            "# Ladder\n#ai-eng/collection How are problems framed?\n#todo\nText #inline stays.\n"
            "#1 rule stays.\n```\n#todo in code\n```\n"
        )
        self.assertEqual(document.blocks[0], Heading(level=1, text="Ladder"))
        self.assertEqual(document.blocks[1], MarkdownChunk(text="Text #inline stays.\n#1 rule stays."))
        self.assertEqual(document.blocks[2], FencedCode(fence="```", info="", text="#todo in code"))

    def test_parse_document_keeps_the_indent_of_a_fence_inside_a_list_item(self) -> None:
        document = parse_document('- **Gate.** A rule:\n\n  ```json\n  {"ask": []}\n  ```\n\n  More of the item.\n')
        self.assertEqual(document.blocks[1], FencedCode(fence="```", info="json", text='  {"ask": []}', indent="  "))
        self.assertEqual(convert_block(document.blocks[1], cast(RenderContext, None)), '  ```json\n  {"ask": []}\n  ```')


if __name__ == "__main__":
    unittest.main()
