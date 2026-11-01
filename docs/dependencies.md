# Dependency maintenance

## Version authorities

| Source                                                                     | Owns                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------ |
| [.infra/versions.env](../.infra/versions.env)                              | Node, npm, Hugo, Sass, uv, Node installer        |
| [package.json](../package.json), [package-lock.json](../package-lock.json) | JavaScript packages and resolved dependency tree |
| [uv.lock](../uv.lock)                                                      | Migration Python dependencies                    |
| `themes/hextra/` submodule                                                 | Pinned theme commit                              |
| [.github/workflows/](../.github/workflows/)                                | Actions and source-map CLI versions              |

## Local compatibility decisions

- KaTeX styles/fonts are pinned to the version matching Hugo's embedded math
  renderer; serve both locally and verify real formula rendering after updates.
- The Node container installs `libatomic1` for the selected Linux runtime.
- Keep the theme cycling and outline controller overrides and review local head/sidebar
  adapters against the pinned theme when upgrading.
- Commit manifests with their lockfiles; toolchain changes also require an image rebuild.

Use the [runbook](runbook.md#hextra-theme) for upgrade/build/browser commands and
[infra.md](infra.md) for the supported Docker/CI environment. Release history
and previous versions remain in Git history and upstream release notes.
