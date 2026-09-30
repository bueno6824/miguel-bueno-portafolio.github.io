import {

  getProjects

} from "./chatbotProjects.js";

import {

  chatbotContext

} from "./chatbotState.js";

import {

  normalizeText

} from "./chatbotUtils.js";

import {

  calculateComplexityScore

} from "./chatbotAnalysis.js";

// Genera una respuesta cuando el usuario solicita una recomendación
// de proyecto basada en una necesidad o área específica.
export function getRecommendationResponse(

  message

) {

  // Normaliza el mensaje para facilitar la detección de intenciones.
  const normalizedMessage =

    normalizeText(message);

  if (!normalizedMessage) {

    return null;

  }

  // Identifica el tipo de recomendación solicitada.
  const recommendationIntent =

    detectRecommendationIntent(

      normalizedMessage

    );

  if (!recommendationIntent) {

    return null;

  }

  // Obtiene todos los proyectos disponibles.
  const projects =

    getProjects();

  // Informa si todavía no existen proyectos cargados.
  if (!projects.length) {

    return {

      answer:

        "Los proyectos todavía no están disponibles 😅.",

      suggestions: [

        "herramientas",

        "github",

        "contacto"

      ]

    };

  }

  // Ordena los proyectos según qué tan bien coinciden
  // con la intención de recomendación detectada.
  const rankedProjects =

    rankRecommendedProjects(

      projects,

      recommendationIntent

    );

  // Obtiene el proyecto con la puntuación más alta.
  const bestResult =

    rankedProjects[0];

  // Si ningún proyecto tiene una coincidencia útil,
  // genera una respuesta alternativa.
  if (

    !bestResult ||

    bestResult.score <= 0

  ) {

    return buildNoRecommendationResponse(

      recommendationIntent

    );

  }

  // Construye la respuesta utilizando el mejor resultado
  // y una posible alternativa.
  return buildRecommendationResponse(

    bestResult,

    rankedProjects[1] || null,

    recommendationIntent

  );

}

// Detecta el área o contexto para el cual el usuario
// está solicitando una recomendación.
function detectRecommendationIntent(

  message

) {

  // Define las diferentes intenciones de recomendación
  // y las tecnologías/categorías asociadas a cada una.
  const intents = [

    {

      id: "frontend",

      label: "Frontend",

      patterns: [

        "recomiendame un proyecto frontend",

        "quiero ver algo frontend",

        "proyecto de interfaces",

        "algo con html",

        "algo con css",

        "algo con javascript",

        "proyecto web"

      ],

      technologies: [

        "html",

        "css",

        "javascript",

        "bootstrap",

        "tailwind",

        "react"

      ],

      categories: [

        "web",

        "frontend"

      ]

    },

    {

      id: "backend",

      label: "Backend",

      patterns: [

        "recomiendame un proyecto backend",

        "algo con api",

        "algo con base de datos",

        "proyecto de servidor",

        "algo con mysql",

        "algo con node",

        "algo con php"

      ],

      technologies: [

        "node",

        "node.js",

        "express",

        "mysql",

        "php",

        "laravel",

        "sqlite",

        "api"

      ],

      categories: [

        "backend",

        "full stack",

        "fullstack"

      ]

    },

    {

      id: "iot",

      label: "IoT y hardware",

      patterns: [

        "recomiendame algo de iot",

        "proyecto de hardware",

        "algo con arduino",

        "algo con sensores",

        "algo de automatizacion",

        "sistemas embebidos"

      ],

      technologies: [

        "arduino",

        "esp32",

        "c++",

        "iot",

        "sensores"

      ],

      categories: [

        "iot",

        "hardware",

        "automatizacion"

      ]

    },

    {

      id: "recruiter",

      label: "entrevista o reclutamiento",

      patterns: [

        "que proyecto deberia ver primero",

        "que proyecto recomiendas para una entrevista",

        "que proyecto recomendarias para una entrevista",

        "que proyecto mostrarias en una entrevista",

        "cual proyecto mostrarias en una entrevista",

        "que mostrarias en una entrevista",

        "que proyecto mostrarias primero",

        "que proyecto presentarias en una entrevista",

        "cual presentarias en una entrevista",

        "mejor proyecto para un reclutador",

        "mejor proyecto para una entrevista",

        "proyecto para entrevista",

        "cual representa mejor a miguel",

        "cual demuestra mejor tu experiencia",

        "cual demuestra mas experiencia"

      ],

      technologies: [],

      categories: []

    },

    {

      id: "general",

      label: "recomendación general",

      patterns: [

        "recomiendame un proyecto",

        "que proyecto recomiendas",

        "cual deberia ver",

        "elige un proyecto",

        "muestrame el mejor"

      ],

      technologies: [],

      categories: []

    }

  ];

  // Busca la primera intención cuyos patrones coincidan
  // con el mensaje normalizado.
  return (

    intents.find(intent =>

      intent.patterns.some(pattern =>

        message.includes(

          normalizeText(pattern)

        )

      )

    ) || null

  );

}

// Ordena los proyectos de acuerdo con su puntuación
// de recomendación para la intención detectada.
function rankRecommendedProjects(

  projects,

  intent

) {

  return projects

    .map(project => ({

      project,

      // Calcula qué tan compatible es el proyecto
      // con la intención solicitada.
      score:

        calculateRecommendationScore(

          project,

          intent

        ),

      // Obtiene las razones que explican la recomendación.
      reasons:

        getRecommendationReasons(

          project,

          intent

        )

    }))

    // Ordena los resultados desde la puntuación más alta
    // hasta la más baja.
    .sort(

      (firstResult, secondResult) =>

        secondResult.score -

        firstResult.score

    );

}

// Calcula la puntuación de un proyecto considerando
// complejidad, tecnologías, categoría, enlaces y presentación.
function calculateRecommendationScore(

  project,

  intent

) {

  // Utiliza la complejidad técnica como puntuación base.
  let score =

    calculateComplexityScore(

      project

    );

  // Obtiene un texto unificado con la información
  // relevante del proyecto.
  const searchableText =

    getProjectSearchableText(

      project

    );

  // Agrega puntos por cada tecnología relacionada
  // con la intención detectada.
  intent.technologies.forEach(

    technology => {

      if (

        searchableText.includes(

          normalizeText(technology)

        )

      ) {

        score += 5;

      }

    }

  );

  // Agrega puntos cuando la categoría del proyecto
  // coincide con la categoría solicitada.
  intent.categories.forEach(

    category => {

      const normalizedCategory =

        normalizeText(

          project.categoria || ""

        );

      if (

        normalizedCategory.includes(

          normalizeText(category)

        )

      ) {

        score += 7;

      }

    }

  );

  // Obtiene el stack del proyecto para considerar
  // la cantidad de tecnologías disponibles.
  const stack =

    Array.isArray(project.stack)

      ? project.stack

      : [];

  score += stack.length;

  // Agrega puntuación si existe una demostración pública.
  if (hasValidLink(project.demo)) {

    score += 3;

  }

  // Agrega puntuación si existe un repositorio disponible.
  if (hasValidLink(project.codigo)) {

    score += 3;

  }

  // Agrega puntuación por contar con una imagen de portada.
  if (project.imagenPortada) {

    score += 1;

  }

  // Para recomendaciones generales o relacionadas con
  // entrevistas, también considera criterios profesionales.
  if (

    intent.id === "recruiter" ||

    intent.id === "general"

  ) {

    score += getProfessionalScore(

      project

    );

  }

  return score;

}

// Calcula factores adicionales relacionados con la
// presentación profesional de un proyecto.
function getProfessionalScore(

  project

) {

  let score = 0;

  // Valora una descripción larga y suficientemente desarrollada.
  if (

    project.descripcionLarga &&

    project.descripcionLarga.length >= 100

  ) {

    score += 3;

  }

  // Considera hasta tres elementos multimedia.
  if (

    Array.isArray(project.media)

  ) {

    score += Math.min(

      project.media.length,

      3

    );

  }

  // Valora la disponibilidad de una demostración pública.
  if (hasValidLink(project.demo)) {

    score += 3;

  }

  // Valora la disponibilidad del código fuente.
  if (hasValidLink(project.codigo)) {

    score += 3;

  }

  return score;

}

// Genera una lista de razones que explican por qué
// un proyecto coincide con la recomendación solicitada.
function getRecommendationReasons(

  project,

  intent

) {

  const reasons = [];

  // Obtiene el contenido normalizado que será utilizado
  // para comparar las tecnologías solicitadas.
  const searchableText =

    getProjectSearchableText(

      project

    );

  // Identifica las tecnologías de la intención
  // que aparecen dentro del proyecto.
  const matchingTechnologies =

    intent.technologies.filter(

      technology =>

        searchableText.includes(

          normalizeText(technology)

        )

    );

  // Agrega las tecnologías coincidentes como una razón.
  if (matchingTechnologies.length) {

    reasons.push(

      `Tecnologías relacionadas: ${matchingTechnologies.join(", ")}`

    );

  }

  // Comprueba si la categoría del proyecto coincide
  // con alguna de las categorías solicitadas.
  const matchesCategory =

    intent.categories.some(category =>

      normalizeText(

        project.categoria || ""

      ).includes(

        normalizeText(category)

      )

    );

  // Agrega la categoría como razón cuando existe coincidencia.
  if (matchesCategory) {

    reasons.push(

      `Categoría relacionada: ${project.categoria}`

    );

  }

  // Indica que el proyecto cuenta con una demostración pública.
  if (hasValidLink(project.demo)) {

    reasons.push(

      "Tiene demostración pública"

    );

  }

  // Indica que el proyecto cuenta con un repositorio disponible.
  if (hasValidLink(project.codigo)) {

    reasons.push(

      "Tiene repositorio disponible"

    );

  }

  // Para recomendaciones generales o de entrevista,
  // utiliza una explicación genérica cuando no hubo
  // otras coincidencias específicas.
  if (

    !reasons.length &&

    (

      intent.id === "general" ||

      intent.id === "recruiter"

    )

  ) {

    reasons.push(

      "Combina nivel técnico, presentación y evidencia del resultado"

    );

  }

  return reasons;

}

// Construye la respuesta final mostrando el proyecto recomendado,
// sus razones y una posible alternativa.
function buildRecommendationResponse(

  bestResult,

  alternativeResult,

  intent

) {

  // Obtiene el proyecto asociado al mejor resultado.
  const project =

    bestResult.project;

  // Guarda el proyecto recomendado dentro del contexto
  // para permitir consultas posteriores.
  saveRecommendationContext(

    project,

    bestResult

  );

  return {

    answer: `

      Para una búsqueda de

      <strong>${intent.label}</strong>,

      te recomiendo:

      <br><br>

      <strong>${project.titulo}</strong>

      <br><br>

      ${bestResult.reasons.length

        ? bestResult.reasons

          .map(

            reason =>

              `• ${reason}`

          )

          .join("<br>")

        : "Es la opción con mejor coincidencia general."

      }

      ${alternativeResult &&

        alternativeResult.score > 0

        ? `

            <br><br>

            Como segunda alternativa puedes revisar

            <strong>${alternativeResult.project.titulo}</strong>.

          `

        : ""

      }

    `,

    projects: [

      project

    ],

    suggestions: [

      {

        label: "Abrir recomendado",

        value: project.id,

        type: "project"

      },

      "¿por qué?",

      "qué tecnologías usa"

    ]

  };

}

// Guarda en el contexto del chatbot la información
// relacionada con la recomendación realizada.
function saveRecommendationContext(

  project,

  result

) {

  chatbotContext.lastTopic =

    "project-recommendation";

  chatbotContext.lastProject =

    project;

  chatbotContext.lastMentionedProject =

    project;

  chatbotContext.lastRecommendedProject =

    project;

  chatbotContext.lastProjects = [

    project

  ];

  chatbotContext.lastProjectsShown = [

    project

  ];

  // Conserva información adicional de la recomendación
  // para poder utilizarla en interacciones posteriores.
  chatbotContext.recommendationContext = {

    project,

    score: result.score,

    reasons: result.reasons

  };

}

// Construye una respuesta cuando no se encuentra
// una coincidencia directa para la recomendación solicitada.
function buildNoRecommendationResponse(

  intent

) {

  return {

    answer: `

      No encontré un proyecto que coincida

      directamente con

      <strong>${intent.label}</strong> 😅.

      <br><br>

      Puedo mostrarte los proyectos disponibles

      o recomendar el que tenga mayor nivel técnico.

    `,

    suggestions: [

      "proyectos",

      "proyecto más completo",

      "contacto"

    ]

  };

}

// Construye un texto unificado con los datos principales
// de un proyecto para realizar búsquedas y comparaciones.
function getProjectSearchableText(

  project

) {

  const values = [

    project.id,

    project.titulo,

    project.categoria,

    project.nivel,

    project.descripcionCorta,

    project.descripcionLarga,

    ...(Array.isArray(project.stack)

      ? project.stack

      : [])

  ];

  // Normaliza y combina los valores disponibles
  // en una sola cadena de búsqueda.
  return normalizeText(

    values

      .filter(Boolean)

      .join(" ")

  );

}

// Comprueba si un enlace existe y no utiliza "#"
// como valor de enlace vacío o provisional.
function hasValidLink(link) {

  return Boolean(

    link &&

    link !== "#"

  );

}