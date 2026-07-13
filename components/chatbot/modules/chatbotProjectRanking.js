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

/* ==============================
   PROJECT RANKING
============================== */

export function getProjectRankingResponse(
  message
) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  const rankingType =
    detectRankingType(
      normalizedMessage
    );

  if (!rankingType) {
    return null;
  }

  const projects =
    getProjects();

  if (!projects.length) {
    return {
      answer:
        "Los proyectos todavía no están disponibles 😅.",

      suggestions: [
        "proyectos",
        "herramientas",
        "contacto"
      ]
    };
  }

  const rankedResults =
    rankProjects(
      projects,
      rankingType
    );

  if (!rankedResults.length) {
    return null;
  }

  return buildRankingResponse(
    rankedResults,
    rankingType
  );
}

function detectRankingType(message) {
  const rankingTypes = [
    {
      id: "complete",

      label:
        "más completo",

      patterns: [
        "proyecto mas completo",
        "cual es el mas completo",
        "proyecto mas integral",
        "proyecto con mas elementos",
        "cual tiene mas cosas"
      ]
    },

    {
      id: "professional",

      label:
        "más profesional",

      patterns: [
        "proyecto mas profesional",
        "cual se ve mas profesional",
        "mejor para una entrevista",
        "cual mostrarias primero",
        "mejor presentacion profesional"
      ]
    },

    {
      id: "documented",

      label:
        "mejor documentado",

      patterns: [
        "mejor documentado",
        "proyecto con mejor documentacion",
        "cual tiene mas documentacion",
        "proyecto mejor explicado"
      ]
    },

    {
      id: "technologies",

      label:
        "con más tecnologías",

      patterns: [
        "cual tiene mas tecnologias",
        "proyecto con mas tecnologias",
        "cual usa mas herramientas",
        "stack mas grande"
      ]
    },

    {
      id: "media",

      label:
        "con más contenido multimedia",

      patterns: [
        "mas contenido multimedia",
        "mas imagenes",
        "mas videos",
        "mejor evidencia visual",
        "proyecto con mas capturas"
      ]
    }
  ];

  return (
    rankingTypes.find(type =>
      type.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      )
    ) || null
  );
}

function rankProjects(
  projects,
  rankingType
) {
  return projects
    .map(project => ({
      project,

      score:
        calculateRankingScore(
          project,
          rankingType.id
        )
    }))
    .sort(
      (firstResult, secondResult) =>
        secondResult.score -
        firstResult.score
    );
}

function calculateRankingScore(
  project,
  rankingType
) {
  switch (rankingType) {
    case "complete":
      return calculateCompleteScore(
        project
      );

    case "professional":
      return calculateProfessionalScore(
        project
      );

    case "documented":
      return calculateDocumentationScore(
        project
      );

    case "technologies":
      return getProjectStack(
        project
      ).length;

    case "media":
      return getMediaCount(
        project
      );

    default:
      return 0;
  }
}

function calculateCompleteScore(
  project
) {
  let score =
    calculateComplexityScore(
      project
    );

  score +=
    getProjectStack(project).length * 2;

  score +=
    getMediaCount(project);

  if (hasValidLink(project.demo)) {
    score += 3;
  }

  if (hasValidLink(project.codigo)) {
    score += 3;
  }

  if (project.descripcionCorta) {
    score += 1;
  }

  if (project.descripcionLarga) {
    score += 2;
  }

  if (project.imagenPortada) {
    score += 1;
  }

  return score;
}

function calculateProfessionalScore(
  project
) {
  let score =
    calculateComplexityScore(
      project
    );

  if (hasValidLink(project.demo)) {
    score += 5;
  }

  if (hasValidLink(project.codigo)) {
    score += 5;
  }

  if (project.imagenPortada) {
    score += 2;
  }

  if (
    project.descripcionLarga &&
    project.descripcionLarga.length >= 100
  ) {
    score += 3;
  }

  score += Math.min(
    getMediaCount(project),
    3
  );

  return score;
}

function calculateDocumentationScore(
  project
) {
  let score = 0;

  if (project.descripcionCorta) {
    score +=
      project.descripcionCorta.length;
  }

  if (project.descripcionLarga) {
    score +=
      project.descripcionLarga.length;
  }

  if (hasValidLink(project.codigo)) {
    score += 50;
  }

  if (
    Array.isArray(project.stack)
  ) {
    score +=
      project.stack.length * 10;
  }

  return score;
}

function buildRankingResponse(
  rankedResults,
  rankingType
) {
  const bestResult =
    rankedResults[0];

  if (!bestResult) {
    return null;
  }

  const secondResult =
    rankedResults[1] || null;

  const bestProject =
    bestResult.project;

  saveRankingContext(
    bestProject,
    rankedResults
  );

  return {
    answer: `
      El proyecto
      <strong>${rankingType.label}</strong>
      es:

      <br><br>

      <strong>${bestProject.titulo}</strong>

      <br><br>

      ${getRankingExplanation(
        bestProject,
        rankingType.id
      )}

      ${
        secondResult
          ? `
            <br><br>

            Como segunda opción aparece
            <strong>${secondResult.project.titulo}</strong>.
          `
          : ""
      }
    `,

    projects: [
      bestProject
    ],

    suggestions: [
      "¿por qué?",
      "ábrelo",
      "qué tecnologías usa"
    ]
  };
}

function getRankingExplanation(
  project,
  rankingType
) {
  const stackCount =
    getProjectStack(project).length;

  const mediaCount =
    getMediaCount(project);

  const explanations = {
    complete: `
      Destaca por combinar
      <strong>${stackCount}</strong>
      tecnologías, contenido multimedia,
      descripción, código y demostración.
    `,

    professional: `
      Presenta una combinación sólida de
      complejidad, evidencia visual,
      repositorio y demostración pública.
    `,

    documented: `
      Cuenta con información descriptiva,
      stack registrado y recursos que permiten
      comprender mejor su desarrollo.
    `,

    technologies: `
      Tiene el stack más amplio, con
      <strong>${stackCount}</strong>
      tecnologías principales.
    `,

    media: `
      Cuenta con
      <strong>${mediaCount}</strong>
      recursos multimedia registrados.
    `
  };

  return (
    explanations[rankingType] ||
    "Es el proyecto que obtuvo la mejor coincidencia."
  );
}

function saveRankingContext(
  bestProject,
  rankedResults
) {
  chatbotContext.lastTopic =
    "project-ranking";

  chatbotContext.lastProject =
    bestProject;

  chatbotContext.lastMentionedProject =
    bestProject;

  chatbotContext.lastRecommendedProject =
    bestProject;

  chatbotContext.lastProjects =
    rankedResults.map(
      result => result.project
    );

  chatbotContext.lastProjectsShown = [
    bestProject
  ];
}

function getProjectStack(project) {
  return Array.isArray(project?.stack)
    ? project.stack
    : [];
}

function getMediaCount(project) {
  if (Array.isArray(project?.media)) {
    return project.media.length;
  }

  if (
    Array.isArray(project?.imagenLarge)
  ) {
    return project.imagenLarge.length;
  }

  return project?.imagenPortada
    ? 1
    : 0;
}

function hasValidLink(link) {
  return Boolean(
    link &&
    link !== "#"
  );
}

