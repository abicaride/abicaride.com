import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const distDirectory = path.resolve('dist');
const siteOrigin = 'https://abicaride.com';
const errors = [];
const externalOrigins = new Set();
const canonicalRoutes = new Set();

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  }));

  return files.flat();
};

const routeForHtmlFile = (file) => {
  const relativePath = path.relative(distDirectory, file).replaceAll(path.sep, '/');
  if (relativePath === 'index.html') return '/';
  if (relativePath === '404.html') return '/404.html';
  return `/${relativePath.replace(/index\.html$/, '')}`;
};

const fileForPathname = (pathname) => {
  const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, '');
  if (!decodedPath) return path.join(distDirectory, 'index.html');
  if (decodedPath.endsWith('/')) return path.join(distDirectory, decodedPath, 'index.html');
  if (path.extname(decodedPath)) return path.join(distDirectory, decodedPath);
  return path.join(distDirectory, decodedPath, 'index.html');
};

const localTargetExists = async (url, source) => {
  const targetFile = fileForPathname(url.pathname);
  try {
    return (await stat(targetFile)).isFile();
  } catch {
    errors.push(`${source}: missing local target ${url.pathname}`);
    return false;
  }
};

const inspectReference = async (reference, pageUrl, source) => {
  if (!reference || reference.startsWith('#') || /^(?:mailto|tel|data|javascript):/i.test(reference)) return;
  if (/^\/\/[^/]/.test(reference) || (/\/\//.test(reference) && !/^https?:\/\//i.test(reference))) {
    errors.push(`${source}: malformed URL ${reference}`);
  }

  let url;
  try {
    url = new URL(reference, pageUrl);
  } catch {
    errors.push(`${source}: invalid URL ${reference}`);
    return;
  }

  if (url.origin !== siteOrigin) {
    if (url.protocol === 'http:' || url.protocol === 'https:') externalOrigins.add(url.origin);
    return;
  }

  await localTargetExists(url, source);
};

const matches = (input, expression) => [...input.matchAll(expression)];

let files;
try {
  files = await walk(distDirectory);
} catch {
  console.error('dist/ is missing. Run npm run build before npm run check:site.');
  process.exit(1);
}

const htmlFiles = files.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = routeForHtmlFile(file);
  const pageUrl = new URL(route, siteOrigin);
  const source = path.relative(distDirectory, file).replaceAll(path.sep, '/');
  const isNoIndex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const canonicals = matches(html, /<link\s+rel="canonical"\s+href="([^"]+)"/gi);
  const descriptions = matches(html, /<meta\s+name="description"\s+content="([^"]*)"/gi);
  const h1Count = matches(html, /<h1\b/gi).length;
  const isLocalizedPage = route.startsWith('/en/') || route.startsWith('/es/');

  for (const requiredIconLink of [
    'href="/favicon.svg"',
    'href="/favicon.ico"',
    'href="/apple-touch-icon.png"',
  ]) {
    if (!html.includes(requiredIconLink)) errors.push(`${source}: missing ${requiredIconLink}`);
  }

  if (h1Count !== 1) errors.push(`${source}: expected one h1, found ${h1Count}`);
  if (descriptions.length !== 1) errors.push(`${source}: expected one meta description, found ${descriptions.length}`);
  if (isLocalizedPage) {
    if (!html.includes('class="brand-watermark"')) {
      errors.push(`${source}: missing the shared footer brand-mark watermark`);
    }
    if (!/class="brand-watermark"[\s\S]{0,10000}?aria-hidden="true"/i.test(html)) {
      errors.push(`${source}: footer brand-mark watermark is not decorative`);
    }
    for (const requiredFooterClass of [
      'class="identity-mark"',
      'class="utility-groups"',
      'class="cookie-settings"',
      'class="locale-links"',
      'class="utility-meta"',
    ]) {
      if (!html.includes(requiredFooterClass)) {
        errors.push(`${source}: missing structured footer element ${requiredFooterClass}`);
      }
    }
  }

  if (isNoIndex) {
    if (canonicals.length) errors.push(`${source}: noindex page unexpectedly has a canonical`);
  } else {
    const requiredSocialMetadata = [
      'og:site_name',
      'og:title',
      'og:description',
      'og:url',
      'og:type',
      'og:locale',
      'og:locale:alternate',
      'og:image',
      'og:image:alt',
      'og:image:width',
      'og:image:height',
      'og:image:type',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:image:alt',
    ];

    for (const name of requiredSocialMetadata) {
      const attribute = name.startsWith('og:') ? 'property' : 'name';
      if (!new RegExp(`<meta\\s+${attribute}="${name}"\\s+content="[^"]+"`, 'i').test(html)) {
        errors.push(`${source}: missing ${name} metadata`);
      }
    }

    if (canonicals.length !== 1) {
      errors.push(`${source}: expected one canonical, found ${canonicals.length}`);
    } else {
      const canonical = new URL(canonicals[0][1], pageUrl);
      if (canonical.href !== pageUrl.href) {
        errors.push(`${source}: canonical ${canonical.href} does not match ${pageUrl.href}`);
      }
      canonicalRoutes.add(canonical.pathname);
    }

    const alternates = new Map(
      matches(html, /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)
        .map((match) => [match[1], match[2]]),
    );
    for (const language of ['en', 'es', 'x-default']) {
      if (!alternates.has(language)) errors.push(`${source}: missing ${language} hreflang`);
    }

    const jsonLd = matches(html, /<script\s+type="application\/ld\+json">(.*?)<\/script>/gis);
    if (jsonLd.length !== 1) {
      errors.push(`${source}: expected one JSON-LD block, found ${jsonLd.length}`);
    } else {
      try {
        JSON.parse(jsonLd[0][1]);
      } catch {
        errors.push(`${source}: JSON-LD is not valid JSON`);
      }
    }
  }

  if (/https?:\/\/localhost(?::\d+)?/i.test(html)) {
    errors.push(`${source}: contains a localhost URL`);
  }

  for (const match of matches(html, /<(?:a|link|img|source|script)\b[^>]*?\s(?:href|src)="([^"]+)"/gi)) {
    await inspectReference(match[1], pageUrl, source);
  }
  for (const match of matches(html, /<(?:img|source)\b[^>]*?\ssrcset="([^"]+)"/gi)) {
    for (const candidate of match[1].split(',').map((value) => value.trim().split(/\s+/)[0])) {
      await inspectReference(candidate, pageUrl, source);
    }
  }
  for (const match of matches(html, /<meta\s+(?:property="og:image"|name="twitter:image")\s+content="([^"]+)"/gi)) {
    await inspectReference(match[1], pageUrl, source);
  }
}

const sitemapPath = path.join(distDirectory, 'sitemap.xml');
const sitemap = await readFile(sitemapPath, 'utf8');
const sitemapLocations = new Set(matches(sitemap, /<loc>([^<]+)<\/loc>/g).map((match) => new URL(match[1]).pathname));
for (const route of canonicalRoutes) {
  if (!sitemapLocations.has(route)) errors.push(`sitemap.xml: missing indexable route ${route}`);
}
for (const route of sitemapLocations) {
  if (!canonicalRoutes.has(route)) errors.push(`sitemap.xml: contains non-indexable route ${route}`);
  await localTargetExists(new URL(route, siteOrigin), 'sitemap.xml');
}

const robots = await readFile(path.join(distDirectory, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://abicaride.com/sitemap.xml')) {
  errors.push('robots.txt: canonical sitemap URL is missing');
}

const faviconSvg = await readFile(path.join(distDirectory, 'favicon.svg'), 'utf8');
if (!faviconSvg.includes('#F7F3EA') || !faviconSvg.includes('#103A20')) {
  errors.push('favicon.svg: approved cream and deep-green palette is missing');
}
if (faviconSvg.includes('prefers-color-scheme') || faviconSvg.includes('viewBox="0 0 128 128"')) {
  errors.push('favicon.svg: previous generic Astro favicon remains');
}

for (const asset of ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png']) {
  await localTargetExists(new URL(`/${asset}`, siteOrigin), 'favicon assets');
}

if (errors.length) {
  console.error(`Built-site validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Built-site validation passed: ${htmlFiles.length} HTML files and ${sitemapLocations.size} indexable sitemap URLs.`);
console.log(`External links were reported but not requested: ${[...externalOrigins].sort().join(', ') || 'none'}.`);
