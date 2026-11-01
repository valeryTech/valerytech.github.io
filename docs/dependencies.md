# Dependency maintenance

## Version authorities

| Source                                                                     | Owns                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [.infra/versions.env](../.infra/versions.env)                              | Node, npm, Hugo, Sass, uv, Node installer, Playwright browser |
| [package.json](../package.json), [package-lock.json](../package-lock.json) | JavaScript packages and resolved dependency tree              |
| [uv.lock](../uv.lock)                                                      | Migration Python dependencies                                 |
| `themes/hextra/` submodule                                                 | Pinned theme commit                                           |
| [.github/workflows/](../.github/workflows/)                                | Actions and source-map CLI versions                           |
| [scripts/upload-pdfs.sh](../scripts/upload-pdfs.sh)                        | rclone image that uploads PDFs to R2                          |

## Local compatibility decisions

- KaTeX styles/fonts are pinned to the version matching Hugo's embedded math renderer; serve both locally and verify real formula rendering after updates.
- `pdfjs-dist` is pinned exactly. Hugo mounts its library, worker, viewer components, CMaps, standard fonts, WASM decoders and ICC profiles under `/vendor/pdfjs/`, and the PDF reader imports them at runtime. After updating, open a PDF in the reader and check rendering, text selection and zoom.
- The Node container installs `libatomic1` for the selected Linux runtime.
- `PLAYWRIGHT_VERSION` must equal the `playwright-core` pin in `package.json`, so the image's Chromium matches the browser revision the tests expect.
- Keep the theme cycling and outline controller overrides and review local head/sidebar adapters against the pinned theme when upgrading.
- Commit manifests with their lockfiles; toolchain changes also require an image rebuild.

Use the [runbook](runbook.md#upgrades) for upgrade/build/browser commands and [infra.md](infra.md) for the supported Docker/CI environment. Release history and previous versions remain in Git history and upstream release notes.
