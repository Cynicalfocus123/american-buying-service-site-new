# American Buying Service — concept prototype

This first-round prototype includes:

- Three switchable visual directions: **Atlas**, **Horizon**, and **Midnight**
- Responsive desktop, tablet, and mobile layouts
- Native HTML5 video hero with slider controls, autoplay, pause/play, muted loop, and `playsinline`
- A redesigned comparison section based on the supplied reference
- The supplied American Buying Service logo in both the header and footer

## Preview locally

From this folder, run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Optional FFmpeg web encodes

The current MP4 files work in the prototype. For production, these commands create
smaller web-friendly MP4 and WebM versions:

```powershell
ffmpeg -i input.mp4 -an -c:v libx264 -preset slow -crf 24 -movflags +faststart -pix_fmt yuv420p hero-web.mp4
ffmpeg -i input.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 hero-web.webm
```

Add the WebM source before the MP4 source in the `<video>` element when the encode
is ready.
