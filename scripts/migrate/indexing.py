from __future__ import annotations

from collections import defaultdict
from pathlib import Path

from scripts.migrate.models import MigrationPlan, PlannedNote
from scripts.migrate.text import normalize_note_key


class NoteIndex:
    def __init__(self, notes: tuple[PlannedNote, ...]) -> None:
        self._notes_by_global: dict[str, PlannedNote] = {}
        self._notes_by_import: dict[tuple[str, str], PlannedNote] = {}
        self._notes_by_basename: dict[str, list[PlannedNote]] = defaultdict(list)

        for note in notes:
            global_key = normalize_note_key(note.source_rel_global)
            import_key = normalize_note_key(note.source_rel_import)
            basename_key = normalize_note_key(Path(note.source_rel_import.name))
            self._notes_by_global[global_key] = note
            self._notes_by_import[(note.import_rule.name, import_key)] = note
            self._notes_by_basename[basename_key].append(note)

    def resolve(self, current_note: PlannedNote, raw_target: str) -> PlannedNote | None:
        normalized_target = normalize_note_key(raw_target)
        if not normalized_target:
            return None

        import_candidates = [
            normalize_note_key(current_note.source_rel_import.parent / raw_target),
            normalize_note_key(raw_target),
        ]
        global_candidates = [
            normalize_note_key(current_note.source_rel_global.parent / raw_target),
            normalize_note_key(current_note.import_rule.source_subtree / raw_target),
            normalize_note_key(raw_target),
        ]

        for key in import_candidates:
            if key and (note := self._notes_by_import.get((current_note.import_rule.name, key))):
                return note

        for key in global_candidates:
            if key and (note := self._notes_by_global.get(key)):
                return note

        basename_matches = self._notes_by_basename.get(normalized_target, [])
        if len(basename_matches) == 1:
            return basename_matches[0]
        return None


def build_note_index(plan: MigrationPlan) -> NoteIndex:
    return NoteIndex(plan.notes)
