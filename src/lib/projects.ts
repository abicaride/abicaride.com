import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocalizedPath, type Locale } from '../i18n/config';

export interface ProjectRouteProps {
  project: CollectionEntry<'projects'>;
  alternatePath?: string;
}

export async function getProjectStaticPaths(locale: Locale) {
  const allProjects = await getCollection('projects', ({ data }) => !data.draft);
  const localizedProjects = allProjects.filter((project) => project.data.locale === locale);
  const otherLocale: Locale = locale === 'en' ? 'es' : 'en';

  return localizedProjects.map((project) => {
    const translation = allProjects.find(
      (candidate) =>
        candidate.data.locale === otherLocale &&
        candidate.data.translationKey === project.data.translationKey,
    );

    return {
      params: { slug: project.data.routeSlug },
      props: {
        project,
        alternatePath: translation
          ? getLocalizedPath(otherLocale, `projects/${translation.data.routeSlug}`)
          : getLocalizedPath(otherLocale, 'projects'),
      } satisfies ProjectRouteProps,
    };
  });
}
