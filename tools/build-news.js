#!/usr/bin/env node
// Builds the News page and one page per article from news-source/<slug>/article.md.
// Usage: node tools/build-news.js [--root <site folder>]
// Needs ffmpeg and ffprobe on PATH for article images. See NEWS-HOWTO.md.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootArg = process.argv.indexOf('--root');
const ROOT = path.resolve(rootArg > -1 ? process.argv[rootArg + 1] : path.join(__dirname, '..'));
const SOURCE = path.join(ROOT, 'news-source');
const ASSETS = path.join(ROOT, 'assets', 'news');
const SITE = 'https://www.americanbuyingservice.com/';
const SHELL = 'privacy-policy.html';
const REQUIRED = ['title', 'date', 'category', 'author', 'summary', 'image'];

const fail = (message) => { console.error(`ERROR: ${message}`); process.exit(1); };
const esc = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonText = (value) => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
const longDate = (iso) => new Date(`${iso}T00:00:00Z`)
  .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// ---- Read articles ----------------------------------------------------------

const parseArticle = (slug) => {
  const file = path.join(SOURCE, slug, 'article.md');
  if (!fs.existsSync(file)) fail(`${slug}: missing article.md`);
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const split = raw.indexOf('\n---\n');
  if (split < 0) fail(`${slug}: put a line with only --- between the details and the article text`);
  const meta = {};
  for (const line of raw.slice(0, split).split('\n')) {
    if (!line.trim()) continue;
    const at = line.indexOf(':');
    if (at < 0) fail(`${slug}: detail line needs "name: value": ${line}`);
    meta[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
  }
  for (const key of REQUIRED) if (!meta[key]) fail(`${slug}: missing "${key}:"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date))) fail(`${slug}: date must be YYYY-MM-DD`);
  if (meta.summary.length > 170) console.warn(`WARN: ${slug}: summary is ${meta.summary.length} characters; Google shows about 160`);
  const imageFile = path.join(SOURCE, slug, meta.image);
  if (!fs.existsSync(imageFile)) fail(`${slug}: image "${meta.image}" not found in news-source/${slug}/`);
  const blocks = raw.slice(split + 5).trim().split(/\n\s*\n/).map((block) => block.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  if (!blocks.length) fail(`${slug}: article text is empty`);
  return { slug, ...meta, imageFile, blocks, page: `news-${slug}` };
};

const slugs = fs.existsSync(SOURCE)
  ? fs.readdirSync(SOURCE, { withFileTypes: true }).filter((d) => d.isDirectory() && !/^[_.]/.test(d.name)).map((d) => d.name)
  : [];
for (const slug of slugs) if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(`folder "${slug}" must use lowercase letters, numbers, and dashes`);
const articles = slugs.map(parseArticle)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

// ---- Images -----------------------------------------------------------------

const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  if (result.status !== 0) fail(`${cmd} failed: ${(result.stderr || result.error || '').toString().trim().split('\n').pop()}`);
  return result.stdout;
};
const size = (file) => run('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file])
  .trim().split(',').map(Number);
const encode = (src, out, width, isAvif) => run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', `scale='min(${width},iw)':-2:flags=lanczos`,
  ...(isAvif ? ['-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '30', '-cpu-used', '4', '-pix_fmt', 'yuv420p'] : ['-c:v', 'libwebp', '-quality', '80', '-compression_level', '6']), out]);

fs.mkdirSync(ASSETS, { recursive: true });
for (const a of articles) {
  const srcTime = fs.statSync(a.imageFile).mtimeMs;
  for (const [suffix, width] of [['', 1600], ['-768', 768]]) {
    for (const ext of ['avif', 'webp']) {
      const out = path.join(ASSETS, `${a.slug}${suffix}.${ext}`);
      if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < srcTime) encode(a.imageFile, out, width, ext === 'avif');
    }
  }
  [a.width, a.height] = size(path.join(ASSETS, `${a.slug}.webp`));
  [a.cardWidth, a.cardHeight] = size(path.join(ASSETS, `${a.slug}-768.webp`));
  a.alt = a.image_alt || a.title;
}

// ---- Shared page parts --------------------------------------------------------

const shell = fs.readFileSync(path.join(ROOT, SHELL), 'utf8');
const header = (shell.match(/<header class="site-header">[\s\S]*?<\/header>/) || fail(`no header in ${SHELL}`))[0]
  .replace(/ aria-current="page"/g, '')
  .replace(/<a href="news">News<\/a>/g, '<a href="news" aria-current="page">News</a>');
const footer = (shell.match(/<footer class="site-footer"[\s\S]*?<\/footer>/) || fail(`no footer in ${SHELL}`))[0]
  .replace(/ aria-current="page"/g, '');
const version = (shell.match(/styles\.css\?v=([0-9a-z]+)/) || fail(`no styles.css version in ${SHELL}`))[1];
if (!header.includes('href="news" aria-current="page"')) fail(`the header in ${SHELL} has no News link`);

const organization = {
  '@type': 'Organization', '@id': `${SITE}#organization`, name: 'American Buying Service', url: SITE,
  logo: { '@type': 'ImageObject', url: `${SITE}american-buying-service-logo-optimized.webp` },
  email: 'info@americanbuyingservice.com',
  address: { '@type': 'PostalAddress', streetAddress: '355 SOUTH GRAND AVE., SUITE 2450, PMB 619', addressLocality: 'LOS ANGELES', addressRegion: 'CA', postalCode: '90071', addressCountry: 'US' },
};
const website = { '@type': 'WebSite', '@id': `${SITE}#website`, url: SITE, name: 'American Buying Service', publisher: { '@id': `${SITE}#organization` } };

const page = ({ title, description, keywords, url, ogType, image, imageAlt, imageWidth, imageHeight, extraMeta = '', graph, bodyClass, main }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(description)}">${keywords ? `\n  <meta name="keywords" content="${esc(keywords)}">` : ''}
  <title>${esc(title)}</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="styles.css?v=${version}">
  <script src="script.js?v=${version}" defer></script>
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="American Buying Service">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="${ogType}">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta property="og:image:width" content="${imageWidth}">
<meta property="og:image:height" content="${imageHeight}">${extraMeta}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${esc(imageAlt)}">
<script type="application/ld+json">
${jsonText({ '@context': 'https://schema.org', '@graph': graph })}
</script></head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${header}
${main}
  ${footer}
</body>
</html>
`;

const picture = (a, suffix, width, height, attrs) => `<picture><source type="image/avif" srcset="assets/news/${a.slug}${suffix}.avif"><img src="assets/news/${a.slug}${suffix}.webp" width="${width}" height="${height}" alt="${esc(a.alt)}" ${attrs}></picture>`;
const meta = (a) => `<span class="news-author">${esc(a.author)}</span><time datetime="${a.date}">${longDate(a.date)}</time>`;
const breadcrumb = (items) => ({
  '@type': 'BreadcrumbList', '@id': `${items[items.length - 1][1]}#breadcrumb`,
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

// ---- Article pages ------------------------------------------------------------

for (const a of articles) {
  const url = `${SITE}${a.page}`;
  const image = `${SITE}assets/news/${a.slug}.webp`;
  const title = `${a.title} | American Buying Service`;
  const body = a.blocks.map((block) => (block.startsWith('## ') ? `<h2>${esc(block.slice(3))}</h2>` : `<p>${esc(block)}</p>`)).join('\n        ');
  fs.writeFileSync(path.join(ROOT, `${a.page}.html`), page({
    title, description: a.summary, keywords: a.keywords, url, ogType: 'article', image, imageAlt: a.alt, imageWidth: a.width, imageHeight: a.height,
    extraMeta: `\n<meta property="article:published_time" content="${a.date}">\n<meta property="article:section" content="${esc(a.category)}">`,
    bodyClass: 'news-page news-article-page',
    graph: [organization, website,
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description: a.summary, isPartOf: { '@id': `${SITE}#website` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
      { '@type': 'NewsArticle', '@id': `${url}#article`, headline: a.title, description: a.summary, datePublished: a.date, dateModified: a.date,
        articleSection: a.category, image: [image], author: { '@type': 'Organization', name: a.author },
        publisher: { '@id': `${SITE}#organization` }, mainEntityOfPage: { '@id': `${url}#webpage` }, inLanguage: 'en' },
      breadcrumb([['Home', SITE], ['News', `${SITE}news`], [a.title, url]])],
    main: `  <main id="main" class="news-main">
    <article class="news-article">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index">Home</a><span aria-hidden="true">→</span><a href="news">News</a><span aria-hidden="true">→</span>${esc(a.category)}</nav>
      <p class="news-category">${esc(a.category)}</p>
      <h1>${esc(a.title)}</h1>
      <p class="news-article-summary">${esc(a.summary)}</p>
      <p class="news-meta">${meta(a)}</p>
      <figure class="news-article-media">${picture(a, '', a.width, a.height, 'fetchpriority="high" decoding="async"')}</figure>
      <div class="news-article-body">
        ${body}
      </div>
      <a class="news-back" href="news"><span aria-hidden="true">←</span> Back to all news</a>
    </article>
  </main>`,
  }));
}

// ---- News page ----------------------------------------------------------------

const newsUrl = `${SITE}news`;
const newsDescription = 'Read the latest news, updates, and announcements from American Buying Service.';
const cards = articles.map((a) => `        <article class="news-card">
          <a class="news-card-link" href="${a.page}">
            <div class="news-card-media">${picture(a, '-768', a.cardWidth, a.cardHeight, 'loading="lazy" decoding="async"')}</div>
            <div class="news-card-body">
              <p class="news-category">${esc(a.category)}</p>
              <h2>${esc(a.title)}</h2>
              <p class="news-card-summary">${esc(a.summary)}</p>
              <p class="news-meta">${meta(a)}<span class="news-card-arrow" aria-hidden="true">→</span></p>
            </div>
          </a>
        </article>`).join('\n');
fs.writeFileSync(path.join(ROOT, 'news.html'), page({
  title: 'News | American Buying Service', description: newsDescription, url: newsUrl, ogType: 'website',
  image: articles.length ? `${SITE}assets/news/${articles[0].slug}.webp` : `${SITE}abs-container-solutions.webp`,
  imageAlt: articles.length ? articles[0].alt : 'American Buying Service U.S. market support',
  imageWidth: articles.length ? articles[0].width : 1672, imageHeight: articles.length ? articles[0].height : 941,
  bodyClass: 'news-page',
  graph: [organization, website,
    { '@type': 'CollectionPage', '@id': `${newsUrl}#webpage`, url: newsUrl, name: 'News | American Buying Service', description: newsDescription,
      isPartOf: { '@id': `${SITE}#website` }, breadcrumb: { '@id': `${newsUrl}#breadcrumb` },
      ...(articles.length ? { mainEntity: { '@type': 'ItemList', itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}${a.page}` })) } } : {}) },
    breadcrumb([['Home', SITE], ['News', newsUrl]])],
  main: `  <main id="main" class="news-main">
    <section class="news-hero" aria-labelledby="news-title">
      <h1 id="news-title">News and Media</h1>
      <p>Explore the latest news, updates, and developments from American Buying Service.</p>
    </section>
${articles.length ? `    <div class="news-grid">\n${cards}\n    </div>` : `    <p class="news-empty">News is coming soon. Please check back for the latest updates.</p>`}
  </main>`,
}));

// ---- Sitemap ------------------------------------------------------------------

const sitemapFile = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const eol = sitemap.includes('\r\n') ? '\r\n' : '\n';
const block = ['  <!-- news:start -->', `  <url><loc>${newsUrl}</loc>${articles.length ? `<lastmod>${articles[0].date}</lastmod>` : ''}</url>`,
  ...articles.map((a) => `  <url><loc>${SITE}${a.page}</loc><lastmod>${a.date}</lastmod></url>`), '  <!-- news:end -->'].join(eol);
sitemap = /  <!-- news:start -->[\s\S]*?<!-- news:end -->/.test(sitemap)
  ? sitemap.replace(/  <!-- news:start -->[\s\S]*?<!-- news:end -->/, block)
  : sitemap.replace('</urlset>', `${block}${eol}</urlset>`);
fs.writeFileSync(sitemapFile, sitemap);

// ---- Report -------------------------------------------------------------------

const built = new Set(articles.map((a) => `${a.page}.html`));
const stale = fs.readdirSync(ROOT).filter((f) => /^news-.+\.html$/.test(f) && !built.has(f));
console.log(`News page built with ${articles.length} article(s), newest first:`);
for (const a of articles) console.log(`  ${a.date}  ${a.page}.html  ${a.title}`);
if (stale.length) console.log(`Not in news-source any more (remove only after the owner agrees): ${stale.join(', ')}`);
