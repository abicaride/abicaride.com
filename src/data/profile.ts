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
}

export const profiles: Record<Locale, Profile> = {
  en: {
    experience: [
      {
        title: 'Marketing & Communications Specialist',
        organization: 'imaginArt',
        period: 'Jan 2023–Jul 2026',
        description: 'B2B communication strategy, campaigns, events, web content, SEO and user experience work.',
      },
      {
        title: 'Content Designer',
        organization: 'Ailanto',
        period: 'Sep 2019–Nov 2021',
        description: 'Corporate copy, ecommerce design support, weekly newsletters and customer service.',
      },
      {
        title: 'Communication Intern',
        organization: 'Federación Pantalla',
        period: 'Nov 2020–Mar 2021',
        description: 'Social content, newsletters, press materials, live events and internal communication.',
      },
      {
        title: 'Copywriter',
        organization: 'Ethic Investors',
        period: 'May 2017–Jul 2019',
        description: 'Executive support, official documentation and content for property and crowdfunding offers.',
      },
      {
        title: 'Ecommerce and Business Operations',
        organization: 'Caprichos de Casa Import',
        period: '2011–2017',
        description: 'Online catalogue maintenance, promotions, newsletters and support for the store redesign and relaunch.',
      },
    ],
    education: [
      { title: 'Postgraduate in UX Writing', organization: 'SHIFTA by Elisava', period: '2021–2022' },
      { title: 'Proficiency English Certificate - Cambridge C2 (2024)', organization: 'Cambridge English', period: '' },
      { title: 'BA in Communication', organization: 'Universitat Oberta de Catalunya', period: '2014–2020' },
      { title: 'Administration and Finance', organization: 'Colexio Vivas', period: '2009–2011' },
    ],
    languages: ['Spanish · native', 'Galician · native', 'English · C2 certified', 'Catalan · B1', 'Spanish Sign Language · bilingual', 'Portuguese · A2', 'Korean · A1'],
  },
  es: {
    experience: [
      {
        title: 'Especialista en Marketing y Comunicación',
        organization: 'imaginArt',
        period: 'Ene 2023–Jul 2026',
        description: 'Estrategia de comunicación B2B, campañas, eventos, contenido web, SEO y experiencia de usuario.',
      },
      {
        title: 'Diseñadora de contenidos',
        organization: 'Ailanto',
        period: 'Sep 2019–Nov 2021',
        description: 'Textos corporativos, apoyo al diseño del ecommerce, newsletters semanales y atención al cliente.',
      },
      {
        title: 'Prácticas de comunicación',
        organization: 'Federación Pantalla',
        period: 'Nov 2020–Mar 2021',
        description: 'Contenido para redes, newsletters, materiales de prensa, eventos en directo y comunicación interna.',
      },
      {
        title: 'Copywriter',
        organization: 'Ethic Investors',
        period: 'May 2017–Jul 2019',
        description: 'Apoyo ejecutivo, documentación oficial y contenido para ofertas inmobiliarias y de crowdfunding.',
      },
      {
        title: 'Ecommerce y operaciones de negocio',
        organization: 'Caprichos de Casa Import',
        period: '2011–2017',
        description: 'Mantenimiento del catálogo online, promociones, newsletters y apoyo al rediseño y relanzamiento de la tienda.',
      },
    ],
    education: [
      { title: 'Postgrado en UX Writing', organization: 'SHIFTA by Elisava', period: '2021–2022' },
      { title: 'Proficiency English Certificate - Cambridge C2 (2024)', organization: 'Cambridge English', period: '' },
      { title: 'Grado en Comunicación', organization: 'Universitat Oberta de Catalunya', period: '2014–2020' },
      { title: 'Administración y Finanzas', organization: 'Colexio Vivas', period: '2009–2011' },
    ],
    languages: ['Español · nativo', 'Gallego · nativo', 'Inglés · C2 certificado', 'Catalán · B1', 'Lengua de Signos Española · bilingüe', 'Portugués · A2', 'Coreano · A1'],
  },
};
