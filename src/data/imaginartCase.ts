import type { Locale } from '../i18n/config';

interface ImaginartCaseCopy {
  hero: { eyebrow: string; title: string; descriptor: string; role: string; introduction: string };
  collaboration: {
    eyebrow: string; title: string; introduction: string; note: string;
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
    families: string; taxonomy: string; structure: string; fields: string[]; takeaway: string;
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
      introduction: 'The recurring challenge was to preserve technical truth while making information clearer, more useful and easier to act on across product, email and event channels.',
    },
    collaboration: {
      eyebrow: 'Context & collaboration',
      title: 'Working between technical detail, customer needs and business reality.',
      introduction: 'My role was to turn specialist input into structured communication. The relationship was collaborative, not a rigid waterfall.',
      note: 'An explanatory collaboration relationship—not a claimed fixed process.',
      engineering: 'Engineering', engineeringDetail: 'Technical truth and product detail',
      sales: 'Sales', salesDetail: 'Customer reality and target needs',
      abilene: 'Abilene', abileneDetail: 'Content structure · framing · copy · channel execution',
      management: 'Management', managementDetail: 'Business and final validation',
    },
    newsletter: {
      number: '01', title: 'Refreshing a specialist B2B newsletter', context: 'Mundo BrightSign',
      introduction: 'I revised the editorial approach, moved toward a closer professional tone, added an emoji at the beginning of the subject and brought the CTA above the fold.',
      earlier: '~24%', revised: '~34%', delta: '+10 percentage points approx.',
      disclaimer: 'Approximate recalled open rate. Not an A/B test. No single change is presented as causal.',
      earlierSteps: ['Subject', 'Introduction', 'Content', 'More content', 'CTA'],
      revisedSteps: ['Emoji-led revised subject', 'Closer professional tone', 'CTA above the fold', 'Content', 'Additional content'],
    },
    turtle: {
      number: '02', title: 'Launching a new brand in Spain', context: 'Turtle AV · imaginArt',
      introduction: 'I structured the product page and worked with technical specialists to make dense source information useful to a professional B2B audience.',
      input: 'Technical input', work: 'Abilene', output: 'Usable product content',
      actions: ['Select', 'Prioritize', 'Structure', 'Translate and frame'],
      transformations: ['Features → benefits', 'Specifications → applications', 'Technical terminology → customer-facing language', 'Product families → navigation'],
      takeaway: 'Technical truth → structure → usable B2B content',
    },
    event: {
      number: '03', title: 'Planning and promoting a corporate event', context: 'imaginArt · Madrid Open Days 2026',
      introduction: 'I connected copy, campaign assets, registration and channel execution around one event objective.',
      channels: ['Mailing', 'Web', 'LinkedIn', 'Canva and support assets'], registration: 'Registration', event: 'Event',
      usual: 'Usual similar events', usualRange: '~70–80', actual: 'Madrid Open Days', actualRange: '~110–125',
      disclaimer: 'Approximate recalled attendance ranges. No precise percentage uplift is claimed.',
      bilbao: 'Bilbao provides supporting evidence that this conversion-oriented event structure was repeatable, not a one-off.',
    },
    catalogue: {
      number: '04', title: 'Structuring a technical product catalogue', context: 'AV Supports Catalogue',
      introduction: 'The work went beyond individual descriptions: I defined how products were grouped, how information repeated and how technical specifications became useful commercial content.',
      families: 'Product families', taxonomy: 'Taxonomy and categories', structure: 'Repeatable product structure',
      fields: ['Description', 'Compatible size', 'Weight', 'VESA', 'Movement', 'Use case', 'CTA'],
      takeaway: 'Information architecture · structured product content · sales enablement',
    },
    lumens: {
      number: '05', title: 'Adapting technical information for a B2B audience', context: 'Lumens',
      introduction: 'This was technical content adaptation, not merely translation. I selected and reframed source material for imaginArt’s professional audience.',
      source: 'Manufacturer documentation', work: 'Abilene', actions: ['Select', 'Prioritize', 'Adapt', 'Structure'], output: 'Clear B2B communication',
      questions: ['What does it do?', 'Who is it for?', 'Why does it matter?', 'How can it be used?'],
      note: 'The manufacturer remained the source of the underlying specifications.',
    },
    close: {
      eyebrow: 'The common thread',
      title: 'Making complex information clearer and more useful.',
      text: 'Across product content, email, events and catalogues, the work was about connecting specialist knowledge with what an audience actually needed to understand and do next.',
      back: 'Back to all work',
    },
  },
  es: {
    hero: {
      eyebrow: 'imaginArt · Contenido y comunicación B2B',
      title: 'Hacer más clara la comunicación B2B especializada',
      descriptor: 'Estructura de contenidos, comunicación editorial y campañas para audiencias profesionales del sector audiovisual.',
      role: 'Especialista en Marketing y Comunicación · Ene 2023–Jul 2026',
      introduction: 'El reto recurrente era conservar la precisión técnica y convertir la información en algo más claro, útil y fácil de llevar a la acción en producto, email y eventos.',
    },
    collaboration: {
      eyebrow: 'Contexto y colaboración',
      title: 'Trabajar entre el detalle técnico, las necesidades del público y la realidad del negocio.',
      introduction: 'Mi papel consistía en convertir información especializada en comunicación estructurada. La relación era colaborativa, no una cascada rígida.',
      note: 'Una relación explicativa de colaboración, no un proceso fijo atribuido al trabajo.',
      engineering: 'Ingeniería', engineeringDetail: 'Precisión técnica y detalle de producto',
      sales: 'Ventas', salesDetail: 'Realidad del cliente y necesidades del público',
      abilene: 'Abilene', abileneDetail: 'Estructura · enfoque · copy · ejecución por canales',
      management: 'Dirección', managementDetail: 'Validación final y de negocio',
    },
    newsletter: {
      number: '01', title: 'Renovar una newsletter B2B especializada', context: 'Mundo BrightSign',
      introduction: 'Revisé el enfoque editorial, acerqué el tono sin perder profesionalidad, añadí un emoji al principio del asunto y subí el CTA por encima del primer scroll.',
      earlier: '~24 %', revised: '~34 %', delta: '+10 puntos porcentuales aprox.',
      disclaimer: 'Tasa de apertura aproximada recordada. No fue un test A/B. No se atribuye el resultado a un único cambio.',
      earlierSteps: ['Asunto', 'Introducción', 'Contenido', 'Más contenido', 'CTA'],
      revisedSteps: ['Asunto revisado con emoji', 'Tono profesional más cercano', 'CTA visible al inicio', 'Contenido', 'Contenido adicional'],
    },
    turtle: {
      number: '02', title: 'Lanzar una nueva marca en España', context: 'Turtle AV · imaginArt',
      introduction: 'Estructuré la página de producto y trabajé con especialistas para convertir información técnica densa en contenido útil para una audiencia B2B profesional.',
      input: 'Información técnica', work: 'Abilene', output: 'Contenido de producto útil',
      actions: ['Seleccionar', 'Priorizar', 'Estructurar', 'Traducir y enfocar'],
      transformations: ['Características → beneficios', 'Especificaciones → aplicaciones', 'Terminología técnica → lenguaje para clientes', 'Familias de producto → navegación'],
      takeaway: 'Precisión técnica → estructura → contenido B2B útil',
    },
    event: {
      number: '03', title: 'Planificar y promocionar un evento corporativo', context: 'imaginArt · Madrid Open Days 2026',
      introduction: 'Conecté el copy, las piezas de campaña, el registro y la ejecución en canales alrededor de un mismo objetivo.',
      channels: ['Mailing', 'Web', 'LinkedIn', 'Canva y materiales de apoyo'], registration: 'Registro', event: 'Evento',
      usual: 'Eventos similares habituales', usualRange: '~70–80', actual: 'Madrid Open Days', actualRange: '~110–125',
      disclaimer: 'Rangos aproximados de asistencia recordada. No se calcula un aumento porcentual preciso.',
      bilbao: 'Bilbao aporta evidencia de que esta estructura orientada a la conversión se repitió y no fue un caso aislado.',
    },
    catalogue: {
      number: '04', title: 'Estructurar un catálogo técnico de producto', context: 'Catálogo AV Supports',
      introduction: 'El trabajo iba más allá de descripciones aisladas: definí cómo agrupar los productos, repetir la información y convertir especificaciones técnicas en contenido comercial útil.',
      families: 'Familias de producto', taxonomy: 'Taxonomía y categorías', structure: 'Estructura de producto repetible',
      fields: ['Descripción', 'Tamaño compatible', 'Peso', 'VESA', 'Movimiento', 'Caso de uso', 'CTA'],
      takeaway: 'Arquitectura de información · contenido estructurado · apoyo a ventas',
    },
    lumens: {
      number: '05', title: 'Adaptar información técnica para una audiencia B2B', context: 'Lumens',
      introduction: 'Fue adaptación de contenido técnico, no solo traducción. Seleccioné y enfoqué la documentación fuente para la audiencia profesional de imaginArt.',
      source: 'Documentación del fabricante', work: 'Abilene', actions: ['Seleccionar', 'Priorizar', 'Adaptar', 'Estructurar'], output: 'Comunicación B2B clara',
      questions: ['¿Qué hace?', '¿Para quién es?', '¿Por qué importa?', '¿Cómo se puede utilizar?'],
      note: 'El fabricante siguió siendo la fuente de las especificaciones técnicas.',
    },
    close: {
      eyebrow: 'El hilo común',
      title: 'Hacer la información compleja más clara y útil.',
      text: 'En contenido de producto, email, eventos y catálogos, el trabajo consistió en conectar el conocimiento especializado con lo que la audiencia necesitaba entender y hacer después.',
      back: 'Volver a todo el trabajo',
    },
  },
};
