from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

LOCK_FILE = ".env.pdf-reader"
KEY_SETTING = "PDF_READER_KEY"
PASSWORD_SETTING = "PDF_READER_PASSWORD"

MAGIC = b"VTL1"
SLOT_COUNT = 60
ITERATIONS = 100_000
KEY_BYTES = 32
NAME_BYTES = 16
NONCE_BYTES = 12
SALT_BYTES = 16


def _derive(key: bytes, label: bytes, data: bytes = b"") -> bytes:
    return hmac.new(key, label + data, hashlib.sha256).digest()


@dataclass(frozen=True)
class PdfLock:
    key: bytes
    header: bytes

    def seal(self, pdf: bytes) -> bytes:
        # An unchanged PDF re-imports byte for byte.
        nonce = _derive(self.key, b"body", pdf)[:NONCE_BYTES]
        return self.header + nonce + AESGCM(self.key).encrypt(nonce, pdf, None)

    def name(self, pdf: bytes) -> str:
        # Keyed on the contents, so a file keeps its name when it moves and the name says nothing about it.
        return _derive(self.key, b"name", pdf)[:NAME_BYTES].hex()


def build_pdf_lock(key: bytes, password_template: str, iterations: int) -> PdfLock:
    if len(key) != KEY_BYTES:
        raise ValueError(f"{KEY_SETTING} must be {KEY_BYTES} bytes written as hex")
    salt = _derive(key, b"salt")[:SALT_BYTES]
    slots = []
    for minute in range(SLOT_COUNT):
        password = password_template.format(minute=minute)
        if not password:
            raise ValueError(f"{PASSWORD_SETTING} must not produce an empty password")
        wrapping_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        nonce = _derive(key, b"slot", bytes([minute]))[:NONCE_BYTES]
        slots.append(nonce + AESGCM(wrapping_key).encrypt(nonce, key, None))
    header = MAGIC + iterations.to_bytes(4, "big") + salt + b"".join(slots)
    return PdfLock(key=key, header=header)


def read_settings(path: Path) -> dict[str, str]:
    settings: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        settings[name.strip()] = value.strip().strip("\"'")
    return settings


def load_pdf_lock(path: Path) -> PdfLock:
    if not path.exists():
        raise FileNotFoundError(f"The import needs {path.name} to copy PDFs")
    settings = read_settings(path)
    missing = [name for name in (KEY_SETTING, PASSWORD_SETTING) if not settings.get(name)]
    if missing:
        raise ValueError(f"{path.name} does not set {', '.join(missing)}")
    try:
        key = bytes.fromhex(settings[KEY_SETTING])
    except ValueError as exc:
        raise ValueError(f"{KEY_SETTING} must be hex") from exc
    try:
        return build_pdf_lock(key, settings[PASSWORD_SETTING], ITERATIONS)
    except (KeyError, IndexError) as exc:
        raise ValueError(f"{PASSWORD_SETTING} may use only the {{minute}} field") from exc
