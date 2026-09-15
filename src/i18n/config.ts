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
    socialImageAlt: 'Abilene Caride smiling in a warm, plant-filled interior',
    skipToContent: 'Skip to content',
    primaryNavigation: 'Primary navigation',
    languageNavigation: 'Language selection',
    mobileNavigation: {
      open: 'Open navigation',
      close: 'Close navigation',
    },
    theme: {
      light: 'Light theme. Switch to dark theme.',
      dark: 'Dark theme. Switch to light theme.',
    },
    nav: {
      home: 'Home',
      projects: 'Work',
      writing: 'Writing',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      rights: 'All rights reserved.',
      eyebrow: "Let's talk",
      heading: 'Have a role, project or idea worth talking about?',
      profession: 'Content · Communications · Marketing · Business',
      privacyLabel: 'Privacy',
      privacy: 'Privacy & cookies',
      cookieSettings: 'Cookie settings',
      languageLabel: 'Language',
      buildLabel: 'How it’s made',
      buildNote: 'Made with 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.',
      buildDetails: 'Made with Figma, Astro, Pages CMS and Codex. See how this website is made.',
    },
    consent: {
      title: 'Analytics',
      description: 'We use Google Analytics to understand how this website is used and improve it.',
      accept: 'Accept',
      reject: 'Reject',
      details: 'Privacy details',
      currentAccepted: 'Current choice: analytics accepted.',
      currentRejected: 'Current choice: analytics rejected.',
    },
    notFound: {
      title: 'Page not found',
      description: 'The requested page could not be found. Continue to the English or Spanish website.',
      eyebrow: 'Error 404',
      heading: 'This page seems to have wandered off.',
      text: 'The address may be incorrect, or the page may have moved. You can continue from the English homepage.',
      action: 'Continue in English',
    },
    privacy: {
      title: 'Privacy & cookies',
      description: 'How this website handles analytics, consent and locally stored preferences.',
      eyebrow: 'Your choice comes first',
      heading: 'Optional analytics, off until you say yes.',
      introduction:
        'This website uses Google Analytics 4 only when you explicitly accept analytics. Rejecting it does not affect the website.',
      analyticsTitle: 'Google Analytics',
      analyticsText:
        'If you accept, the Google tag loads and sends standard page-view information and any standard enhanced measurements enabled for this GA4 data stream. This may include the page visited, referrer, browser and device information, and approximate location derived from the IP address. This website defines no custom events and sends no user IDs.',
      consentTitle: 'Consent settings',
      consentText:
        'Before consent—and after rejection—the Google tag is not downloaded, Google Analytics cookies are not created, and this website sends no analytics requests to Google. Analytics storage is granted only after acceptance. Advertising storage, advertising user data and advertising personalization are always denied.',
      storageTitle: 'What is stored locally',
      storageText:
        'Your analytics choice is saved in your browser’s local storage for up to 180 days so the question does not appear on every page. This preference is functional local data, not analytics data. If analytics is accepted, Google Analytics may set cookies such as _ga and _ga_<container-id>.',
      changeTitle: 'Changing your choice',
      changeText:
        'Use “Cookie settings” in the footer at any time. Withdrawing consent clears accessible Google Analytics cookies and reloads the page without the Google tag.',
      contactFormTitle: 'Optional contact form',
      contactFormText:
        'The contact form is optional. When you submit it, your name, email address and message are transmitted to Formspree so Abilene can respond to your enquiry. This submission is separate from optional analytics consent. You can contact Abilene directly by email instead.',
      formspreePrivacy: 'Read Formspree’s privacy policy',
      providerTitle: 'Provider and contact',
      providerText:
        'Google processes analytics data under its own terms and privacy documentation. Questions about this website’s privacy choices can be sent to',
      googlePrivacy: 'Read Google’s privacy policy',
    },
    home: {
      title: 'Content, communications & marketing specialist',
      heroHeading: 'I turn complex information and business needs into clear and persuasive content.',
      heroSupporting: 'I don’t write for the sake of sounding good. I use research, audience insight and performance data to decide what to say and how to say it.',
      heroAlt: 'Abilene Caride smiling in a warm, plant-filled interior',
      projectsLink: 'View my work',
      contactLink: 'Get in touch',
      leadEyebrow: 'Lead professional work',
      leadTitle: 'Making specialist B2B communication clearer',
      leadSummary:
        'Product content, editorial email improvements and event communication for a specialist audiovisual audience.',
      capabilitiesEyebrow: 'My work',
      capabilitiesTitle: 'Content, communications and UX thinking',
      capabilities: [
        {
          title: 'Content strategy',
          text: 'I structure complex information, set priorities and shape messages for web, email and product content.',
        },
        {
          title: 'Communications',
          text: 'Campaigns and events often involve several channels at once. I adapt the message to each one without losing the main idea.',
        },
        {
          title: 'UX thinking',
          text: 'When content asks someone to do something, I look at what they need to know first and where unnecessary friction gets in the way.',
        },
      ],
      allProjectsLink: 'See all work',
      aboutEyebrow: 'A little about me',
      aboutTitle: 'My route into content wasn’t a straight line.',
      aboutText:
        'I’m Galician and based in Barcelona. I started in administration, moved into communications and digital marketing, and later trained in UX writing. That mix is why I tend to look at content from both the business side and the person reading it.',
      aboutLink: 'More about me',
    },
    about: {
      title: 'About',
      description: 'About Abilene Caride, her path into communication and the clear, honest and practical way she works.',
      eyebrow: 'About',
      heading: 'My background is in communication, marketing and content, with UX shaping how I approach the work.',
      introduction:
        'I like taking information that feels technical, scattered or difficult to follow and making it easier to understand.',
      story:
        'That can mean structuring a product page, writing a campaign or working through a user flow. The format changes, but I usually start by asking who needs the information, what they need to know and what should happen next.',
      heroAlt: 'Abilene Caride standing in a red top and grey skirt against a softly blurred organic background',
      pathEyebrow: 'How I got here',
      pathTitle: 'From administration to communication, content and UX.',
      pathText: 'I started in administration and ecommerce, where writing was one part of the job. Over time, it became the part I wanted to understand better. I studied Communication, moved into content and marketing roles, and later trained in UX Writing.',
      path: [
        { title: 'Administration', detail: 'Operations and business', icon: 'administration' },
        { title: 'Communication', detail: 'Content, campaigns and media', icon: 'communication' },
        { title: 'UX Writing', detail: 'Product content and microcopy', icon: 'writing' },
        { title: 'Today', detail: 'Content · Communications · Marketing · UX thinking', icon: 'compass' },
      ],
      principlesEyebrow: 'How I work',
      principlesTitle: 'Clear. Honest. Practical.',
      principles: [
        { title: 'Clear', text: 'If the reader has to work too hard to understand it, the content isn’t finished.', icon: 'clear' },
        { title: 'Honest', text: 'I prefer straightforward language to copy that tries too hard to sound impressive.', icon: 'honest' },
        { title: 'Practical', text: 'Content has to work for the person reading it and for the team or business behind it.', icon: 'practical' },
      ],
      experienceTitle: 'Experience',
      experienceIntro: 'Experience across operations, ecommerce, content, communications and marketing.',
      cvLabel: 'Download CV ↓',
      cvNote: '',
      educationTitle: 'Education',
      educationIntro: 'Communication, UX Writing and business.',
      personalEyebrow: 'A little more about me',
      personalTitle: 'Where the work comes from.',
      personal: [
        { title: 'Galicia', text: 'Galicia taught me hard work—and gave me wings to see the world.', icon: 'compass' },
        { title: 'Sustainability', text: 'Sustainability is one of the pivots of my life.', icon: 'leaf' },
        { title: 'Personality', text: 'I’m down-to-earth, but my mind rarely stops.', icon: 'spark' },
        { title: 'Location', text: 'Based in Barcelona. Galician at heart.', icon: 'home' },
      ],
      languagesTitle: 'Languages',
      languagesIntro: 'Different ways of listening.',
    },
    contact: {
      title: 'Contact',
      description: 'Contact Abilene Caride about content, communication, marketing and UX work.',
      eyebrow: 'Let’s talk',
      heading: 'Have a project, a role or an idea worth talking about?',
      introduction: 'Here are the simplest ways to get in touch.',
      detailsEyebrow: 'Contact details',
      detailsTitle: 'Choose the channel that works best for you.',
      emailLabel: 'Email',
      locationLabel: 'Location',
      location: 'Poblenou (22@), Barcelona, Spain',
      linkedinLabel: 'LinkedIn',
      linkedinAction: 'View Abilene Caride’s profile',
      cvLabel: 'CV',
      cvAction: 'Download CV',
      formEyebrow: 'Contact form',
      formTitle: 'Send a message now.',
      fields: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
      },
      submit: 'Send message →',
      submitting: 'Sending…',
      success: 'Thanks — your message has been sent.',
      error: 'Something went wrong. You can email me directly at abicaride@gmail.com.',
    },
    projects: {
      title: 'Work',
      description: 'Professional communication work alongside selected UX writing and content design projects, with the context and decisions behind each one.',
      empty: 'Projects will be added here soon.',
      year: 'Year',
      readProject: 'Read project',
      selectedEyebrow: 'Selected work',
      selectedTitle: 'Professional work in more depth.',
      moreEyebrow: 'More work',
      moreTitle: 'Shorter exercises in UX writing and content design.',
    },
    writing: {
      title: 'Writing',
      description: 'Ideas, lessons and observations about content, communication and UX.',
      back: 'Back to Writing',
      readArticle: 'Read article',
      empty: 'New writing will appear here soon.',
      relatedWork: 'Related work',
      updated: 'Updated',
      tagsLabel: 'Topics',
    },
    backToTop: 'Back to top',
    project: {
      back: 'Back to work',
      visit: 'View the original work',
      metadata: {
        company: 'Company',
        client: 'Client',
        role: 'Role',
        period: 'Period',
      },
      metricsTitle: 'Key metrics',
      galleryTitle: 'Project gallery',
    },
  },
  es: {
    siteName: 'Abilene Caride',
    siteDescription: 'La web personal bilingüe de Abilene Caride.',
    socialImageAlt: 'Abilene Caride sonriendo en un interior cálido lleno de plantas',
    skipToContent: 'Saltar al contenido',
    primaryNavigation: 'Navegación principal',
    languageNavigation: 'Selección de idioma',
    mobileNavigation: {
      open: 'Abrir navegación',
      close: 'Cerrar navegación',
    },
    theme: {
      light: 'Tema claro. Cambiar al tema oscuro.',
      dark: 'Tema oscuro. Cambiar al tema claro.',
    },
    nav: {
      home: 'Inicio',
      projects: 'Trabajo',
      writing: 'Notas',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      eyebrow: 'Hablemos',
      heading: '¿Tienes una oportunidad profesional, un proyecto o una idea de la que merezca la pena hablar?',
      profession: 'Contenido · Comunicación · Marketing · Negocio',
      privacyLabel: 'Privacidad',
      privacy: 'Privacidad y cookies',
      cookieSettings: 'Configurar cookies',
      languageLabel: 'Idioma',
      buildLabel: 'Cómo está hecha',
      buildNote: 'Hecha con 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex y mucho ❤️.',
      buildDetails: 'Hecha con Figma, Astro, Pages CMS y Codex. Descubre cómo está hecha esta web.',
    },
    consent: {
      title: 'Analítica',
      description: 'Usamos Google Analytics para entender cómo se utiliza esta web y mejorarla.',
      accept: 'Aceptar',
      reject: 'Rechazar',
      details: 'Información de privacidad',
      currentAccepted: 'Elección actual: analítica aceptada.',
      currentRejected: 'Elección actual: analítica rechazada.',
    },
    notFound: {
      title: 'Página no encontrada',
      description: 'No hemos encontrado la página solicitada. Continúa en la versión inglesa o española de la web.',
      eyebrow: 'Error 404',
      heading: 'Parece que esta página se ha perdido.',
      text: 'Puede que la dirección no sea correcta o que la página se haya movido. Puedes continuar desde la página de inicio en español.',
      action: 'Continuar en español',
    },
    privacy: {
      title: 'Privacidad y cookies',
      description: 'Cómo gestiona esta web la analítica, el consentimiento y las preferencias guardadas localmente.',
      eyebrow: 'Tu elección va primero',
      heading: 'Analítica opcional, desactivada hasta que tú digas que sí.',
      introduction:
        'Esta web utiliza Google Analytics 4 únicamente cuando aceptas expresamente la analítica. Rechazarla no afecta al funcionamiento de la web.',
      analyticsTitle: 'Google Analytics',
      analyticsText:
        'Si aceptas, la etiqueta de Google se carga y envía a Google Analytics información estándar sobre las páginas vistas y las mediciones mejoradas estándar que estén activadas para este flujo de datos de GA4. Puede incluir la página visitada, la procedencia, información del navegador y del dispositivo, y una ubicación aproximada derivada de la dirección IP. Esta web no define eventos personalizados ni envía identificadores de usuario.',
      consentTitle: 'Configuración del consentimiento',
      consentText:
        'Antes del consentimiento —y después de rechazarlo— no se descarga la etiqueta de Google, no se crean cookies de Google Analytics y esta web no envía solicitudes de analítica a Google. El almacenamiento de analítica solo se concede después de aceptar. El almacenamiento publicitario, los datos de usuario para publicidad y la personalización publicitaria están siempre denegados.',
      storageTitle: 'Qué se guarda localmente',
      storageText:
        'Tu elección sobre analítica se guarda en el almacenamiento local del navegador durante un máximo de 180 días para no preguntarte en cada página. Esta preferencia es un dato local funcional, no un dato analítico. Si aceptas la analítica, Google Analytics puede crear cookies como _ga y _ga_<identificador-del-contenedor>.',
      changeTitle: 'Cambiar tu elección',
      changeText:
        'Puedes usar “Configurar cookies” en el pie de página en cualquier momento. Al retirar el consentimiento se eliminan las cookies accesibles de Google Analytics y la página se vuelve a cargar sin la etiqueta de Google.',
      contactFormTitle: 'Formulario de contacto opcional',
      contactFormText:
        'El formulario de contacto es opcional. Al enviarlo, tu nombre, dirección de correo electrónico y mensaje se transmiten a Formspree para que Abilene pueda responder a tu consulta. Este envío es independiente del consentimiento opcional de analítica. También puedes contactar directamente con Abilene por correo electrónico.',
      formspreePrivacy: 'Leer la política de privacidad de Formspree',
      providerTitle: 'Proveedor y contacto',
      providerText:
        'Google trata los datos de analítica de acuerdo con sus propias condiciones y documentación de privacidad. Puedes enviar preguntas sobre las decisiones de privacidad de esta web a',
      googlePrivacy: 'Leer la política de privacidad de Google',
    },
    home: {
      title: 'Especialista en contenidos, comunicación y marketing',
      heroHeading: 'Convierto información compleja y necesidades de negocio en contenidos claros y persuasivos.',
      heroSupporting: 'No escribo solo para que algo suene bien. Utilizo investigación, conocimiento de la audiencia y datos de rendimiento para decidir qué decir y cómo decirlo.',
      heroAlt: 'Abilene Caride sonriendo en un interior cálido lleno de plantas',
      projectsLink: 'Ver mi trabajo',
      contactLink: 'Hablemos',
      leadEyebrow: 'Trabajo profesional destacado',
      leadTitle: 'Hacer más clara la comunicación B2B especializada',
      leadSummary:
        'Contenido de producto, mejoras editoriales en email y comunicación de eventos para una audiencia audiovisual especializada.',
      capabilitiesEyebrow: 'Mi trabajo',
      capabilitiesTitle: 'Contenido, comunicación y enfoque UX',
      capabilities: [
        {
          title: 'Estrategia de contenidos',
          text: 'Estructuro información compleja, establezco prioridades y trabajo los mensajes para web, email y contenido de producto.',
        },
        {
          title: 'Comunicación',
          text: 'Las campañas y los eventos suelen necesitar varios canales a la vez. Adapto el mensaje a cada uno sin perder la idea principal.',
        },
        {
          title: 'Enfoque UX',
          text: 'Cuando un contenido pide a alguien que haga algo, pienso primero qué necesita saber y qué fricciones pueden dificultar el siguiente paso.',
        },
      ],
      allProjectsLink: 'Ver todo el trabajo',
      aboutEyebrow: 'Un poco sobre mí',
      aboutTitle: 'Mi camino hacia los contenidos no fue una línea recta.',
      aboutText:
        'Soy gallega y vivo en Barcelona. Empecé en administración, pasé a comunicación y marketing digital y más tarde me formé en UX writing. Esa mezcla hace que mire el contenido desde dos lados: el negocio y la persona que lo recibe.',
      aboutLink: 'Conóceme un poco más',
    },
    about: {
      title: 'Sobre mí',
      description: 'Sobre Abilene Caride, su camino hacia la comunicación y su forma clara, honesta y práctica de trabajar.',
      eyebrow: 'Sobre mí',
      heading: 'Mi experiencia cruza comunicación, marketing y contenidos, con el UX influyendo en cómo abordo el trabajo.',
      introduction:
        'Me gusta coger información técnica, dispersa o difícil de seguir y hacer que se entienda mejor.',
      story:
        'A veces eso significa estructurar una página de producto, otras escribir una campaña o pensar un flujo. Cambia el formato, pero suelo empezar por las mismas preguntas: quién necesita esta información, qué necesita saber y qué debería ocurrir después.',
      heroAlt: 'Abilene Caride de pie con camiseta roja y falda gris ante un fondo orgánico desenfocado',
      pathEyebrow: 'Cómo llegué hasta aquí',
      pathTitle: 'De la administración a la comunicación, los contenidos y el UX.',
      pathText: 'Empecé en administración y ecommerce, donde escribir era solo una parte del trabajo. Con el tiempo se convirtió en la parte que más quería entender. Estudié Comunicación, pasé a puestos de contenidos y marketing y más tarde me formé en UX Writing.',
      path: [
        { title: 'Administración', detail: 'Operaciones y negocio', icon: 'administration' },
        { title: 'Comunicación', detail: 'Contenidos, campañas y medios', icon: 'communication' },
        { title: 'UX Writing', detail: 'Contenido de producto y microcopy', icon: 'writing' },
        { title: 'Hoy', detail: 'Contenidos · Comunicación · Marketing · Enfoque UX', icon: 'compass' },
      ],
      principlesEyebrow: 'Cómo trabajo',
      principlesTitle: 'Clara. Honesta. Práctica.',
      principles: [
        { title: 'Clara', text: 'Si quien lee tiene que esforzarse demasiado para entenderlo, el contenido todavía no está terminado.', icon: 'clear' },
        { title: 'Honesta', text: 'Prefiero un lenguaje directo a un texto que se esfuerza demasiado por sonar impresionante.', icon: 'honest' },
        { title: 'Práctica', text: 'El contenido tiene que funcionar para quien lo lee y para el equipo o negocio que hay detrás.', icon: 'practical' },
      ],
      experienceTitle: 'Experiencia',
      experienceIntro: 'Experiencia en operaciones, ecommerce, contenidos, comunicación y marketing.',
      cvLabel: 'Descargar CV ↓',
      cvNote: 'CV en español',
      educationTitle: 'Formación',
      educationIntro: 'Comunicación, UX Writing y negocio.',
      personalEyebrow: 'Un poco más sobre mí',
      personalTitle: 'De dónde nace mi forma de trabajar.',
      personal: [
        { title: 'Galicia', text: 'Galicia me enseñó a trabajar duro y me dio alas para ver el mundo.', icon: 'compass' },
        { title: 'Sostenibilidad', text: 'La sostenibilidad es uno de los ejes de mi vida.', icon: 'leaf' },
        { title: 'Personalidad', text: 'Soy sencilla y cercana, pero mi cabeza rara vez se detiene.', icon: 'spark' },
        { title: 'Lugar', text: 'Vivo en Barcelona. Galicia sigue siendo casa.', icon: 'home' },
      ],
      languagesTitle: 'Idiomas',
      languagesIntro: 'Distintas formas de escuchar.',
    },
    contact: {
      title: 'Contacto',
      description: 'Contacta con Abilene Caride para hablar de contenido, comunicación, marketing y UX.',
      eyebrow: 'Hablemos',
      heading: '¿Tienes un proyecto, un puesto o una idea de la que merezca la pena hablar?',
      introduction: 'Estas son las formas más sencillas de contactar conmigo.',
      detailsEyebrow: 'Datos de contacto',
      detailsTitle: 'Elige el canal que te resulte más cómodo.',
      emailLabel: 'Email',
      locationLabel: 'Ubicación',
      location: 'Poblenou (22@), Barcelona',
      linkedinLabel: 'LinkedIn',
      linkedinAction: 'Ver el perfil de Abilene Caride',
      cvLabel: 'CV',
      cvAction: 'Descargar CV',
      cvNote: 'CV en español',
      formEyebrow: 'Formulario de contacto',
      formTitle: 'Envía un mensaje ahora.',
      fields: {
        name: 'Nombre',
        email: 'Email',
        message: 'Mensaje',
      },
      submit: 'Enviar mensaje →',
      submitting: 'Enviando…',
      success: 'Gracias. Tu mensaje se ha enviado correctamente.',
      error: 'Algo ha fallado. Puedes escribirme directamente a abicaride@gmail.com.',
    },
    projects: {
      title: 'Trabajo',
      description: 'Trabajo profesional de comunicación junto a proyectos seleccionados de UX writing y diseño de contenidos, con el contexto y las decisiones detrás de cada uno.',
      empty: 'Pronto se añadirán proyectos aquí.',
      year: 'Año',
      readProject: 'Ver proyecto',
      selectedEyebrow: 'Trabajo seleccionado',
      selectedTitle: 'Trabajo profesional con más profundidad.',
      moreEyebrow: 'Más trabajo',
      moreTitle: 'Ejercicios breves de UX writing y diseño de contenido.',
    },
    writing: {
      title: 'Notas',
      description: 'Ideas, aprendizajes y observaciones sobre contenido, comunicación y UX.',
      back: 'Volver a Notas',
      readArticle: 'Leer nota',
      empty: 'Pronto habrá nuevas notas por aquí.',
      relatedWork: 'Trabajo relacionado',
      updated: 'Actualizado',
      tagsLabel: 'Temas',
    },
    backToTop: 'Volver arriba',
    project: {
      back: 'Volver al trabajo',
      visit: 'Ver el trabajo original',
      metadata: {
        company: 'Empresa',
        client: 'Cliente',
        role: 'Rol',
        period: 'Periodo',
      },
      metricsTitle: 'Métricas clave',
      galleryTitle: 'Galería del proyecto',
    },
  },
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

const cvPaths: Record<Locale, string> = {
  en: '/cv/abilene-caride-cv-en.pdf',
  es: '/cv/abilene-caride-cv-es.pdf',
};

export function getCvPath(locale: Locale): string {
  return cvPaths[locale];
}

export function getLocalizedPath(locale: Locale, path = ''): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  return normalizedPath ? `/${locale}/${normalizedPath}/` : `/${locale}/`;
}

export function getWritingIndexPath(locale: Locale): string {
  return getLocalizedPath(locale, locale === 'en' ? 'writing' : 'notas');
}

export function getWritingArticlePath(locale: Locale, routeSlug: string): string {
  const section = locale === 'en' ? 'writing' : 'notas';
  return getLocalizedPath(locale, `${section}/${routeSlug}`);
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);

  if (isLocale(segments[0])) {
    segments.shift();
  }

  return getLocalizedPath(targetLocale, segments.join('/'));
}
