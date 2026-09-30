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

// Genera respuestas relacionadas con estadísticas y análisis de los proyectos.
export function getStatisticsResponse(message) {
  // Normaliza el mensaje recibido para facilitar su análisis.
  const normalizedMessage =
    normalizeText(message);

  // Ignora mensajes vacíos.
  if (!normalizedMessage) {
    return null;
  }

  // Obtiene el análisis general de los proyectos.
  const analysis =
    analyzeProjects();

  // Verifica que existan proyectos disponibles para analizar.
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

  // Intenta resolver el mensaje utilizando los diferentes tipos de estadísticas disponibles.
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

// Genera una respuesta indicando cuántos proyectos existen en el portafolio.
function getTotalProjectsResponse(
  message,
  analysis
) {
  // Patrones utilizados para detectar preguntas sobre el total de proyectos.
  const patterns = [
    "cuantos proyectos tienes",
    "cuántos proyectos tienes",
    "cuantos proyectos hay",
    "cuántos proyectos hay",
    "numero de proyectos",
    "número de proyectos",
    "total de proyectos"
  ];

  // Comprueba si el mensaje coincide con alguno de los patrones.
  const matches =
    patterns.some(pattern =>
      message.includes(
        normalizeText(pattern)
      )
    );

  // Si no se detecta una pregunta sobre el total, no genera respuesta.
  if (!matches) {
    return null;
  }

  // Obtiene el número total de proyectos analizados.
  const total =
    analysis.totalProjects;

  // Devuelve la respuesta con el total de proyectos.
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

// Genera una respuesta indicando cuántos proyectos utilizan una tecnología específica.
function getTechnologyCountResponse(
  message,
  analysis
) {
  // Obtiene las tecnologías registradas en el análisis.
  const technologies =
    Object.keys(
      analysis.technologies
    );

  // Busca una tecnología mencionada dentro del mensaje.
  const detectedTechnology =
    technologies.find(technology =>
      message.includes(
        normalizeText(technology)
      )
    );

  // Si no se detecta ninguna tecnología, no genera respuesta.
  if (!detectedTechnology) {
    return null;
  }

  // Obtiene la cantidad de proyectos que utilizan la tecnología detectada.
  const count =
    getTechnologyCount(
      detectedTechnology
    );

  // Si la tecnología no tiene proyectos asociados, no genera respuesta.
  if (!count) {
    return null;
  }

  // Detecta si el usuario está preguntando por una cantidad.
  const asksForCount =
    message.includes("cuantos") ||
    message.includes("cuántos") ||
    message.includes("cantidad") ||
    message.includes("usan") ||
    message.includes("utilizan") ||
    message.includes("tienen");

  // Si el mensaje no solicita una cantidad, no genera respuesta.
  if (!asksForCount) {
    return null;
  }

  // Devuelve la cantidad de proyectos que utilizan la tecnología.
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

// Genera una respuesta indicando cuántos proyectos pertenecen a una categoría.
function getCategoryCountResponse(
  message,
  analysis
) {
  // Obtiene las categorías registradas en el análisis.
  const categories =
    Object.keys(
      analysis.categories
    );

  // Busca una categoría mencionada dentro del mensaje.
  const detectedCategory =
    categories.find(category =>
      message.includes(
        normalizeText(category)
      )
    );

  // Si no se detecta ninguna categoría, no genera respuesta.
  if (!detectedCategory) {
    return null;
  }

  // Detecta si el usuario está preguntando por una cantidad.
  const asksForCount =
    message.includes("cuantos") ||
    message.includes("cuántos") ||
    message.includes("cantidad") ||
    message.includes("son") ||
    message.includes("hay");

  // Si el mensaje no solicita una cantidad, no genera respuesta.
  if (!asksForCount) {
    return null;
  }

  // Obtiene la cantidad de proyectos dentro de la categoría detectada.
  const count =
    getCategoryCount(
      detectedCategory
    );

  // Devuelve la cantidad de proyectos de la categoría.
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

// Genera una respuesta sobre el proyecto más reciente.
function getLatestProjectResponse(
  message,
  analysis
) {
  // Detecta diferentes formas de preguntar por el proyecto más reciente.
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

  // Si no se solicita el proyecto más reciente, no genera respuesta.
  if (!matches) {
    return null;
  }

  // Obtiene el proyecto más reciente del análisis.
  const project =
    analysis.latestProject;

  // Verifica que exista un proyecto reciente.
  if (!project) {
    return null;
  }

  // Devuelve la información básica del proyecto más reciente.
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

// Genera una respuesta sobre el proyecto más antiguo.
function getOldestProjectResponse(
  message,
  analysis
) {
  // Detecta diferentes formas de preguntar por el proyecto más antiguo.
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

  // Si no se solicita el proyecto más antiguo, no genera respuesta.
  if (!matches) {
    return null;
  }

  // Obtiene el proyecto más antiguo del análisis.
  const project =
    analysis.oldestProject;

  // Verifica que exista un proyecto antiguo disponible.
  if (!project) {
    return null;
  }

  // Devuelve la información básica del proyecto más antiguo.
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

// Genera una respuesta sobre el proyecto que utiliza más tecnologías.
function getMostTechnologiesResponse(
  message,
  analysis
) {
  // Detecta diferentes formas de preguntar qué proyecto utiliza más tecnologías.
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

  // Si no se solicita esta estadística, no genera respuesta.
  if (!matches) {
    return null;
  }

  // Obtiene el proyecto con mayor cantidad de tecnologías.
  const project =
    analysis.mostTechnologiesProject;

  // Verifica que exista un proyecto disponible.
  if (!project) {
    return null;
  }

  // Calcula cuántas tecnologías principales tiene el proyecto.
  const totalTechnologies =
    Array.isArray(project.stack)
      ? project.stack.length
      : 0;

  // Devuelve la información del proyecto con más tecnologías.
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

// Genera una respuesta sobre el proyecto con mayor complejidad estimada.
function getMostComplexResponse(
  message,
  analysis
) {
  // Detecta diferentes formas de preguntar por el proyecto más complejo.
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

  // Si no se solicita el proyecto más complejo, no genera respuesta.
  if (!matches) {
    return null;
  }

  // Obtiene el proyecto identificado como más complejo por el análisis.
  const project =
    analysis.mostComplexProject;

  // Verifica que exista un proyecto disponible.
  if (!project) {
    return null;
  }

  // Calcula la puntuación estimada de complejidad del proyecto.
  const score =
    calculateComplexityScore(
      project
    );

  // Devuelve la explicación y la puntuación calculada.
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