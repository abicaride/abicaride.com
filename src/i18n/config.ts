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
    nav: {
      home: 'Home',
      projects: 'Work',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      rights: 'All rights reserved.',
      eyebrow: "Let's talk",
      heading: 'Have a project, an idea, or just want to say hello?',
      profession: 'Content strategy · Communications · Business',
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
      title: 'Content, communications and marketing specialist',
      heroHeading: 'I help companies connect with their audiences through clear, honest communication.',
      heroAlt: 'Abilene Caride smiling in a warm, plant-filled interior',
      projectsLink: 'View my work',
      contactLink: 'Get in touch',
      leadEyebrow: 'Lead professional work',
      leadTitle: 'Making specialist B2B communication clearer',
      leadSummary:
        'Product content, editorial email improvements and event communication for a specialist audiovisual audience.',
      secondaryEyebrow: 'Selected work',
      secondaryTitle: 'More ways of making digital communication useful.',
      allProjectsLink: 'See all work',
      aboutEyebrow: 'A little about me',
      aboutTitle: 'Clear thinking, honest communication and a practical way forward.',
      aboutText:
        'I’m Galician and live in Barcelona. My career began in administration, shifted into communications and digital marketing, and expanded into UX writing and B2B and B2C content. Helping people get what they need is the thread connecting it all.',
      aboutLink: 'More about me',
    },
    about: {
      title: 'About',
      description: 'About Abilene Caride, her path into communication and the clear, honest and practical way she works.',
      eyebrow: 'About',
      heading: 'I help users find the clearest path to what they need in digital products.',
      introduction:
        'Helping is the thread running through my work. I want people to understand what they need, find their way forward and feel that communication is working with them rather than against them.',
      story:
        'Professionally, I do that through words. Whether I’m structuring technical information, writing a campaign or thinking through a user experience, I care about making it useful and getting it right.',
      heroAlt: 'Abilene Caride standing in a red top and grey skirt against a softly blurred organic background',
      pathEyebrow: 'How I got here',
      pathTitle: 'Words became the way I could be more useful.',
      pathText: 'In my first jobs I saw how the right words could change whether someone understood, trusted or acted. That made me want to learn how to reach people better, communicate better and be more useful.',
      path: [
        { title: 'Administration', detail: 'Business foundations', icon: 'administration' },
        { title: 'Communication', detail: 'Reaching people', icon: 'communication' },
        { title: 'UX Writing', detail: 'Removing friction', icon: 'writing' },
        { title: 'Today', detail: 'Content strategy · Communications · Business', icon: 'compass' },
      ],
      principlesEyebrow: 'How I work',
      principlesTitle: 'Clear. Honest. Practical.',
      principles: [
        { title: 'Clear', text: 'I make complex information understandable.', icon: 'clear' },
        { title: 'Honest', text: "Communication doesn't need to sound complicated to be professional.", icon: 'honest' },
        { title: 'Practical', text: 'Good content should help the audience and make sense for the business behind it.', icon: 'practical' },
      ],
      experienceTitle: 'Experience',
      experienceIntro: 'A broad profile, built deliberately.',
      cvLabel: 'Download CV ↓',
      cvNote: '',
      educationTitle: 'Education',
      educationIntro: 'Learning that explains the path.',
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
      description: 'Professional communication work and selected UX writing projects, presented for the thinking behind them.',
      empty: 'Projects will be added here soon.',
      year: 'Year',
      readProject: 'Read project',
      selectedEyebrow: 'Selected work',
      selectedTitle: 'Selected work with a little more story behind it.',
      moreEyebrow: 'More work',
      moreTitle: 'Shorter exercises in UX writing and content design.',
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
    nav: {
      home: 'Inicio',
      projects: 'Trabajo',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      eyebrow: 'Hablemos',
      heading: '¿Tienes un proyecto, una idea o simplemente quieres saludar?',
      profession: 'Estrategia de contenidos · Comunicación · Negocio',
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
      heroHeading: 'Ayudo a empresas a conectar con su público a través de una comunicación clara y honesta.',
      heroAlt: 'Abilene Caride sonriendo en un interior cálido lleno de plantas',
      projectsLink: 'Ver mi trabajo',
      contactLink: 'Hablemos',
      leadEyebrow: 'Trabajo profesional destacado',
      leadTitle: 'Hacer más clara la comunicación B2B especializada',
      leadSummary:
        'Contenido de producto, mejoras editoriales en email y comunicación de eventos para una audiencia audiovisual especializada.',
      secondaryEyebrow: 'Trabajo seleccionado',
      secondaryTitle: 'Más formas de hacer útil la comunicación digital.',
      allProjectsLink: 'Ver todo el trabajo',
      aboutEyebrow: 'Un poco sobre mí',
      aboutTitle: 'Ideas claras, comunicación honesta y una manera práctica de avanzar.',
      aboutText:
        'Soy gallega y vivo en Barcelona. Mi recorrido empieza por la administración, cambia a comunicación y marketing digital, así como el UX writing y el contenido B2B y B2C. Ayudar a las personas a conseguir lo que necesitan es el hilo que une todo.',
      aboutLink: 'Conóceme un poco más',
    },
    about: {
      title: 'Sobre mí',
      description: 'Sobre Abilene Caride, su camino hacia la comunicación y su forma clara, honesta y práctica de trabajar.',
      eyebrow: 'Sobre mí',
      heading: 'Ayudo a los usuarios a encontrar el camino más claro hacia lo que necesitan en productos digitales.',
      introduction:
        'Ayudar es el hilo que recorre mi trabajo. Quiero que las personas entiendan lo que necesitan, encuentren cómo avanzar y sientan que la comunicación trabaja con ellas, no contra ellas.',
      story:
        'Profesionalmente lo hago a través de las palabras. Ya sea estructurando información técnica, escribiendo una campaña o pensando una experiencia de usuario, me importa que sea útil y esté bien resuelta.',
      heroAlt: 'Abilene Caride de pie con camiseta roja y falda gris ante un fondo orgánico desenfocado',
      pathEyebrow: 'Cómo llegué hasta aquí',
      pathTitle: 'Las palabras se convirtieron en mi forma de ser más útil.',
      pathText: 'En mis primeros trabajos vi cómo las palabras adecuadas podían cambiar si alguien entendía, confiaba o actuaba. Quise aprender a llegar mejor a las personas, comunicar mejor y ser más útil.',
      path: [
        { title: 'Administración', detail: 'Base de negocio', icon: 'administration' },
        { title: 'Comunicación', detail: 'Llegar a las personas', icon: 'communication' },
        { title: 'UX Writing', detail: 'Eliminar fricción', icon: 'writing' },
        { title: 'Hoy', detail: 'Estrategia de contenidos · Comunicación · Negocio', icon: 'compass' },
      ],
      principlesEyebrow: 'Cómo trabajo',
      principlesTitle: 'Clara. Honesta. Práctica.',
      principles: [
        { title: 'Clara', text: 'Hago comprensible la información compleja.', icon: 'clear' },
        { title: 'Honesta', text: 'La comunicación no necesita sonar complicada para ser profesional.', icon: 'honest' },
        { title: 'Práctica', text: 'Un buen contenido debe ayudar a la audiencia y tener sentido para el negocio que hay detrás.', icon: 'practical' },
      ],
      experienceTitle: 'Experiencia',
      experienceIntro: 'Un perfil amplio, construido con intención.',
      cvLabel: 'Descargar CV ↓',
      cvNote: 'CV en inglés',
      educationTitle: 'Formación',
      educationIntro: 'Una formación que explica el recorrido.',
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
      cvNote: 'CV en inglés',
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
      description: 'Trabajo profesional de comunicación y proyectos seleccionados de UX writing, presentados por el pensamiento que hay detrás.',
      empty: 'Pronto se añadirán proyectos aquí.',
      year: 'Año',
      readProject: 'Ver proyecto',
      selectedEyebrow: 'Trabajo seleccionado',
      selectedTitle: 'Trabajo seleccionado con un poco más de historia detrás.',
      moreEyebrow: 'Más trabajo',
      moreTitle: 'Ejercicios breves de UX writing y diseño de contenido.',
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
