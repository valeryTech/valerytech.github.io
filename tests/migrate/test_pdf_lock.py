from __future__ import annotations

import hashlib
import tempfile
import unittest
from pathlib import Path

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from scripts.migrate.pdf_lock import (
    KEY_SETTING,
    MAGIC,
    NONCE_BYTES,
    PASSWORD_SETTING,
    SLOT_COUNT,
    build_pdf_lock,
    load_pdf_lock,
)

KEY = bytes(range(32))
PDF = b"%PDF-1.7\nA small paper\n%%EOF\n"
SLOT_BYTES = NONCE_BYTES + 32 + 16
SLOTS_START = len(MAGIC) + 4 + 16


def open_sealed(sealed: bytes, minute: int, password: str) -> bytes:
    """Opens a locked file the way assets/js/pdf-reader.mjs does."""
    iterations = int.from_bytes(sealed[len(MAGIC) : len(MAGIC) + 4], "big")
    salt = sealed[len(MAGIC) + 4 : SLOTS_START]
    wrapping_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    slot = sealed[SLOTS_START + minute * SLOT_BYTES : SLOTS_START + (minute + 1) * SLOT_BYTES]
    key = AESGCM(wrapping_key).decrypt(slot[:NONCE_BYTES], slot[NONCE_BYTES:], None)
    body = sealed[SLOTS_START + SLOT_COUNT * SLOT_BYTES :]
    return AESGCM(key).decrypt(body[:NONCE_BYTES], body[NONCE_BYTES:], None)


class PdfLockTests(unittest.TestCase):
    def test_each_minute_opens_with_its_own_password(self) -> None:
        sealed = build_pdf_lock(KEY, "p{minute:02d}", 1000).seal(PDF)

        self.assertTrue(sealed.startswith(MAGIC))
        self.assertNotIn(PDF, sealed)
        self.assertEqual(open_sealed(sealed, 7, "p07"), PDF)
        self.assertEqual(open_sealed(sealed, 59, "p59"), PDF)
        with self.assertRaises(InvalidTag):
            open_sealed(sealed, 7, "p08")

    def test_sealing_is_repeatable(self) -> None:
        self.assertEqual(
            build_pdf_lock(KEY, "{minute}", 1000).seal(PDF),
            build_pdf_lock(KEY, "{minute}", 1000).seal(PDF),
        )

    def test_lock_file_errors_name_the_problem(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / ".env.pdf-reader"
            with self.assertRaisesRegex(FileNotFoundError, ".env.pdf-reader"):
                load_pdf_lock(path)

            path.write_text(f"{KEY_SETTING}={KEY.hex()}\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, PASSWORD_SETTING):
                load_pdf_lock(path)

            path.write_text(
                f"{KEY_SETTING}={KEY.hex()}\n{PASSWORD_SETTING}={{hour}}\n", encoding="utf-8"
            )
            with self.assertRaisesRegex(ValueError, "minute"):
                load_pdf_lock(path)

            path.write_text(f"{KEY_SETTING}=abcd\n{PASSWORD_SETTING}={{minute}}\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "32 bytes"):
                load_pdf_lock(path)


if __name__ == "__main__":
    unittest.main()
