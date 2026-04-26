from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class WarningRecord:
    code: str
    message: str
    source: str | None = None


@dataclass
class MigrationReport:
    command: str
    config_path: str
    source_root: str
    managed_targets: list[str] = field(default_factory=list)
    generated_files: list[str] = field(default_factory=list)
    warnings: list[WarningRecord] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)

    def add_warning(self, code: str, message: str, source: str | None = None) -> None:
        self.warnings.append(WarningRecord(code=code, message=message, source=source))

    def add_error(self, message: str) -> None:
        self.errors.append(message)
