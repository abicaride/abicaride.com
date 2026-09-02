import { getCollection, type CollectionEntry } from 'astro:content';
import {
  getLocalizedPath,
  getWritingArticlePath,
  getWritingIndexPath,
  type Locale,
} from '../i18n/config';

export type WritingEntry = CollectionEntry<'writing'>;

export interface WritingRouteProps {
  article: WritingEntry;
  alternatePath: string;
}

const hasWritingSources = Object.keys(
  import.meta.glob('../content/writing/**/*.md'),
).length > 0;

export async function getAllPublishedWriting(): Promise<WritingEntry[]> {
  if (!hasWritingSources) return [];

  return getCollection('writing', ({ data }) => !data.draft);
}

export async function getPublishedWriting(locale: Locale): Promise<WritingEntry[]> {
  const entries = (await getAllPublishedWriting()).filter(
    ({ data }) => data.locale === locale,
  );

  return entries.sort(
    (first, second) => second.data.publishedAt.getTime() - first.data.publishedAt.getTime(),
  );
}

export async function getWritingStaticPaths(locale: Locale) {
  const allArticles = await getAllPublishedWriting();
  const otherLocale: Locale = locale === 'en' ? 'es' : 'en';

  return allArticles
    .filter((article) => article.data.locale === locale)
    .map((article) => {
      const translation = allArticles.find(
        (candidate) =>
          candidate.data.locale === otherLocale &&
          candidate.data.translationKey === article.data.translationKey,
      );

      return {
        params: { slug: article.data.routeSlug },
        props: {
          article,
          alternatePath: translation
            ? getWritingArticlePath(otherLocale, translation.data.routeSlug)
            : getWritingIndexPath(otherLocale),
        } satisfies WritingRouteProps,
      };
    });
}

export async function getRelatedProject(
  locale: Locale,
  translationKey: string | undefined,
): Promise<CollectionEntry<'projects'> | undefined> {
  if (!translationKey) return undefined;

  const projects = await getCollection(
    'projects',
    ({ data }) =>
      data.locale === locale &&
      !data.draft &&
      data.translationKey === translationKey,
  );

  return projects[0];
}

export function formatWritingDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getProjectPathForWriting(
  locale: Locale,
  project: CollectionEntry<'projects'>,
): string {
  return getLocalizedPath(locale, `projects/${project.data.routeSlug}`);
}
