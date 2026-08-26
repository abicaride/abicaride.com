import type { Locale } from '../i18n/config';

export interface AtAGlanceItem {
  label: string;
  value: string | string[];
  note?: string;
}

export interface CaseIndexItem {
  number: string;
  label: string;
  anchor: `#${string}`;
}

export interface SelectedCaseDetails {
  atAGlance: {
    title: string;
    items: AtAGlanceItem[];
  };
  caseIndex?: {
    title: string;
    items: CaseIndexItem[];
  };
  competencies: {
    title: string;
    items: string[];
  };
}

type SelectedCaseKey = 'imaginart-b2b-content' | 'cognitive-biases' | 'error-messages';

export const selectedCaseDetails: Record<Locale, Record<SelectedCaseKey, SelectedCaseDetails>> = {
  en: {
    'imaginart-b2b-content': {
      atAGlance: {
        title: 'At a glance',
        items: [
          { label: 'The challenge', value: 'Make specialist technical information clearer and easier to act on.' },
          { label: 'My role', value: 'Communications Specialist' },
          { label: 'What I did', value: 'Content strategy · Product content · Email · Events' },
          {
            label: 'Evidence',
            value: ['~24% → ~34% email open rate', '~110–125 event attendees'],
            note: 'Approximate recalled figures',
          },
        ],
      },
      caseIndex: {
        title: 'In this case',
        items: [
          { number: '01', label: 'Newsletter', anchor: '#newsletter' },
          { number: '02', label: 'Brand launch', anchor: '#brand-launch' },
          { number: '03', label: 'Corporate event', anchor: '#corporate-event' },
          { number: '04', label: 'Product catalogue', anchor: '#catalogue' },
          { number: '05', label: 'Technical adaptation', anchor: '#technical-adaptation' },
        ],
      },
      competencies: {
        title: 'What this work shows',
        items: ['Content strategy', 'Technical communication', 'Campaign execution'],
      },
    },
    'cognitive-biases': {
      atAGlance: {
        title: 'At a glance',
        items: [
          { label: 'The challenge', value: 'Understand how behavioural patterns influence ecommerce decisions.' },
          { label: 'My role', value: 'UX Writing postgraduate project' },
          { label: 'What I did', value: 'UX audit · Behavioural analysis · Pattern identification' },
          {
            label: 'Outcome',
            value: 'A structured audit — and a critical question: does the pattern help people choose, or push them?',
          },
        ],
      },
      competencies: {
        title: 'What this work shows',
        items: ['Behavioural design', 'UX analysis', 'Ethical judgement'],
      },
    },
    'error-messages': {
      atAGlance: {
        title: 'At a glance',
        items: [
          { label: 'The challenge', value: 'Help users recover from an error without losing the brand voice.' },
          { label: 'My role', value: 'UX Writing postgraduate project' },
          { label: 'What I did', value: 'Microcopy · Error recovery · Tone adaptation' },
          { label: 'Outcome', value: 'Clear next steps adapted to four different brand voices.' },
        ],
      },
      competencies: {
        title: 'What this work shows',
        items: ['UX writing', 'Error recovery', 'Tone of voice'],
      },
    },
  },
  es: {
    'imaginart-b2b-content': {
      atAGlance: {
        title: 'De un vistazo',
        items: [
          { label: 'El reto', value: 'Hacer la información técnica especializada más clara y fácil de llevar a la acción.' },
          { label: 'Mi papel', value: 'Especialista en Comunicación' },
          { label: 'Qué hice', value: 'Estrategia de contenidos · Contenido de producto · Email · Eventos' },
          {
            label: 'Evidencia',
            value: ['~24 % → ~34 % de apertura', '~110–125 asistentes'],
            note: 'Datos aproximados recordados',
          },
        ],
      },
      caseIndex: {
        title: 'En este caso',
        items: [
          { number: '01', label: 'Newsletter', anchor: '#newsletter' },
          { number: '02', label: 'Lanzamiento de marca', anchor: '#brand-launch' },
          { number: '03', label: 'Evento corporativo', anchor: '#corporate-event' },
          { number: '04', label: 'Catálogo de producto', anchor: '#catalogue' },
          { number: '05', label: 'Adaptación técnica', anchor: '#technical-adaptation' },
        ],
      },
      competencies: {
        title: 'Lo que demuestra este trabajo',
        items: ['Estrategia de contenidos', 'Comunicación técnica', 'Ejecución de campañas'],
      },
    },
    'cognitive-biases': {
      atAGlance: {
        title: 'De un vistazo',
        items: [
          { label: 'El reto', value: 'Comprender cómo los patrones conductuales influyen en las decisiones de compra online.' },
          { label: 'Mi papel', value: 'Proyecto de postgrado en UX Writing' },
          { label: 'Qué hice', value: 'Auditoría UX · Análisis conductual · Identificación de patrones' },
          {
            label: 'Resultado',
            value: 'Una auditoría estructurada y una pregunta crítica: ¿el patrón ayuda a las personas a elegir o las empuja?',
          },
        ],
      },
      competencies: {
        title: 'Lo que demuestra este trabajo',
        items: ['Diseño conductual', 'Análisis UX', 'Criterio ético'],
      },
    },
    'error-messages': {
      atAGlance: {
        title: 'De un vistazo',
        items: [
          { label: 'El reto', value: 'Ayudar a las personas a recuperarse de un error sin perder la voz de marca.' },
          { label: 'Mi papel', value: 'Proyecto de postgrado en UX Writing' },
          { label: 'Qué hice', value: 'Microcopy · Recuperación ante errores · Adaptación del tono' },
          { label: 'Resultado', value: 'Próximos pasos claros adaptados a cuatro voces de marca diferentes.' },
        ],
      },
      competencies: {
        title: 'Lo que demuestra este trabajo',
        items: ['UX writing', 'Recuperación ante errores', 'Tono de voz'],
      },
    },
  },
};
