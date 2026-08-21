export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export const ui = {
  en: {
    siteName: 'Abilene Caride',
    siteDescription: 'The bilingual personal website of Abilene Caride.',
    skipToContent: 'Skip to content',
    primaryNavigation: 'Primary navigation',
    languageNavigation: 'Language selection',
    nav: {
      home: 'Home',
      projects: 'Projects',
    },
    footer: {
      rights: 'All rights reserved.',
      note: 'Built as a static, bilingual Astro website.',
    },
    home: {
      eyebrow: 'Personal website',
      title: 'Abilene Caride',
      introduction:
        'A bilingual home for selected projects, notes, and professional work.',
      foundationTitle: 'A foundation for what comes next',
      foundationText:
        'The structure is in place; content and visual direction can now evolve independently.',
      projectsLink: 'View projects',
    },
    projects: {
      title: 'Projects',
      description: 'Selected projects and ongoing work.',
      empty: 'Projects will be added here soon.',
      year: 'Year',
      status: 'Status',
      readProject: 'Read project',
    },
    project: {
      back: 'Back to projects',
      ongoing: 'Ongoing',
      completed: 'Completed',
    },
  },
  es: {
    siteName: 'Abilene Caride',
    siteDescription: 'La web personal bilingüe de Abilene Caride.',
    skipToContent: 'Saltar al contenido',
    primaryNavigation: 'Navegación principal',
    languageNavigation: 'Selección de idioma',
    nav: {
      home: 'Inicio',
      projects: 'Proyectos',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      note: 'Construida como una web Astro estática y bilingüe.',
    },
    home: {
      eyebrow: 'Web personal',
      title: 'Abilene Caride',
      introduction:
        'Un espacio bilingüe para proyectos seleccionados, notas y trabajo profesional.',
      foundationTitle: 'Una base para lo que viene',
      foundationText:
        'La estructura ya está preparada; el contenido y la dirección visual pueden evolucionar de forma independiente.',
      projectsLink: 'Ver proyectos',
    },
    projects: {
      title: 'Proyectos',
      description: 'Una selección de proyectos y trabajos en curso.',
      empty: 'Pronto se añadirán proyectos aquí.',
      year: 'Año',
      status: 'Estado',
      readProject: 'Ver proyecto',
    },
    project: {
      back: 'Volver a proyectos',
      ongoing: 'En curso',
      completed: 'Completado',
    },
  },
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, path = ''): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  return normalizedPath ? `/${locale}/${normalizedPath}/` : `/${locale}/`;
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);

  if (isLocale(segments[0])) {
    segments.shift();
  }

  return getLocalizedPath(targetLocale, segments.join('/'));
}
