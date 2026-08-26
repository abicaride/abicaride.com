import type { Locale } from '../i18n/config';

interface ArchitectureStep {
  icon: string;
  name: string;
  description: string;
}

type FigmaFileKey = 'foundations' | 'website' | 'moodboard';

interface FigmaResource {
  key: FigmaFileKey;
  name: string;
  description: string;
}

export const figmaFileUrls: Record<FigmaFileKey, string> = {
  foundations: 'https://www.figma.com/design/2yrZXRDGo95taZ1J3VOPxx/Abi-Website-Foundations',
  website: 'https://www.figma.com/design/qzSb1nHDgRm21LNLkCjaFT/Abi-Personal-Website',
  moodboard: 'https://www.figma.com/board/PxH3eYTrRg5f2g8UenwGtP/Abi-Website-Moodboard',
};

interface ArchitectureCopy {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  introduction: string;
  flowTitle: string;
  flow: ArchitectureStep[];
  figmaTitle: string;
  figmaText: string;
  figmaResources: FigmaResource[];
  maintenanceTitle: string;
  maintenanceText: string;
  principlesTitle: string;
  principles: string[];
  sourceTitle: string;
  sourceText: string;
  sourceLink: string;
}

export const architectureCopy: Record<Locale, ArchitectureCopy> = {
  en: {
    title: 'How this website works',
    description:
      'A friendly tour of the design, content, build and deployment workflow behind abicaride.com.',
    eyebrow: 'Under the hood',
    heading: 'A small static website with a friendly little toolchain.',
    introduction:
      'This website stays simple on purpose. Each tool has one clear job, the content remains portable, and the finished pages reach your browser as fast static HTML.',
    flowTitle: 'From an idea to your screen',
    flow: [
      {
        icon: '🎨',
        name: 'Figma',
        description:
          'Visual ideas and design direction are explored here before they become code.',
      },
      {
        icon: '✍️',
        name: 'Pages CMS',
        description:
          'Abi edits English and Spanish project content through a friendly form. New projects begin as drafts.',
      },
      {
        icon: '🐙',
        name: 'GitHub',
        description:
          'The code, Markdown content and images live together here, with every change recorded in version history.',
      },
      {
        icon: '🚀',
        name: 'Astro',
        description:
          'Astro combines shared bilingual components, content and optimized images into static pages.',
      },
      {
        icon: '⚙️',
        name: 'GitHub Actions',
        description:
          'Every accepted change to the main branch is built and checked automatically before publication.',
      },
      {
        icon: '🌍',
        name: 'GitHub Pages',
        description:
          'The finished static website is published at abicaride.com, with no application server required.',
      },
    ],
    figmaTitle: 'Explore the design workspace',
    figmaText:
      'The three Figma files are public, view-only references. They show how visual ideas move from inspiration and foundations into production-oriented page designs; the Astro repository remains the implementation source of truth.',
    figmaResources: [
      {
        key: 'moodboard',
        name: 'Abi Website Moodboard',
        description: 'References, atmosphere and visual preferences.',
      },
      {
        key: 'foundations',
        name: 'Abi Website Foundations',
        description: 'Foundations, reusable components and explorations.',
      },
      {
        key: 'website',
        name: 'Abi Personal Website',
        description: 'Production-oriented homepage and case-study designs.',
      },
    ],
    maintenanceTitle: 'Implementation and maintenance',
    maintenanceText:
      'The production site is maintained in the repository. Code review, automated checks and tools such as Codex can assist implementation, while the website itself stays simple and independent of those tools.',
    principlesTitle: 'The rules of the build',
    principles: [
      'Static HTML first, with almost no browser JavaScript.',
      'English and Spanish share the same components instead of duplicating pages.',
      'Project content stays in portable Markdown files rather than a proprietary database.',
      'Analytics remains optional and does not load before consent.',
    ],
    sourceTitle: 'Curious enough to inspect the wiring?',
    sourceText:
      'The repository is public and includes the deeper architecture decisions, diagrams and working agreements behind the website.',
    sourceLink: 'Explore the technical architecture on GitHub',
  },
  es: {
    title: 'Cómo funciona esta web',
    description:
      'Un recorrido sencillo por el diseño, el contenido, la construcción y el despliegue de abicaride.com.',
    eyebrow: 'Entre bambalinas',
    heading: 'Una web estática y pequeña, con herramientas muy bien avenidas.',
    introduction:
      'Esta web se mantiene sencilla a propósito. Cada herramienta tiene una función clara, el contenido sigue siendo portable y las páginas llegan al navegador como HTML estático y rápido.',
    flowTitle: 'De una idea a tu pantalla',
    flow: [
      {
        icon: '🎨',
        name: 'Figma',
        description:
          'Aquí se exploran las ideas visuales y la dirección de diseño antes de convertirlas en código.',
      },
      {
        icon: '✍️',
        name: 'Pages CMS',
        description:
          'Abi edita el contenido de los proyectos en español e inglés mediante un formulario sencillo. Los proyectos nuevos empiezan como borradores.',
      },
      {
        icon: '🐙',
        name: 'GitHub',
        description:
          'El código, el contenido Markdown y las imágenes viven juntos aquí, con cada cambio guardado en el historial.',
      },
      {
        icon: '🚀',
        name: 'Astro',
        description:
          'Astro combina los componentes bilingües compartidos, el contenido y las imágenes optimizadas en páginas estáticas.',
      },
      {
        icon: '⚙️',
        name: 'GitHub Actions',
        description:
          'Cada cambio aceptado en la rama principal se construye y comprueba automáticamente antes de publicarse.',
      },
      {
        icon: '🌍',
        name: 'GitHub Pages',
        description:
          'La web estática terminada se publica en abicaride.com sin necesitar un servidor de aplicaciones.',
      },
    ],
    figmaTitle: 'Explora el espacio de diseño',
    figmaText:
      'Los tres archivos de Figma son referencias públicas de solo lectura. Muestran cómo las ideas visuales pasan de la inspiración y los fundamentos a los diseños de páginas orientados a producción; el repositorio Astro sigue siendo la fuente de verdad de la implementación.',
    figmaResources: [
      {
        key: 'moodboard',
        name: 'Abi Website Moodboard',
        description: 'Referencias, atmósfera y preferencias visuales.',
      },
      {
        key: 'foundations',
        name: 'Abi Website Foundations',
        description: 'Fundamentos, componentes reutilizables y exploraciones.',
      },
      {
        key: 'website',
        name: 'Abi Personal Website',
        description: 'Diseños de portada y casos de estudio orientados a producción.',
      },
    ],
    maintenanceTitle: 'Implementación y mantenimiento',
    maintenanceText:
      'La web de producción se mantiene desde el repositorio. La revisión de código, las comprobaciones automáticas y herramientas como Codex pueden ayudar con la implementación, mientras la propia web sigue siendo sencilla e independiente de ellas.',
    principlesTitle: 'Las reglas del juego',
    principles: [
      'HTML estático primero, con casi nada de JavaScript en el navegador.',
      'El inglés y el español comparten componentes en lugar de duplicar páginas.',
      'El contenido de los proyectos permanece en archivos Markdown portables, no en una base de datos propietaria.',
      'La analítica es opcional y no se carga antes del consentimiento.',
    ],
    sourceTitle: '¿Te apetece mirar el cableado?',
    sourceText:
      'El repositorio es público e incluye las decisiones de arquitectura, los diagramas y los acuerdos de trabajo que sostienen la web.',
    sourceLink: 'Explorar la arquitectura técnica en GitHub',
  },
};
