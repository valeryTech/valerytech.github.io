# Dependency update: 2026-10-30

The Hextra migration branch uses the following updated releases. Versions were
checked against npm registry metadata and the projects' published releases.

| Component | Previous installed version | Updated version |
| --- | --- | --- |
| Node.js | 24.15.0 | 26.13.0 LTS |
| npm | 11.13.0 | 12.2.1 |
| Hugo | 0.160.1 | 0.169.0 |
| uv | 0.11.6 | 0.13.6 |
| PostHog browser SDK | 1.434.15 | 1.444.0 |
| FlexSearch | 0.8.143 | 0.8.212 |
| KaTeX styles/fonts | 0.16.25 | 0.18.4 |
| Prettier | 3.4.2 | 3.9.10 |
| Vite | 8.0.16 | 8.3.5 |
| DOMPurify (transitive) | 3.4.16 | 3.4.17 |
| PostHog source-map CLI | 0.10.0 | 0.19.0 |

The Jost dependency's minimum is raised from 5.2.0 to its already-resolved 5.3.0.
Hextra 0.13.0, Playwright Core 1.64.1, Microsoft Clarity 1.0.2, and Dart Sass
1.107.0 were already current and retain their versions. The Node installer is
explicitly pinned to `n` 11.0.0. Toolchain versions live in
`.infra/versions.env`; browser packages and their resolution live in
`package.json` and `package-lock.json`.

GitHub Actions move to the current release lines: checkout/setup-node v7,
upload-artifact v7, configure-pages v6, upload-pages-artifact v5, and deploy-pages
v5. The PostHog upload action stays on v2 with its CLI version updated separately.

## Compatibility decisions

- [Node 26.13.0 is an LTS release](https://nodejs.org/en/blog/release/v26.13.0).
  Its Linux binaries require `libatomic`, so the container explicitly installs
  `libatomic1`. Local containers and CI select the same Node/npm versions.
- [Hugo 0.169.0](https://github.com/gohugoio/hugo/releases/tag/v0.169.0) is used
  with current data access (`hugo.Data`) and `.RawSummary`. Language settings use
  `locale`/`label`; image quality and hints are specified per output format.
  Existing locale and image-quality values are retained.
- KaTeX is deliberately pinned to **0.18.4**, matching
  [Hugo's embedded renderer](https://gohugo.io/functions/transform/tomath/).
  The standalone 0.19.1 release is not paired with an older renderer. Styles and
  fonts remain local, and the browser checks exercise their actual rendering.
- npm 12 blocks the optional `core-js` postinstall message. This script is not
  needed to use the package; a clean installation and production build work
  without approving it.
- DOMPurify is updated within its existing transitive dependency range to
  [3.4.17](https://github.com/cure53/DOMPurify/releases/tag/3.4.17). The resulting
  lockfile reports zero npm audit vulnerabilities at the time of this update.

## Verification and future updates

Rebuild the image and run the project through the supported toolchain:

```bash
docker compose build site
docker compose run --rm site true
make build
docker compose exec -T site npm run lint:styles
docker compose exec -T site npm run lint:ui
docker compose exec -T site npm run test:analytics
docker compose exec -T site npm run test:ui
docker compose exec -T site uv run --frozen python -m unittest discover -s tests/migrate
```

The bootstrap command uses `npm ci` when the lockfile has changed. After updating
packages, commit both the manifest and lockfile. Keep the runtime pins, package
manager field, and infrastructure documentation consistent.

Run browser checks against the production output served by Vite, using Chrome
and WebKit. The suite exercises real local search and keyboard navigation,
KaTeX display fonts and stylesheet compatibility, font persistence, breadcrumbs,
callouts, nested navigation, responsive boundaries, and opaque sticky surfaces.
The PostHog CLI installation and `sourcemap process --help` command are checked
without uploading source maps. GitHub-hosted workflow execution and deployment
take place after pushing through the normal repository workflow.
