import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { getWritingArticlePath, type Locale } from '../../../i18n/config';

// Sveltia has one preview path per collection, while the public section name
// differs by locale. This route exists only during local development.
export const getStaticPaths = (async () => {
  if (!import.meta.env.DEV) return [];

  const entries = await getCollection('writing');

  return entries.map(({ data }) => ({
    params: { locale: data.locale, slug: data.routeSlug },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params, redirect }) => {
  const { locale, slug } = params;

  if ((locale !== 'en' && locale !== 'es') || !slug) {
    return new Response('Not found', { status: 404 });
  }

  return redirect(getWritingArticlePath(locale as Locale, slug), 302);
};
