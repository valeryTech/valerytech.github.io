from __future__ import annotations

import shutil
from pathlib import Path

from scripts.migrate.models import MigrationPlan


def sync_to_content(plan: MigrationPlan, content_root: Path, staging_root: Path) -> None:
    managed_targets = sorted(set(plan.managed_targets), key=lambda path: len(path.parts), reverse=True)
    for target in managed_targets:
        live_target = content_root / target
        staged_target = staging_root / target
        if live_target.exists():
            if live_target.is_dir():
                shutil.rmtree(live_target)
            else:
                live_target.unlink()
        if staged_target.exists():
            shutil.copytree(staged_target, live_target)
