from __future__ import annotations

import re
import shutil
from pathlib import Path
from urllib.parse import urljoin

from scripts.migrate.models import MigrationReport, PlannedAttachment, PlannedNote
from scripts.migrate.paths import build_attachment_output_rel, source_import_root
from scripts.migrate.runtime import MigrationRoots

SOURCE_URL_RE = re.compile(r"^Source:\s*\[[^\]]+\]\(<?(https?://[^>\s)]+)>?\)", re.MULTILINE)
ROOT_HTML_URL_RE = re.compile(r"(\b(?:href|src|action)=)([\"'])(/[^\"']*)\2", re.IGNORECASE)


class AttachmentResolver:
    def __init__(self, roots: MigrationRoots, report: MigrationReport) -> None:
        self.roots = roots
        self.report = report
        self._attachments_written: dict[tuple[Path, Path], PlannedAttachment] = {}

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
                output_rel = build_attachment_output_rel(current_note, candidate.name)
                return candidate, output_rel
        return None

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
