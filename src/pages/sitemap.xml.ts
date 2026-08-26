import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { getLocalizedPath, type Locale } from '../i18n/config';

type LocalizedPaths = Partial<Record<Locale, string>>;

const staticRoutePairs: LocalizedPaths[] = [
  { en: getLocalizedPath('en'), es: getLocalizedPath('es') },
  { en: getLocalizedPath('en', 'projects'), es: getLocalizedPath('es', 'projects') },
  { en: getLocalizedPath('en', 'about'), es: getLocalizedPath('es', 'about') },
  { en: getLocalizedPath('en', 'contact'), es: getLocalizedPath('es', 'contact') },
  { en: getLocalizedPath('en', 'privacy'), es: getLocalizedPath('es', 'privacidad') },
];

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const absoluteUrl = (path: string, site: URL) => escapeXml(new URL(path, site).href);

const renderUrl = (path: string, alternates: LocalizedPaths, site: URL) => {
  const alternateLinks = (['en', 'es'] as const)
    .filter((locale) => alternates[locale])
    .map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${absoluteUrl(alternates[locale]!, site)}" />`);
  const defaultPath = alternates.en ?? path;

  alternateLinks.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(defaultPath, site)}" />`,
  );

  return [
    '  <url>',
    `    <loc>${absoluteUrl(path, site)}</loc>`,
    ...alternateLinks,
    '  </url>',
  ].join('\n');
};

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('The Astro site URL is required to generate the sitemap.');
  }

  const projects = await getCollection('projects', ({ data }) => !data.draft);
  const projectPairs = new Map<string, LocalizedPaths>();

  for (const project of projects) {
    const paths = projectPairs.get(project.data.translationKey) ?? {};
    paths[project.data.locale] = getLocalizedPath(
      project.data.locale,
      `projects/${project.data.routeSlug}`,
    );
    projectPairs.set(project.data.translationKey, paths);
  }

  const routePairs = [
    ...staticRoutePairs,
    ...[...projectPairs.values()].sort((a, b) => (a.en ?? a.es ?? '').localeCompare(b.en ?? b.es ?? '')),
  ];
  const entries = routePairs.flatMap((paths) =>
    (['en', 'es'] as const)
      .filter((locale) => paths[locale])
      .map((locale) => renderUrl(paths[locale]!, paths, site)),
  );
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
