# Agent Contract

## Canonical sources

- `docs/runbook.md` - local commands and operation
- `docs/infra.md` - Docker image, build pipeline and CI
- `docs/architecture.md` - product summary, source ownership and site structure
- `docs/frontend.md` - UI configuration and behavior
- `docs/design/` - brand and style guides: `visual-identity.md`, `styling.md`,
  `colors.md`
- `docs/dependencies.md` - version authorities and upgrade notes
- `docs/titles.md` - how to write `title` and `linkTitle` for notes, sections
  and repo-authored pages
- [`../creds/`](../creds/README.md) - private notes kept outside the
  repository; read them when a task needs them, and never copy anything from
  them into tracked files, commit messages or PRs

## UI changes

- Before creating or changing UI (layout, components, colors, fonts, icons or
  branding), read the [design guides](docs/design/README.md) and follow them:
  [visual identity](docs/design/visual-identity.md) for brand decisions,
  [styling](docs/design/styling.md) for tokens and CSS conventions, and
  [colors](docs/design/colors.md) for the palette.
- After the change, go through the
  [UI review checklist](docs/design/README.md#ui-review-checklist) in the running
  preview: spacing, alignment, sizes, text, colors, states and resizing, at
  desktop and phone widths in Light and Dark.
- Use the existing tokens instead of new literal values. When a change alters a
  recorded decision, token or color, update the matching guide in the same
  change.

## Content changes

- When writing or importing notes, adding a collection or naming a section,
  follow the [page title rules](docs/titles.md): set `title` and `linkTitle` in
  the source front matter instead of relying on file names, and check the new
  pages' titles after `task content:migrate:check`.

## Commands

- Run every Node, npm, npx, Hugo, Playwright, uv and Python command inside
  Docker. Never run `npm`, `npx`, `node`, `hugo`, `playwright`, `uv` or `python`
  on the host, and never install packages on the host. The host needs only
  Docker, Task, `git` and `curl`.
- Use `task <namespace>:<name>` from `Taskfile.yml` as the workflow entrypoint;
  `task` lists the tasks. Common ones: `task site:up`, `task site:down`,
  `task site:build`, `task site:verify`, `task quality:verify`,
  `task quality:test:navigation`, `task docker:shell`. Pass extra arguments after
  `--`, for example `task docker:run -- npm outdated`.
- For an npm script without a task, use
  `task docker:run -- npm run <script>`. When the preview from `task site:up`
  is running, `docker compose exec site npm run <script>` reuses it. Python runs
  as `task docker:run -- uv run --frozen python -m <module>`.
- Change dependencies inside Docker, for example
  `task docker:run -- npm install <package>`, and commit
  `package.json` with `package-lock.json`. The container reinstalls
  `node_modules` when the lockfile changes.
- The host `node_modules/` directory is only the mount point for the
  `valerytech-node-modules` volume. Keep it empty; nothing on the host reads it.
  The uv environment lives in the `valerytech-uv-venv` volume; never create a
  `.venv/` in the checkout. `task repo:doctor` reports host installs and
  `task repo:doctor -- --fix` removes them.
- Toolchain versions live in `.infra/versions.env`. Rebuild the image after
  changing it or `.devcontainer/`: `task docker:build`.
- CI is the one exception: GitHub Actions runs npm directly on its runner through
  `.github/actions/setup-site`.

## Validation

- Docs-only change: no mandatory validation.
- CSS, JavaScript, layout or config change: `task quality:verify`, then
  `task site:up` and `task quality:test:navigation`. Compare navigation failures
  against the unchanged code before attributing them to the change.
- Migration code change: `task quality:test:migrate`, then `task content:migrate:check`.
- Build, content pipeline or URL change: `task site:verify`.

## Commits

- Date each new commit 1 to 2 minutes after the previous commit, not at the
  current time. Read the previous date with `git log -1 --format=%cd --date=iso`
  and set both `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` to the new time, for
  example `GIT_AUTHOR_DATE="2026-11-01 18:00:30 -0300" GIT_COMMITTER_DATE="2026-11-01 18:00:30 -0300" git commit`.

## Before pushing

Notes come from a private vault and a push to `master` deploys them to the
public site, so never push until the outgoing notes have been checked locally.

- List every outgoing content change, including uncommitted and staged ones:
  `git fetch` then `git diff --stat origin/master -- content/ static/`. After an
  import, also review `.migration/work/content/` from
  `task content:migrate:check`.
- Read each new or changed note and attachment in full, not only the diff
  summary. Look for private information: personal details about anyone (names
  of private people, emails, phone numbers, addresses), credentials, API keys,
  tokens or `.env` values, employer or client confidential material, internal
  hostnames, URLs or IPs, absolute local paths such as `/Users/...`, private
  vault links, and notes or TODOs not meant for readers.
- PDFs under `content/sources/` are git-ignored and served from the R2 bucket.
  `task content:pdfs:upload -- --dry-run` lists the new and changed ones. For
  each new PDF, confirm the licence allows redistribution (CC BY, CC0, public
  domain or the author's own work). Report the others, which arXiv's default
  licence and most journal articles are, so the user can drop the link or
  replace it with the publisher's URL.
- Run `task content:pdfs:upload` before pushing notes that link new or moved
  PDFs, so no PDF link on the live site is dead.
- Report what was checked and anything suspicious to the user, and push only
  after they confirm. If something private is found, fix it in the source note
  and re-run the import rather than editing managed files in the repo.

## Development Practices

- Save temporary or exploratory scripts outside the repository, or in
  `.generated/`, which is ignored.
