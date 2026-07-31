# American Buying Service

[![Deploy latest site](https://github.com/Cynicalfocus123/american-buying-service-site-new/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Cynicalfocus123/american-buying-service-site-new/actions/workflows/deploy-pages.yml)

**Latest live site:**

[https://cynicalfocus123.github.io/american-buying-service-site-new/](https://cynicalfocus123.github.io/american-buying-service-site-new/)

This repository contains the working American Buying Service website—not only concept
images. The production-ready static site is stored in `live/` and includes:

- Responsive desktop, tablet, and mobile layouts
- Transparent branded navigation over one HTML5 hero video
- Shipment-tracking interface
- Responsive service panels
- American Buying Service branding in the header and footer

Every push to `main` deploys `live/` through GitHub Actions. The deployment job and
workflow summary display the current GitHub Pages URL.

## Local preview

From the project folder:

```powershell
python -m http.server 4173 --directory live
```

Then open `http://localhost:4173`.
