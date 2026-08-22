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
      projects: 'Work',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      rights: 'All rights reserved.',
      note: 'Content, communication and digital experiences.',
    },
    home: {
      eyebrow: 'Content · Communication · UX thinking',
      title: 'Clear ideas, thoughtfully communicated.',
      introduction:
        'I’m Abilene Caride, a content and communications professional with a background in UX writing, marketing and business operations.',
      foundationTitle: 'I think beyond the words',
      foundationText:
        'I look at what needs to be communicated, who needs it, why it matters and how the whole experience fits together.',
      projectsLink: 'Explore selected work',
      aboutLink: 'More about me',
      contactLink: 'Start a conversation',
      selectedEyebrow: 'Selected work',
      selectedTitle: 'A few things I’ve made, shaped or thought through.',
      selectedIntroduction: 'Personal projects and UX writing explorations that show how I approach content, context and digital experiences.',
      allProjectsLink: 'See all work',
      personalEyebrow: 'Away from the screen',
      personalTitle: 'Curious by nature, practical by experience.',
      personalText: 'I’m a Galician living in Barcelona, happiest when work leaves room for people, good questions and a little humour.',
    },
    about: {
      title: 'About',
      description: 'A little about Abilene Caride, her path into communication and the perspective she brings to her work.',
      eyebrow: 'A Galician in Barcelona',
      heading: 'Words were the beginning. Curiosity made the job much broader.',
      introduction:
        'I came to Barcelona for three months and, more than ten years later, I’m still here—somewhere between small-town calm and big-city momentum.',
      story:
        'I started out in administration, then found my way back to the stories, plays and poems I wrote as a child. A degree in Communication and a postgraduate course in UX Writing brought words, business awareness and digital experience together.',
      perspective:
        'Today I work across content, digital communication, B2B marketing and UX. My administrative background still helps: it makes me organised, practical and aware that communication has to work for the people reading it and for the organisation behind it.',
      contactLink: 'Get in touch',
      valuesTitle: 'What matters to me',
      valuesText: 'Honesty, empathy and respect—for people and for the environment—shape how I work and the choices I make.',
      experienceTitle: 'Experience',
      educationTitle: 'Education',
      languagesTitle: 'Languages',
      toolsTitle: 'Selected tools',
    },
    contact: {
      title: 'Contact',
      description: 'Contact Abilene Caride about content, communication, marketing and UX work.',
      eyebrow: 'Let’s talk',
      heading: 'A coffee, even if it’s over video?',
      introduction:
        'If you’d like to talk about a role, a project or how I could contribute to your team, email is the simplest place to start.',
      emailLabel: 'Email me',
      linkedinLabel: 'Find me on LinkedIn',
      location: 'Barcelona, Spain',
    },
    projects: {
      title: 'Work',
      description: 'Personal projects and UX writing explorations, selected for the thinking behind them.',
      empty: 'Projects will be added here soon.',
      year: 'Year',
      readProject: 'Read project',
      selectedEyebrow: 'Selected work',
      selectedTitle: 'Projects with a little more story behind them.',
      moreEyebrow: 'More work',
      moreTitle: 'Shorter exercises in UX writing and content design.',
    },
    project: {
      back: 'Back to work',
      visit: 'View the original work',
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
      projects: 'Trabajo',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      note: 'Contenido, comunicación y experiencias digitales.',
    },
    home: {
      eyebrow: 'Contenido · Comunicación · Criterio UX',
      title: 'Ideas claras, comunicadas con intención.',
      introduction:
        'Soy Abilene Caride, profesional de contenido y comunicación con experiencia en UX writing, marketing y gestión empresarial.',
      foundationTitle: 'Pienso más allá de las palabras',
      foundationText:
        'Me fijo en qué hay que comunicar, a quién, por qué importa y cómo encaja todo dentro de la experiencia.',
      projectsLink: 'Explorar trabajos seleccionados',
      aboutLink: 'Conóceme un poco más',
      contactLink: 'Empezar una conversación',
      selectedEyebrow: 'Trabajo seleccionado',
      selectedTitle: 'Algunas cosas que he creado, desarrollado o pensado a fondo.',
      selectedIntroduction: 'Proyectos personales y exploraciones de UX writing que muestran cómo abordo el contenido, el contexto y las experiencias digitales.',
      allProjectsLink: 'Ver todo el trabajo',
      personalEyebrow: 'Lejos de la pantalla',
      personalTitle: 'Curiosa por naturaleza, práctica por experiencia.',
      personalText: 'Soy una gallega en Barcelona, más feliz cuando el trabajo deja espacio para las personas, las buenas preguntas y un poco de humor.',
    },
    about: {
      title: 'Sobre mí',
      description: 'Un poco sobre Abilene Caride, su camino hacia la comunicación y la perspectiva que aporta a su trabajo.',
      eyebrow: 'Una gallega en Barcelona',
      heading: 'Las palabras fueron el principio. La curiosidad hizo el trabajo mucho más amplio.',
      introduction:
        'Llegué a Barcelona para quedarme tres meses y, más de diez años después, aquí sigo: entre la calma del pueblo y el ritmo de la ciudad.',
      story:
        'Empecé en administración y después volví a las historias, obras de teatro y poemas que escribía de pequeña. El grado en Comunicación y el postgrado en UX Writing unieron las palabras, la visión de negocio y la experiencia digital.',
      perspective:
        'Hoy trabajo entre contenido, comunicación digital, marketing B2B y UX. Mi pasado administrativo todavía suma: me hace organizada, práctica y consciente de que la comunicación debe funcionar para quien la recibe y para la organización que hay detrás.',
      contactLink: 'Hablemos',
      valuesTitle: 'Lo que me importa',
      valuesText: 'La honestidad, la empatía y el respeto —por las personas y por el medioambiente— guían mi forma de trabajar y las decisiones que tomo.',
      experienceTitle: 'Experiencia',
      educationTitle: 'Formación',
      languagesTitle: 'Idiomas',
      toolsTitle: 'Herramientas seleccionadas',
    },
    contact: {
      title: 'Contacto',
      description: 'Contacta con Abilene Caride para hablar de contenido, comunicación, marketing y UX.',
      eyebrow: 'Hablemos',
      heading: '¿Un café, aunque sea por videollamada?',
      introduction:
        'Si quieres hablar sobre un puesto, un proyecto o cómo podría aportar a tu equipo, el correo es el lugar más sencillo para empezar.',
      emailLabel: 'Escríbeme',
      linkedinLabel: 'Encuéntrame en LinkedIn',
      location: 'Barcelona, España',
    },
    projects: {
      title: 'Trabajo',
      description: 'Proyectos personales y exploraciones de UX writing, seleccionados por el pensamiento que hay detrás.',
      empty: 'Pronto se añadirán proyectos aquí.',
      year: 'Año',
      readProject: 'Ver proyecto',
      selectedEyebrow: 'Trabajo seleccionado',
      selectedTitle: 'Proyectos con un poco más de historia detrás.',
      moreEyebrow: 'Más trabajo',
      moreTitle: 'Ejercicios breves de UX writing y diseño de contenido.',
    },
    project: {
      back: 'Volver al trabajo',
      visit: 'Ver el trabajo original',
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
