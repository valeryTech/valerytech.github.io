from __future__ import annotations

import os
import re
import shutil
from pathlib import Path
from urllib.parse import urljoin

from scripts.migrate.models import MigrationReport, PlannedAttachment, PlannedNote
from scripts.migrate.paths import build_attachment_output_rel, build_pdf_output_rel, source_import_root
from scripts.migrate.pdf_lock import LOCK_FILE, PdfLock, load_pdf_lock
from scripts.migrate.planning import MigrationFailed
from scripts.migrate.runtime import MigrationRoots

SOURCE_URL_RE = re.compile(r"^Source:\s*\[[^\]]+\]\(<?(https?://[^>\s)]+)>?\)", re.MULTILINE)
ROOT_HTML_URL_RE = re.compile(r"(\b(?:href|src|action)=)([\"'])(/[^\"']*)\2", re.IGNORECASE)
# The reader downloads a whole file before it opens, so the largest books stay out.
MAX_PDF_BYTES = 45 * 1024 * 1024


class AttachmentResolver:
    def __init__(self, roots: MigrationRoots, report: MigrationReport) -> None:
        self.roots = roots
        self.report = report
        self._attachments_written: dict[tuple[Path, Path], PlannedAttachment] = {}
        self._pdf_lock: PdfLock | None = None
        self._pdf_index: dict[str, list[Path]] | None = None

    def pdf_lock(self) -> PdfLock:
        # Loaded with the first PDF, so imports without PDFs need no lock file.
        if self._pdf_lock is None:
            try:
                self._pdf_lock = load_pdf_lock(self.roots.repo_root / LOCK_FILE)
            except (OSError, ValueError) as exc:
                raise MigrationFailed(str(exc)) from exc
        return self._pdf_lock

    def resolve(self, current_note: PlannedNote, raw_target: str) -> tuple[Path, Path] | None:
        normalized = raw_target.replace("\\", "/").strip()
        if not normalized:
            return None

        candidates = [
            current_note.source_path.parent / normalized,
            source_import_root(self.roots, current_note.import_rule) / normalized,
            self.roots.source_root / normalized,
        ]

        for candidate in candidates:
            if candidate.exists() and candidate.is_file():
                return self._target(current_note, normalized, candidate)

        if normalized.lower().endswith(".pdf"):
            # Obsidian links a PDF by its file name, or by the shortest path that tells it apart.
            suffix = "/" + normalized.lower()
            matches = [
                path
                for path in self._pdfs_by_name().get(Path(normalized).name.lower(), [])
                if path.as_posix().lower().endswith(suffix)
            ]
            if len(matches) == 1:
                return self._target(current_note, normalized, matches[0])
            if matches:
                self.report.add_warning(
                    "ambiguous-pdf",
                    f"{len(matches)} PDFs match {normalized}; link one by its folder",
                    source=current_note.source_rel_global.as_posix(),
                )
        return None

    def _target(self, current_note: PlannedNote, normalized: str, candidate: Path) -> tuple[Path, Path] | None:
        if candidate.suffix.lower() == ".pdf":
            if candidate.stat().st_size > MAX_PDF_BYTES:
                self.report.add_warning(
                    "oversized-pdf",
                    f"PDF over {MAX_PDF_BYTES // (1024 * 1024)} MB is not copied: {normalized}",
                    source=current_note.source_rel_global.as_posix(),
                )
                return None
            return candidate, build_pdf_output_rel(self.roots.source_root, candidate)
        return candidate, build_attachment_output_rel(current_note, candidate.name)

    def _pdfs_by_name(self) -> dict[str, list[Path]]:
        # Built on first use; hidden folders such as .obsidian and .trash are skipped.
        if self._pdf_index is None:
            index: dict[str, list[Path]] = {}
            for folder, dirs, files in os.walk(self.roots.source_root, followlinks=True):
                dirs[:] = sorted(name for name in dirs if not name.startswith("."))
                for name in sorted(files):
                    if name.lower().endswith(".pdf"):
                        index.setdefault(name.lower(), []).append(Path(folder) / name)
            self._pdf_index = index
        return self._pdf_index

    def copy(
        self,
        staging_root: Path,
        source_path: Path,
        output_rel: Path,
        current_note: PlannedNote,
    ) -> PlannedAttachment:
        key = (source_path.resolve(), output_rel)
        if key in self._attachments_written:
            return self._attachments_written[key]

        destination = staging_root / output_rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        if source_path.suffix.lower() == ".pdf":
            destination.write_bytes(self.pdf_lock().seal(source_path.read_bytes()))
        else:
            shutil.copy2(source_path, destination)
        if source_path.suffix.lower() in {".html", ".htm"}:
            source_url = SOURCE_URL_RE.search(current_note.source_path.read_text(encoding="utf-8"))
            if source_url:
                # Saved pages retain URLs relative to the original site's root.
                html = destination.read_text(encoding="utf-8")
                html = ROOT_HTML_URL_RE.sub(
                    lambda match: (
                        f"{match[1]}{match[2]}{urljoin(source_url[1], match[3])}{match[2]}"
                    ),
                    html,
                )
                destination.write_text(html, encoding="utf-8")
        planned = PlannedAttachment(source_path=source_path, output_rel=output_rel)
        self._attachments_written[key] = planned
        self.report.generated_files.append(output_rel.as_posix())
        return planned
