# How to Add News

The site has no backend, so news is built from text files. Each article gets its
own page with full SEO (Google title and description, canonical URL on
www.americanbuyingservice.com, social preview tags, NewsArticle structured data,
and a sitemap entry). The News page always lists articles newest first.

## For the site owner

1. Make a new folder inside `news-source/`. Name it with lowercase words and
   dashes, for example `news-source/new-warehouse-opening/`. The name becomes
   the web address: `www.americanbuyingservice.com/news-new-warehouse-opening`.
2. Put the article photo in that folder (JPG, PNG, or WebP; at least 1600 px
   wide looks best).
3. Copy `news-source/_template/article.md` into the folder and fill it in.
4. Ask Claude Code: "Add the new news article in news-source/<folder name>."

## Article file format

```
title: Headline shown on the card and the article page
date: 2026-10-25
category: Logistics
author: American Buying Service
summary: One or two sentences (about 120-160 characters). Google shows this.
image: photo.jpg
image_alt: What the photo shows
keywords: optional, comma, separated, words
---
First paragraph.

Second paragraph. Leave one empty line between paragraphs.

## A subheading (optional)
```

- `title`, `date` (YYYY-MM-DD), `category`, `author`, `summary`, and `image` are
  required. `image_alt` and `keywords` are optional.
- Folders starting with `_` (like `_template`) are ignored.

## For Claude Code

1. Read the article folder and check the text for spelling and grammar. Do not
   invent facts, quotes, or dates; ask the owner if anything is missing.
2. Run `node tools/build-news.js` from the project root (needs ffmpeg and
   ffprobe). It converts the photo to AVIF and WebP in `assets/news/`, writes
   `news-<folder>.html`, rebuilds `news.html` newest first, and updates the
   news block in `sitemap.xml`.
3. Copy the new and changed files into `live/` (`news.html`,
   `news-<folder>.html`, `sitemap.xml`, `assets/news/*`), then follow the normal
   test, parity, ZIP, commit, and push steps in `AGENTS.md`.
4. If the owner asks for an update-only ZIP, include only the `live/` files that
   changed since the last upload.
5. Never delete an article page. If the build lists a page whose source folder
   is gone, ask the owner before removing it.
