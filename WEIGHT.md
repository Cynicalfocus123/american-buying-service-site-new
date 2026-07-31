# American Buying Service Weight and Optimization Rules

These rules define delivery targets and verification requirements. Targets guide
optimization; visual integrity and correct playback remain mandatory.

## Measurement Rules

- Measure source assets, referenced live assets, deployment input, and final ZIP
  separately. Do not mix their totals.
- Report exact byte counts for material media or packaging work.
- Count only referenced production files when evaluating live page weight.
- Never claim a Lighthouse score, transfer size, cache result, or external performance
  result that was not directly measured.

## Initial-Load Targets

- Keep critical HTML, CSS, and JavaScript compact and free of unused frameworks.
- Target combined uncompressed CSS and JavaScript below 250 KB for this static site.
- Avoid third-party libraries for interactions that can be implemented safely with
  small project-local JavaScript.
- Load only the current hero video source. Do not preload unused or alternate videos.
- Below-fold imagery should use appropriate lazy loading unless it is needed
  immediately for layout or the first viewport.

## Image Targets

- Use correct intrinsic dimensions and stable CSS sizing to prevent layout shift.
- Prefer WebP or AVIF for photographic delivery images when they are smaller.
- Preserve PNG when transparency or brand fidelity requires it.
- Provide responsive derivatives when a large image is displayed substantially
  smaller on tablet or mobile.
- As a working target, keep ordinary below-fold photographic images below 350 KB and
  large hero or full-width images below 700 KB when quality permits.
- Do not upscale small sources or repeatedly recompress already optimized images.

## Logo Rules

- Preserve alpha, sharp edges, and the full approved artwork.
- Optimize losslessly when possible. Never accept visible haloing, background color,
  clipped text, or aspect-ratio distortion merely to reduce bytes.
- Logo readability takes priority over an arbitrary file-size target.

## Video Targets

- Production MP4 should use broadly compatible H.264 with `yuv420p` and fast-start.
- Preserve the approved aspect ratio, crop, duration, frame cadence, and loop behavior.
- Remove audio only for intentionally muted decorative video.
- Prefer a suitable poster and avoid loading multiple hero sources simultaneously.
- Working target for the single hero delivery video is below 12 MB, with below 8 MB
  preferred when visual quality remains acceptable.
- Before replacement, compare encoded byte size and visual quality with the active
  file. Keep the existing file when a new encode is larger or visibly worse.
- Validate final video metadata and complete decoding before deployment.

## Deployment Cleanup

- Include only files referenced by production HTML, CSS, or JavaScript.
- Exclude concept screenshots, documentation, source masters, unused alternate
  videos, backups, temporary files, old ZIPs, and development tools.
- Remove an asset from deployment output only after proving it is unreferenced.
- Deployment cleanup must never delete the project-local source file.

## Required Weight Audit

Before calling a deployment package ready:

1. Enumerate referenced production assets.
2. Confirm every reference resolves inside the deployment input.
3. Confirm unused source media is excluded from the deployment input.
4. Record deployment file count and total bytes.
5. Record media totals by image, video, CSS, and JavaScript.
6. Verify the canonical ZIP file count and extraction parity.
7. Report any target exceeded and why it was retained.

## Optimization Safety

- Create versioned optimized derivatives unless the user explicitly authorizes
  overwriting an original.
- Do not change layout, text, media crop, playback, or branding during a weight-only
  task.
- Run responsive and visual checks after any media-format or dimension change.
- A smaller file is not an improvement if it breaks transparency, readability,
  playback, browser support, or visual quality.
