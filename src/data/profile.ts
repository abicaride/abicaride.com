import type { Locale } from '../i18n/config';

interface ProfileItem {
  title: string;
  organization?: string;
  period: string;
  description?: string;
}

interface Profile {
  experience: ProfileItem[];
  education: ProfileItem[];
  languages: string[];
  tools: { label: string; items: string }[];
}

export const profiles: Record<Locale, Profile> = {
  en: {
    experience: [
      {
        title: 'Digital communication, marketing and UX',
        organization: 'imaginArt',
        period: '2021–present',
        description: 'B2B communication strategy, campaigns, events, web content, SEO and user experience work.',
      },
      {
        title: 'Communication and community',
        organization: 'Federación Pantalla',
        period: '2020–2021',
        description: 'Social content, newsletters, press materials, live events and internal communication.',
      },
      {
        title: 'Content, ecommerce and customer care',
        organization: 'Ailanto',
        period: '2019–2021',
        description: 'Corporate copy, ecommerce design support, weekly newsletters and customer service.',
      },
      {
        title: 'Administration and commercial content',
        organization: 'Ethic Investors',
        period: '2017–2019',
        description: 'Executive support, official documentation and content for property and crowdfunding offers.',
      },
      {
        title: 'Ecommerce and administration',
        organization: 'Caprichos de Casa Import',
        period: '2011–2019',
        description: 'Online catalogue maintenance, promotions, newsletters and support for the store redesign and relaunch.',
      },
    ],
    education: [
      { title: 'Postgraduate course in UX Writing', organization: 'SHIFTA by Elisava', period: '2021–2022' },
      { title: 'Cambridge English: Proficiency (C2)', organization: 'Cambridge English', period: '2024' },
      { title: 'Degree in Communication', organization: 'Universitat Oberta de Catalunya', period: '2014–2021' },
      { title: 'Administration and Finance', organization: 'Colexio Vivas', period: '2009–2011' },
    ],
    languages: ['Spanish · native', 'Galician · native', 'English · C2 certified', 'Catalan · B1', 'Sign language · bilingual', 'Portuguese · basic', 'Korean · A1'],
    tools: [
      { label: 'Content & design', items: 'Figma, Canva, Adobe Photoshop, Adobe Premiere' },
      { label: 'Web & commerce', items: 'WordPress, Shopify, PrestaShop, Wix' },
      { label: 'Work & analytics', items: 'Google Workspace, Microsoft Office, Notion, Slack, Trello, Google Analytics, Google Ads' },
    ],
  },
  es: {
    experience: [
      {
        title: 'Comunicación digital, marketing y UX',
        organization: 'imaginArt',
        period: '2021–actualidad',
        description: 'Estrategia de comunicación B2B, campañas, eventos, contenido web, SEO y experiencia de usuario.',
      },
      {
        title: 'Comunicación y comunidad',
        organization: 'Federación Pantalla',
        period: '2020–2021',
        description: 'Contenido para redes, newsletters, materiales de prensa, eventos en directo y comunicación interna.',
      },
      {
        title: 'Contenido, ecommerce y atención al cliente',
        organization: 'Ailanto',
        period: '2019–2021',
        description: 'Textos corporativos, apoyo al diseño del ecommerce, newsletters semanales y atención al cliente.',
      },
      {
        title: 'Administración y contenido comercial',
        organization: 'Ethic Investors',
        period: '2017–2019',
        description: 'Apoyo ejecutivo, documentación oficial y contenido para ofertas inmobiliarias y de crowdfunding.',
      },
      {
        title: 'Ecommerce y administración',
        organization: 'Caprichos de Casa Import',
        period: '2011–2019',
        description: 'Mantenimiento del catálogo online, promociones, newsletters y apoyo al rediseño y relanzamiento de la tienda.',
      },
    ],
    education: [
      { title: 'Postgrado en UX Writing', organization: 'SHIFTA by Elisava', period: '2021–2022' },
      { title: 'Cambridge English: Proficiency (C2)', organization: 'Cambridge English', period: '2024' },
      { title: 'Grado en Comunicación', organization: 'Universitat Oberta de Catalunya', period: '2014–2021' },
      { title: 'Administración y Finanzas', organization: 'Colexio Vivas', period: '2009–2011' },
    ],
    languages: ['Español · nativo', 'Gallego · nativo', 'Inglés · C2 certificado', 'Catalán · B1', 'Lengua de signos · bilingüe', 'Portugués · básico', 'Coreano · A1'],
    tools: [
      { label: 'Contenido y diseño', items: 'Figma, Canva, Adobe Photoshop, Adobe Premiere' },
      { label: 'Web y comercio', items: 'WordPress, Shopify, PrestaShop, Wix' },
      { label: 'Trabajo y analítica', items: 'Google Workspace, Microsoft Office, Notion, Slack, Trello, Google Analytics, Google Ads' },
    ],
  },
};
