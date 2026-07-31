# American Buying Service Agent Rules

These rules govern work in this project. They intentionally include only workspace
boundaries, token-saving, optimization, verification, and deployment packaging.

## Required Project Guides

- Read `AGENT.md`, `DESIGNER.md`, and `WEIGHT.md` before making site changes.
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
- Preserve user files and unrelated changes. Do not delete or overwrite source
  assets unless the user explicitly requests it.

## Token-Saving Rules

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

## Permanent Hostinger ZIP Rules

- Canonical archive name:
  `american-buying-service-hostinger-public_html-ready.zip`.
- Refresh the canonical archive in place. Do not create dated, duplicate, or
  alternate deployment ZIPs unless the user explicitly requests another filename.
- Build the archive only from the final verified `live/` directory.
- The ZIP root must contain the live site files directly, such as `index.html`,
  CSS, JavaScript, `.htaccess` when present, and referenced media folders/files.
  Do not include a staging, `dist/`, or `public_html/` wrapper directory.
- Store ZIP entry paths with standard forward slashes, never Windows backslashes.
- Exclude source-only files, documentation, screenshots, backups, old ZIPs,
  temporary tools, source maps, package caches, `node_modules`, and `.git`.
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
