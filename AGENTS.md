# American Buying Service Agent Rules

These rules govern work in this project. They intentionally include only workspace
boundaries, token-saving, optimization, verification, and deployment packaging.

## Required Project Guides

- Before starting any task or making any workspace change, read `AGENTS.md`,
  `DESIGNER.md`, and `WEIGHT.md` in full. Do this again for every new task.
- `DESIGNER.md` governs visual consistency and responsive behavior.
- `WEIGHT.md` governs asset optimization, budgets, and deployment-weight checks.
- When instructions conflict, follow the user's newest explicit request first,
  preserve the workspace boundary, and document any intentional budget exception.

## Workspace Boundary

- Work only inside `D:\Codex projects\American Buying Service new site`.
- Do not read, copy, reference, modify, or deploy assets from another folder unless
  the user explicitly names one file as a limited exception for the current task.
- All live images, logos, videos, fonts, scripts, and styles must exist inside this
  project before they are referenced by the site.
- New pages must reuse the approved site header and footer so navigation, branding,
  responsive behavior, and contact details remain consistent.
- Preserve user files and unrelated changes. Do not delete or overwrite source
  assets unless the user explicitly requests it.

## Token-Saving Rules

- Start every new task in full caveman mode unless the user explicitly asks for a different style: use short words, short sentences, and no unnecessary explanation or formatting.
- Keep commentary, command output, documentation, and final handoffs concise.
- Report outcomes, verified measurements, failures, and required next actions
  without repeating unchanged context.
- Prefer targeted `rg`, file-specific reads, counts, and verification summaries
  over recursive listings, full logs, or entire-document output.
- Cap routine command output at approximately 100 lines. If that hides a failure,
  rerun a narrower command that exposes the relevant lines.
- Do not print complete build logs, generated bundles, large diffs, archive
  listings, or long documents when a focused query is sufficient.
- Record only verified results. Never hide warnings or failures to save tokens.
- Keep these permanent rules compact. Replace obsolete guidance rather than
  appending duplicate or historical instructions.

## Optimization Rules

- Optimize only project-local assets that are actually referenced by the site.
- Preserve approved design, crop, aspect ratio, duration, playback behavior,
  transparency, filenames, and paths unless a change is explicitly authorized.
- Keep transparent brand artwork in a format that preserves alpha. Do not convert
  a transparent logo to a format or background treatment that damages it.
- For photographic images, prefer appropriately sized WebP or AVIF delivery assets
  when they are materially smaller. Keep responsive dimensions and stable layout.
- For video delivery, prefer web-compatible H.264, `yuv420p`, and MP4 fast-start.
  Preserve required duration and aspect ratio; remove audio only when the site
  intentionally uses muted video.
- Process every deployed video with FFmpeg. Optimize it as much as practical while
  preserving good visual quality, the required duration, aspect ratio, and playback
  behavior; compare file sizes and keep the smallest verified acceptable encode.
- Hero videos should use `autoplay muted loop playsinline` and an appropriate
  preload strategy. Do not attach or preload unused video sources.
- Validate optimized videos with metadata inspection and a full decode check.
  Validate images for dimensions, alpha when required, and visual integrity.
- Never replace a smaller asset with a larger encode merely because it was
  reprocessed. Compare bytes and retain the better verified result.
- Remove files from deployment output only when they are proven unreferenced by
  built HTML, CSS, or JavaScript. Do not delete source masters as deployment cleanup.
- Report before/after byte sizes for material optimization work. Do not claim
  performance scores that were not measured.

## Deployment Rules

- A successful local build or ZIP creation is not proof of an external deployment.
  Do not claim Hostinger or another host was updated without direct evidence.
- The user permanently authorizes this project to refresh its local live output,
  create the canonical ZIP, commit, and push after every verified site change.
  Do not ask for repeated confirmation.
- This standing authorization applies only to the
  `american-buying-service-site-new` repository and this project folder.
- External Hostinger upload still requires direct deployment access. Never claim
  that Hostinger was updated without direct evidence.
- The newest verified production output is the only valid deployment input.
  Old ZIPs, timestamps, screenshots, source folders, and previous extraction
  directories are not proof of current output.
- For this static site, `live/` is the canonical local production folder. Refresh it
  after every verified site change with only referenced live files.
- If a future build system creates `dist/`, verify it first, then synchronize the
  verified production files into `live/`.
- Before packaging, verify HTML/CSS/JavaScript references, required pages and media,
  no missing files, no horizontal overflow at required breakpoints, and no
  blocking browser or script errors.
- Hostinger handoff: upload the canonical ZIP inside the existing `public_html`
  folder, extract it there with overwrite enabled, and do not delete the existing
  `public_html` folder first.
- Keep `.github/workflows/deploy-pages.yml` enabled so every push to `main`
  publishes `live/` to GitHub Pages.
- The Pages deployment job must expose
  `${{ steps.deployment.outputs.page_url }}` through the `github-pages`
  environment and the workflow summary.
- Keep the repository README deployment badge and latest live-site link current.
- Every final handoff after a push must include the GitHub Pages live URL.

## Automatic Git Workflow

- After every requested site change passes relevant verification:
  1. Refresh `live/`.
  2. Rebuild and verify the canonical Hostinger ZIP from `live/`.
  3. Stage the matching source, project-local assets, rule documents, `live/`, and
     canonical ZIP.
  4. Commit with a short description of the verified change.
  5. Push to `origin/main` in `american-buying-service-site-new`.
- Do not ask for confirmation before these five steps.
- Do not stage files outside this project or unrelated temporary artifacts.
- If authentication, remote configuration, validation, or push fails, stop, preserve
  the local work, and report the exact blocker. Never report an unverified push.

## Hard Git and Live Parity Rule

- In this project, "live deployment" always means the committed `live/` folder.
  It does not mean Hostinger. Treat `live/` as the exact GitHub Pages deployment
  source and the required production mirror for every website change.
- Every website change must update the source production files and their matching
  files in `live/` before the Git commit is created.
- A website change is incomplete until `live/` is refreshed in the same task. Do
  not defer this step, do not describe it as optional, and do not commit or push
  a website change while `live/` is stale.
- The source, `live/`, and canonical Hostinger ZIP must represent the same verified
  website version in the same commit. Never push a site change with a stale `live/`
  folder or stale deployment ZIP.
- Same-commit enforcement: every Git commit that changes a website source file must
  also contain its matching `live/` file and the rebuilt canonical ZIP. Never make
  a source-only website commit, a later `live/` catch-up commit, or a later ZIP
  catch-up commit. Check the staged diff before committing; if any one of the three
  versions is absent or differs, do not commit or push.
- Before every site-change commit, compare SHA-256 hashes for each production file
  that exists in both the source root and `live/`. All matching paths must have
  identical hashes.
- Also check the parity in both directions: every tracked website file in the Git
  working tree must be present in `live/`, and every `live/` file must match a
  tracked website file or be an explicitly required deployment file such as
  `.nojekyll`. This includes tracked concept pages, concept assets, and alternate
  local website assets. Exclude only Git metadata, GitHub workflow files, Markdown
  documentation, the canonical ZIP, and temporary verification folders. A missing,
  stale, or extra deployment file blocks the commit and push.
- Rebuild the canonical Hostinger ZIP only from the synchronized `live/` folder and
  verify extraction parity before pushing.
- Source-only documentation, concept previews, and development files remain outside
  `live/` and the Hostinger ZIP; their intentional exclusion does not break parity.
- Treat any source/`live/`/ZIP mismatch as a deployment-blocking failure. Fix the
  mismatch before committing or pushing.

## Permanent Hostinger ZIP Rules

- Canonical archive name:
  `american-buying-service-hostinger-public_html-ready.zip`.
- Refresh the canonical archive in place. Do not create dated, duplicate, or
  alternate deployment ZIPs unless the user explicitly requests another filename.
- Build the archive only from the final verified `live/` directory.
- The ZIP root must contain the live site files directly, such as `index.html`,
  CSS, JavaScript, `.htaccess` when present, and referenced media folders/files.
  Do not include a staging, `dist/`, or `public_html/` wrapper directory.
- Put every referenced asset and required site file inside the ZIP under its correct
  relative site folder, matching its HTML, CSS, and JavaScript reference path.
- ZIP entries must be relative paths only: never absolute drive paths, leading `/`,
  leading `\\`, `..` segments, or files outside the `live/` deployment folder.
- Store ZIP entry paths with standard forward slashes only; never Windows
  backslashes. The archive must extract directly into Hostinger `public_html`
  without creating an extra enclosing folder.
- Exclude source-only files, documentation, screenshots, backups, old ZIPs,
  temporary tools, source maps, package caches, `node_modules`, and `.git`.
- Never retain temporary ZIP extraction or verification folders in the project root.
  Remove them after a successful verification. Keep only `live/` and the canonical
  `american-buying-service-hostinger-public_html-ready.zip` deployment package.
- Before delivery, verify:
  - archive readability and CRC;
  - safe, unique, forward-slash entry paths;
  - required root files;
  - complete file-count parity with deployment input;
  - SHA-256 parity after extraction;
  - no missing referenced files;
  - no excluded development or backup files.
- Report the final archive filename, byte size, file count, verification outcome,
  and exact upload/extraction instruction.

## Verification Discipline

- Check grammar whenever visible text is added or changed.
- Test in proportion to the change and include desktop, tablet, and mobile when
  layout or media behavior changes.
- Record only checks that were actually run.
- If any required check fails, report it and do not label the package production
  ready.
