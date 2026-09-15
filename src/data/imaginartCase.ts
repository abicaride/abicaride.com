import type { Locale } from '../i18n/config';

interface ImaginartCaseCopy {
  hero: { eyebrow: string; title: string; descriptor: string; role: string; introduction: string };
  collaboration: {
    eyebrow: string; title: string; introduction: string; note?: string;
    engineering: string; engineeringDetail: string; sales: string; salesDetail: string;
    abilene: string; abileneDetail: string; management: string; managementDetail: string;
  };
  newsletter: {
    number: string; title: string; context: string; introduction: string;
    earlier: string; revised: string; delta: string; disclaimer: string;
    earlierSteps: string[]; revisedSteps: string[];
  };
  turtle: {
    number: string; title: string; context: string; introduction: string;
    input: string; work: string; output: string; actions: string[]; transformations: string[]; takeaway: string;
  };
  event: {
    number: string; title: string; context: string; introduction: string;
    channels: string[]; registration: string; event: string; usual: string; usualRange: string;
    actual: string; actualRange: string; disclaimer: string; bilbao: string;
  };
  catalogue: {
    number: string; title: string; context: string; introduction: string;
    families: string; taxonomy: string; structure: string; fields: string[]; takeaway?: string;
  };
  lumens: {
    number: string; title: string; context: string; introduction: string;
    source: string; work: string; actions: string[]; output: string; questions: string[]; note: string;
  };
  close: { eyebrow: string; title: string; text: string; back: string };
}

export const imaginartCase: Record<Locale, ImaginartCaseCopy> = {
  en: {
    hero: {
      eyebrow: 'imaginArt · B2B content & communications',
      title: 'Making specialist B2B communication clearer',
      descriptor: 'Content structure, editorial communication and campaigns for professional audiovisual audiences.',
      role: 'Marketing & Communications Specialist · Jan 2023–Jul 2026',
      introduction: 'The challenge was to keep technical information accurate while making it easier for customers to understand across product pages, email and event campaigns.',
    },
    collaboration: {
      eyebrow: 'Context & collaboration',
      title: 'Where the information came from',
      introduction: 'Engineering provided the technical detail, sales brought customer context, and I shaped the structure, framing and copy before management approval.',
      engineering: 'Engineering', engineeringDetail: 'Technical truth and product detail',
      sales: 'Sales', salesDetail: 'Customer reality and target needs',
      abilene: 'Abilene', abileneDetail: 'Content structure · framing · copy · channel execution',
      management: 'Management', managementDetail: 'Business and final validation',
    },
    newsletter: {
      number: '01', title: 'Refreshing a specialist B2B newsletter', context: 'Mundo BrightSign',
      introduction: 'I rewrote the newsletter in a more approachable professional tone, added an emoji to the subject line and moved the main CTA above the fold.',
      earlier: '~24%', revised: '~34%', delta: '+10 percentage points approx.',
      disclaimer: 'Approximate open rates. This was not an A/B test.',
      earlierSteps: ['Subject', 'Introduction', 'Content', 'More content', 'CTA'],
      revisedSteps: ['Emoji-led revised subject', 'Closer professional tone', 'CTA above the fold', 'Content', 'Additional content'],
    },
    turtle: {
      number: '02', title: 'Structuring the Turtle AV product page', context: 'Turtle AV · imaginArt',
      introduction: 'I structured the product page and worked with technical specialists to decide what information to prioritise and how to present it to a professional B2B audience.',
      input: 'Technical input', work: 'Abilene', output: 'Usable product content',
      actions: ['Select', 'Prioritise', 'Structure', 'Adapt for the audience'],
      transformations: ['Features → benefits', 'Specifications → applications', 'Technical terminology → customer-facing language', 'Product families → navigation'],
      takeaway: 'Technical truth → structure → usable B2B content',
    },
    event: {
      number: '03', title: 'Planning and promoting a corporate event', context: 'imaginArt · Madrid Open Days 2026',
      introduction: 'I worked across the mailing, web content, LinkedIn communication, Canva assets and registration flow for the Madrid Open Days.',
      channels: ['Mailing', 'Web', 'LinkedIn', 'Canva and support assets'], registration: 'Registration', event: 'Event',
      usual: 'Usual similar events', usualRange: '~70–80', actual: 'Madrid Open Days', actualRange: '~110–125',
      disclaimer: 'Approximate attendance figures.',
      bilbao: 'I had used a similar event communication structure for the Bilbao event the year before.',
    },
    catalogue: {
      number: '04', title: 'Structuring a technical product catalogue', context: 'AV Supports Catalogue',
      introduction: 'I defined the product families and a repeatable structure for descriptions, compatibility, weight, VESA, movement, use cases and calls to action.',
      families: 'Product families', taxonomy: 'Taxonomy and categories', structure: 'Repeatable product structure',
      fields: ['Description', 'Compatible size', 'Weight', 'VESA', 'Movement', 'Use case', 'CTA'],
    },
    lumens: {
      number: '05', title: 'Adapting technical information for a B2B audience', context: 'Lumens',
      introduction: 'I selected, prioritised and rewrote manufacturer documentation for imaginArt’s professional audience.',
      source: 'Manufacturer documentation', work: 'Abilene', actions: ['Select', 'Prioritize', 'Adapt', 'Structure'], output: 'Clear B2B communication',
      questions: ['What does it do?', 'Who is it for?', 'Why does it matter?', 'How can it be used?'],
      note: 'The technical specifications came from the manufacturer; my role was deciding what to include and how to present it.',
    },
    close: {
      eyebrow: 'What I learned',
      title: 'The version I preferred wasn’t always the one that performed best.',
      text: 'We started A/B testing subject lines later. It was a useful reminder that a version can feel obviously better to me and still not be the one readers respond to.',
      back: 'Back to all work',
    },
  },
  es: {
    hero: {
      eyebrow: 'imaginArt · Contenido y comunicación B2B',
      title: 'Hacer más clara la comunicación B2B especializada',
      descriptor: 'Estructura de contenidos, comunicación editorial y campañas para audiencias profesionales del sector audiovisual.',
      role: 'Especialista en Marketing y Comunicación · Ene 2023–Jul 2026',
      introduction: 'El reto era mantener la precisión de la información técnica y, al mismo tiempo, hacerla más fácil de entender para los clientes en páginas de producto, email y campañas de eventos.',
    },
    collaboration: {
      eyebrow: 'Contexto y colaboración',
      title: 'De dónde venía la información',
      introduction: 'Ingeniería aportaba el detalle técnico, ventas el contexto del cliente y yo trabajaba la estructura, el enfoque y el copy antes de la aprobación de dirección.',
      engineering: 'Ingeniería', engineeringDetail: 'Precisión técnica y detalle de producto',
      sales: 'Ventas', salesDetail: 'Realidad del cliente y necesidades del público',
      abilene: 'Abilene', abileneDetail: 'Estructura · enfoque · copy · ejecución por canales',
      management: 'Dirección', managementDetail: 'Validación final y de negocio',
    },
    newsletter: {
      number: '01', title: 'Renovar una newsletter B2B especializada', context: 'Mundo BrightSign',
      introduction: 'Reescribí la newsletter con un tono profesional más cercano, añadí un emoji al asunto y moví el CTA principal por encima del primer scroll.',
      earlier: '~24 %', revised: '~34 %', delta: '+10 puntos porcentuales aprox.',
      disclaimer: 'Tasas de apertura aproximadas. No fue un test A/B.',
      earlierSteps: ['Asunto', 'Introducción', 'Contenido', 'Más contenido', 'CTA'],
      revisedSteps: ['Asunto revisado con emoji', 'Tono profesional más cercano', 'CTA visible al inicio', 'Contenido', 'Contenido adicional'],
    },
    turtle: {
      number: '02', title: 'Estructurar la página de producto de Turtle AV', context: 'Turtle AV · imaginArt',
      introduction: 'Estructuré la página de producto y trabajé con especialistas técnicos para decidir qué información priorizar y cómo presentarla a una audiencia B2B profesional.',
      input: 'Información técnica', work: 'Abilene', output: 'Contenido de producto útil',
      actions: ['Seleccionar', 'Priorizar', 'Estructurar', 'Adaptar a la audiencia'],
      transformations: ['Características → beneficios', 'Especificaciones → aplicaciones', 'Terminología técnica → lenguaje para clientes', 'Familias de producto → navegación'],
      takeaway: 'Precisión técnica → estructura → contenido B2B útil',
    },
    event: {
      number: '03', title: 'Planificar y promocionar un evento corporativo', context: 'imaginArt · Madrid Open Days 2026',
      introduction: 'Trabajé el mailing, el contenido web, la comunicación en LinkedIn, las piezas de Canva y el flujo de registro para los Madrid Open Days.',
      channels: ['Mailing', 'Web', 'LinkedIn', 'Canva y materiales de apoyo'], registration: 'Registro', event: 'Evento',
      usual: 'Eventos similares habituales', usualRange: '~70–80', actual: 'Madrid Open Days', actualRange: '~110–125',
      disclaimer: 'Cifras de asistencia aproximadas.',
      bilbao: 'Había utilizado una estructura similar de comunicación para el evento de Bilbao el año anterior.',
    },
    catalogue: {
      number: '04', title: 'Estructurar un catálogo técnico de producto', context: 'Catálogo AV Supports',
      introduction: 'Definí las familias de producto y una estructura repetible para descripciones, compatibilidad, peso, VESA, movimiento, casos de uso y llamadas a la acción.',
      families: 'Familias de producto', taxonomy: 'Taxonomía y categorías', structure: 'Estructura de producto repetible',
      fields: ['Descripción', 'Tamaño compatible', 'Peso', 'VESA', 'Movimiento', 'Caso de uso', 'CTA'],
    },
    lumens: {
      number: '05', title: 'Adaptar información técnica para una audiencia B2B', context: 'Lumens',
      introduction: 'Seleccioné, prioricé y reescribí documentación del fabricante para la audiencia profesional de imaginArt.',
      source: 'Documentación del fabricante', work: 'Abilene', actions: ['Seleccionar', 'Priorizar', 'Adaptar', 'Estructurar'], output: 'Comunicación B2B clara',
      questions: ['¿Qué hace?', '¿Para quién es?', '¿Por qué importa?', '¿Cómo se puede utilizar?'],
      note: 'Las especificaciones técnicas procedían del fabricante; mi papel era decidir qué incluir y cómo presentarlo.',
    },
    close: {
      eyebrow: 'Lo que aprendí',
      title: 'La versión que yo prefería no siempre era la que mejor funcionaba.',
      text: 'Más adelante empezamos a hacer tests A/B con los asuntos. Me sirvió para recordar que una opción puede parecerme claramente mejor y aun así no ser la que mejor responde la audiencia.',
      back: 'Volver a todo el trabajo',
    },
  },
};
