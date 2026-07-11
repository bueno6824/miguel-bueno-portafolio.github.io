import {
  analyzeProjects,
  getTechnologyCount,
  getCategoryCount,
  calculateComplexityScore
} from "./chatbotAnalysis.js";

import {
  normalizeText
} from "./chatbotUtils.js";

import {
  getSmartSuggestions
} from "./chatbotSuggestions.js";

export function getStatisticsResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  const analysis =
    analyzeProjects();

  if (!analysis.totalProjects) {
    return {
      answer:
        "Todavía no pude cargar la información de los proyectos 😅.",

      suggestions: [
        "proyectos",
        "herramientas",
        "contacto"
      ]
    };
  }

  return (
    getTotalProjectsResponse(
      normalizedMessage,
      analysis
    ) ||
    getTechnologyCountResponse(
      normalizedMessage,
      analysis
    ) ||
    getCategoryCountResponse(
      normalizedMessage,
      analysis
    ) ||
    getLatestProjectResponse(
      normalizedMessage,
      analysis
    ) ||
    getOldestProjectResponse(
      normalizedMessage,
      analysis
    ) ||
    getMostTechnologiesResponse(
      normalizedMessage,
      analysis
    ) ||
    getMostComplexResponse(
      normalizedMessage,
      analysis
    ) ||
    null
  );
}

function getTotalProjectsResponse(
  message,
  analysis
) {
  const patterns = [
    "cuantos proyectos tienes",
    "cuántos proyectos tienes",
    "cuantos proyectos hay",
    "cuántos proyectos hay",
    "numero de proyectos",
    "número de proyectos",
    "total de proyectos"
  ];

  const matches =
    patterns.some(pattern =>
      message.includes(
        normalizeText(pattern)
      )
    );

  if (!matches) {
    return null;
  }

  const total =
    analysis.totalProjects;

  return {
    answer: `
      Actualmente tengo
      <strong>${total}</strong>
      ${total === 1
        ? "proyecto"
        : "proyectos"}
      registrados en el portafolio.
    `,

    suggestions: [
      "ver proyectos",
      "proyecto más reciente",
      "proyecto más complejo"
    ]
  };
}

function getTechnologyCountResponse(
  message,
  analysis
) {
  const technologies =
    Object.keys(
      analysis.technologies
    );

  const detectedTechnology =
    technologies.find(technology =>
      message.includes(
        normalizeText(technology)
      )
    );

  if (!detectedTechnology) {
    return null;
  }

  const count =
    getTechnologyCount(
      detectedTechnology
    );

  if (!count) {
    return null;
  }

  const asksForCount =
    message.includes("cuantos") ||
    message.includes("cuántos") ||
    message.includes("cantidad") ||
    message.includes("usan") ||
    message.includes("utilizan") ||
    message.includes("tienen");

  if (!asksForCount) {
    return null;
  }

  return {
    answer: `
      Hay
      <strong>${count}</strong>
      ${count === 1
        ? "proyecto"
        : "proyectos"}
      que ${count === 1
        ? "usa"
        : "usan"}
      <strong>${detectedTechnology}</strong>.
    `,

    suggestions:
      getSmartSuggestions(
        detectedTechnology
      )
  };
}

function getCategoryCountResponse(
  message,
  analysis
) {
  const categories =
    Object.keys(
      analysis.categories
    );

  const detectedCategory =
    categories.find(category =>
      message.includes(
        normalizeText(category)
      )
    );

  if (!detectedCategory) {
    return null;
  }

  const asksForCount =
    message.includes("cuantos") ||
    message.includes("cuántos") ||
    message.includes("cantidad") ||
    message.includes("son") ||
    message.includes("hay");

  if (!asksForCount) {
    return null;
  }

  const count =
    getCategoryCount(
      detectedCategory
    );

  return {
    answer: `
      Tengo
      <strong>${count}</strong>
      ${count === 1
        ? "proyecto"
        : "proyectos"}
      en la categoría
      <strong>${detectedCategory}</strong>.
    `,

    suggestions: [
      `proyectos ${detectedCategory}`,
      "proyectos",
      "contacto"
    ]
  };
}

function getLatestProjectResponse(
  message,
  analysis
) {
  const matches =
    message.includes(
      "proyecto mas reciente"
    ) ||
    message.includes(
      "proyecto más reciente"
    ) ||
    message.includes(
      "ultimo proyecto"
    ) ||
    message.includes(
      "último proyecto"
    ) ||
    message.includes(
      "proyecto nuevo"
    );

  if (!matches) {
    return null;
  }

  const project =
    analysis.latestProject;

  if (!project) {
    return null;
  }

  return {
    answer: `
      El proyecto más reciente es
      <strong>${project.titulo}</strong>,
      desarrollado en
      <strong>${project.año || "fecha no especificada"}</strong>.
    `,

    projects: [
      project
    ],

    suggestions: [
      "abrir proyecto",
      "proyecto más complejo",
      "ver proyectos"
    ]
  };
}

function getOldestProjectResponse(
  message,
  analysis
) {
  const matches =
    message.includes(
      "primer proyecto"
    ) ||
    message.includes(
      "proyecto mas antiguo"
    ) ||
    message.includes(
      "proyecto más antiguo"
    ) ||
    message.includes(
      "proyecto mas viejo"
    ) ||
    message.includes(
      "proyecto más viejo"
    );

  if (!matches) {
    return null;
  }

  const project =
    analysis.oldestProject;

  if (!project) {
    return null;
  }

  return {
    answer: `
      El proyecto más antiguo registrado es
      <strong>${project.titulo}</strong>,
      correspondiente al año
      <strong>${project.año || "no especificado"}</strong>.
    `,

    projects: [
      project
    ],

    suggestions: [
      "abrir proyecto",
      "proyecto más reciente",
      "ver proyectos"
    ]
  };
}

function getMostTechnologiesResponse(
  message,
  analysis
) {
  const matches =
    message.includes(
      "usa mas tecnologias"
    ) ||
    message.includes(
      "usa más tecnologías"
    ) ||
    message.includes(
      "tiene mas tecnologias"
    ) ||
    message.includes(
      "tiene más tecnologías"
    ) ||
    message.includes(
      "mas tecnologias"
    ) ||
    message.includes(
      "más tecnologías"
    );

  if (!matches) {
    return null;
  }

  const project =
    analysis.mostTechnologiesProject;

  if (!project) {
    return null;
  }

  const totalTechnologies =
    Array.isArray(project.stack)
      ? project.stack.length
      : 0;

  return {
    answer: `
      El proyecto que utiliza más tecnologías es
      <strong>${project.titulo}</strong>,
      con
      <strong>${totalTechnologies}</strong>
      tecnologías principales.
    `,

    projects: [
      project
    ],

    suggestions: [
      "abrir proyecto",
      "proyecto más complejo",
      "ver proyectos"
    ]
  };
}

function getMostComplexResponse(
  message,
  analysis
) {
  const matches =
    message.includes(
      "proyecto mas complejo"
    ) ||
    message.includes(
      "proyecto más complejo"
    ) ||
    message.includes(
      "proyecto mas dificil"
    ) ||
    message.includes(
      "proyecto más difícil"
    ) ||
    message.includes(
      "cual fue el mas dificil"
    ) ||
    message.includes(
      "cuál fue el más difícil"
    );

  if (!matches) {
    return null;
  }

  const project =
    analysis.mostComplexProject;

  if (!project) {
    return null;
  }

  const score =
    calculateComplexityScore(
      project
    );

  return {
    answer: `
      Según el análisis del stack, nivel, categoría,
      recursos multimedia y enlaces disponibles,
      el proyecto más complejo es
      <strong>${project.titulo}</strong>.

      <br><br>

      Su puntuación estimada de complejidad es
      <strong>${score}</strong>.
    `,

    projects: [
      project
    ],

    suggestions: [
      "abrir proyecto",
      "proyecto con más tecnologías",
      "ver proyectos"
    ]
  };
}

