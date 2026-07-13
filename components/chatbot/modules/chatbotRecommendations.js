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

export function getRecommendationResponse(
  message
) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  const recommendationIntent =
    detectRecommendationIntent(
      normalizedMessage
    );

  if (!recommendationIntent) {
    return null;
  }

  const projects =
    getProjects();

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

  const rankedProjects =
    rankRecommendedProjects(
      projects,
      recommendationIntent
    );

  const bestResult =
    rankedProjects[0];

  if (
    !bestResult ||
    bestResult.score <= 0
  ) {
    return buildNoRecommendationResponse(
      recommendationIntent
    );
  }

  return buildRecommendationResponse(
    bestResult,
    rankedProjects[1] || null,
    recommendationIntent
  );
}

function detectRecommendationIntent(
  message
) {
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

function rankRecommendedProjects(
  projects,
  intent
) {
  return projects
    .map(project => ({
      project,

      score:
        calculateRecommendationScore(
          project,
          intent
        ),

      reasons:
        getRecommendationReasons(
          project,
          intent
        )
    }))
    .sort(
      (firstResult, secondResult) =>
        secondResult.score -
        firstResult.score
    );
}

function calculateRecommendationScore(
  project,
  intent
) {
  let score =
    calculateComplexityScore(
      project
    );

  const searchableText =
    getProjectSearchableText(
      project
    );

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

  const stack =
    Array.isArray(project.stack)
      ? project.stack
      : [];

  score += stack.length;

  if (hasValidLink(project.demo)) {
    score += 3;
  }

  if (hasValidLink(project.codigo)) {
    score += 3;
  }

  if (project.imagenPortada) {
    score += 1;
  }

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

function getProfessionalScore(
  project
) {
  let score = 0;

  if (
    project.descripcionLarga &&
    project.descripcionLarga.length >= 100
  ) {
    score += 3;
  }

  if (
    Array.isArray(project.media)
  ) {
    score += Math.min(
      project.media.length,
      3
    );
  }

  if (hasValidLink(project.demo)) {
    score += 3;
  }

  if (hasValidLink(project.codigo)) {
    score += 3;
  }

  return score;
}

function getRecommendationReasons(
  project,
  intent
) {
  const reasons = [];

  const searchableText =
    getProjectSearchableText(
      project
    );

  const matchingTechnologies =
    intent.technologies.filter(
      technology =>
        searchableText.includes(
          normalizeText(technology)
        )
    );

  if (matchingTechnologies.length) {
    reasons.push(
      `Tecnologías relacionadas: ${matchingTechnologies.join(", ")}`
    );
  }

  const matchesCategory =
    intent.categories.some(category =>
      normalizeText(
        project.categoria || ""
      ).includes(
        normalizeText(category)
      )
    );

  if (matchesCategory) {
    reasons.push(
      `Categoría relacionada: ${project.categoria}`
    );
  }

  if (hasValidLink(project.demo)) {
    reasons.push(
      "Tiene demostración pública"
    );
  }

  if (hasValidLink(project.codigo)) {
    reasons.push(
      "Tiene repositorio disponible"
    );
  }

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

function buildRecommendationResponse(
  bestResult,
  alternativeResult,
  intent
) {
  const project =
    bestResult.project;

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

      ${
        bestResult.reasons.length
          ? bestResult.reasons
              .map(
                reason =>
                  `• ${reason}`
              )
              .join("<br>")
          : "Es la opción con mejor coincidencia general."
      }

      ${
        alternativeResult &&
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

  chatbotContext.recommendationContext = {
    project,
    score: result.score,
    reasons: result.reasons
  };
}

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

  return normalizeText(
    values
      .filter(Boolean)
      .join(" ")
  );
}

function hasValidLink(link) {
  return Boolean(
    link &&
    link !== "#"
  );
}

