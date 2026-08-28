import type { Locale } from '../i18n/config';

interface SeoMetadata {
  title: string;
  description: string;
}

type PageSeoKey = 'home' | 'about' | 'projects' | 'contact' | 'privacy';

export const pageSeo: Record<Locale, Record<PageSeoKey, SeoMetadata>> = {
  en: {
    home: {
      title: 'Content Designer & Communications',
      description:
        'Content designer and communications specialist in Barcelona, working across content strategy, UX writing, marketing and B2B/B2C content.',
    },
    about: {
      title: 'About a Content Designer in Barcelona',
      description:
        'Meet Abilene Caride, a Barcelona-based content designer with experience in communications, marketing, UX writing and B2B/B2C content.',
    },
    projects: {
      title: 'Content & Communications Portfolio',
      description:
        'Explore Abilene Caride’s portfolio of B2B content strategy, communications, marketing and selected UX writing and content design projects.',
    },
    contact: {
      title: 'Contact a Content Designer in Barcelona',
      description:
        'Contact Abilene Caride in Barcelona to discuss content design, content strategy, communications, marketing or UX writing opportunities.',
    },
    privacy: {
      title: 'Privacy, Cookies & Analytics',
      description:
        'Learn how abicaride.com handles optional analytics consent, local preferences and contact form submissions, with privacy controls available at any time.',
    },
  },
  es: {
    home: {
      title: 'Diseño de contenidos y comunicación',
      description:
        'Diseñadora de contenidos y especialista en comunicación en Barcelona, con experiencia en estrategia, UX writing, marketing y contenido B2B y B2C.',
    },
    about: {
      title: 'Sobre mí: diseño de contenidos en Barcelona',
      description:
        'Conoce a Abilene Caride, diseñadora de contenidos en Barcelona con experiencia en comunicación, marketing, UX writing y contenido B2B y B2C.',
    },
    projects: {
      title: 'Portfolio de contenidos y comunicación',
      description:
        'Explora el portfolio de Abilene Caride: estrategia de contenidos B2B, comunicación, marketing y proyectos de UX writing y diseño de contenidos.',
    },
    contact: {
      title: 'Contacto para contenidos y comunicación',
      description:
        'Contacta con Abilene Caride en Barcelona para hablar de diseño y estrategia de contenidos, comunicación, marketing o UX writing.',
    },
    privacy: {
      title: 'Privacidad, cookies y analítica',
      description:
        'Consulta cómo abicaride.com gestiona el consentimiento de analítica, las preferencias locales y los envíos del formulario de contacto.',
    },
  },
};

export const projectSeo: Record<Locale, Record<string, SeoMetadata>> = {
  en: {
    'imaginart-b2b-content': {
      title: 'B2B Content Strategy & Communications — imaginArt',
      description:
        'How I structured technical product content, refreshed editorial email communication and helped turn a corporate event into one coherent B2B campaign.',
    },
    'cognitive-biases': {
      title: 'Cognitive Biases in Ecommerce — UX Case Study',
      description:
        'A UX writing case study on how an online marketplace uses cognitive biases and decision-making patterns across its ecommerce experience.',
    },
    'error-messages': {
      title: 'Error Messages — UX Writing Case Study',
      description:
        'A UX writing case study showing how product error messages can support recovery while adapting clearly to four different brand voices.',
    },
    'website-analysis': {
      title: 'Website Content Audit — Juventud por el Clima',
      description:
        'A content and UX audit of Juventud por el Clima, identifying grounded opportunities to improve structure, navigation and the overall experience.',
    },
    'galaekian-green-life': {
      title: 'Sustainability Content Blog — Galaekian Green Life',
      description:
        'A personal sustainability content project using a fresh, humorous voice to make climate topics approachable through the Galaekian Green Life blog.',
    },
    'published-letters': {
      title: 'Editorial Writing — Published Letters to Editors',
      description:
        'Five short opinion pieces created for a university assignment and published by Spanish newspapers, demonstrating concise editorial writing.',
    },
    'error-404-pages': {
      title: '404 Page UX Writing Concepts',
      description:
        'Four 404 page concepts adapted to different brand voices and contexts, exploring how UX writing can make errors clearer and recovery more useful.',
    },
    'transactional-messages': {
      title: 'Transactional Email & SMS — UX Writing',
      description:
        'Six transactional email and SMS examples shaped around urgency, apology and reassurance, with clear actions suited to each channel.',
    },
    'chatbot-flow': {
      title: 'Chatbot Conversation Flow — UX Writing',
      description:
        'Two happy paths for a streaming assistant, using concise UX writing to solve a user need without adding unnecessary cognitive effort.',
    },
    'meta-descriptions': {
      title: 'Meta Descriptions & Search Intent — SEO Writing',
      description:
        'Search-result copy for three topics, supported by query research and a rationale connecting search intent, relevance and useful wording.',
    },
  },
  es: {
    'imaginart-b2b-content': {
      title: 'Marketing y comunicación B2B — imaginArt',
      description:
        'Cómo estructuré contenido técnico de producto, renové el email editorial y convertí un evento corporativo en una campaña de comunicación B2B coherente.',
    },
    'cognitive-biases': {
      title: 'Sesgos cognitivos en ecommerce — Caso UX',
      description:
        'Un caso de UX writing sobre cómo un marketplace utiliza sesgos cognitivos y patrones de decisión a lo largo de su experiencia de ecommerce.',
    },
    'error-messages': {
      title: 'Mensajes de error — Caso de UX writing',
      description:
        'Un caso de UX writing sobre mensajes de error que facilitan la recuperación y se adaptan con claridad a cuatro voces de marca diferentes.',
    },
    'website-analysis': {
      title: 'Auditoría web — Juventud por el Clima',
      description:
        'Una auditoría de contenido y experiencia de Juventud por el Clima, con oportunidades fundamentadas para mejorar estructura, navegación y uso.',
    },
    'galaekian-green-life': {
      title: 'Blog de sostenibilidad — Galaekian Green Life',
      description:
        'Un proyecto personal de contenido sobre sostenibilidad que usa una voz fresca y humorística para acercar temas climáticos desde el blog Galaekian Green Life.',
    },
    'published-letters': {
      title: 'Escritura editorial — Cartas publicadas',
      description:
        'Cinco textos breves de opinión creados para un trabajo universitario y publicados en periódicos españoles como ejercicio de escritura editorial.',
    },
    'error-404-pages': {
      title: 'Conceptos de UX writing para páginas 404',
      description:
        'Cuatro conceptos de página 404 adaptados a distintas voces y contextos de marca para hacer el error más claro y facilitar la recuperación.',
    },
    'transactional-messages': {
      title: 'Emails y SMS transaccionales — UX writing',
      description:
        'Seis ejemplos de email y SMS transaccionales construidos alrededor de la urgencia, la disculpa y la tranquilidad, con acciones claras para cada canal.',
    },
    'chatbot-flow': {
      title: 'Flujo conversacional para chatbot — UX writing',
      description:
        'Dos caminos felices para un asistente de streaming, con UX writing conciso para resolver una necesidad sin añadir esfuerzo cognitivo innecesario.',
    },
    'meta-descriptions': {
      title: 'Meta descripciones e intención de búsqueda — SEO',
      description:
        'Textos para resultados de búsqueda de tres temas, apoyados por investigación de consultas y una justificación centrada en intención y relevancia.',
    },
  },
};

export function getProjectSeo(
  locale: Locale,
  translationKey: string,
  fallback: SeoMetadata,
): SeoMetadata {
  return projectSeo[locale][translationKey] ?? fallback;
}
