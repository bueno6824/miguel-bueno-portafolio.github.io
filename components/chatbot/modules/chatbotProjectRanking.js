import {
  // Obtiene la lista de proyectos disponible para el chatbot.
  getProjects
} from "./chatbotProjects.js";

import {
  // Permite guardar información sobre el proyecto
  // seleccionado y el estado actual de la conversación.
  chatbotContext
} from "./chatbotState.js";

import {
  // Normaliza los mensajes para facilitar
  // la detección de patrones.
  normalizeText
} from "./chatbotUtils.js";

import {
  // Calcula el nivel de complejidad de un proyecto
  // para utilizarlo como parte de las puntuaciones.
  calculateComplexityScore
} from "./chatbotAnalysis.js";

/* ==============================
   PROJECT RANKING
============================== */

// Analiza el mensaje del usuario para determinar
// si está solicitando identificar algún proyecto
// mediante un criterio de clasificación.
export function getProjectRankingResponse(
  message
) {

  // Normaliza el mensaje antes de analizarlo.
  const normalizedMessage =
    normalizeText(message);

  // Si el mensaje está vacío, no existe
  // ninguna consulta que procesar.
  if (!normalizedMessage) {
    return null;
  }

  // Detecta el tipo de clasificación solicitado
  // por el usuario.
  const rankingType =
    detectRankingType(
      normalizedMessage
    );

  // Si no se reconoce ningún tipo de clasificación,
  // permite que otros módulos procesen el mensaje.
  if (!rankingType) {
    return null;
  }

  // Obtiene todos los proyectos disponibles.
  const projects =
    getProjects();

  // Si no existen proyectos disponibles,
  // devuelve una respuesta informativa.
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

  // Clasifica los proyectos de acuerdo
  // con el criterio detectado.
  const rankedResults =
    rankProjects(
      projects,
      rankingType
    );

  // Si no se obtuvieron resultados,
  // no genera una respuesta de ranking.
  if (!rankedResults.length) {
    return null;
  }

  // Construye la respuesta final utilizando
  // los resultados clasificados.
  return buildRankingResponse(
    rankedResults,
    rankingType
  );
}


// Detecta qué tipo de clasificación está solicitando
// el usuario mediante patrones de texto.
function detectRankingType(message) {

  // Define los diferentes criterios de clasificación
  // disponibles para los proyectos.
  const rankingTypes = [
    {
      // Identificador utilizado internamente
      // para calcular la puntuación.
      id: "complete",

      // Nombre mostrado al usuario.
      label:
        "más completo",

      // Expresiones que activan este criterio.
      patterns: [
        "proyecto mas completo",
        "cual es el mas completo",
        "proyecto mas integral",
        "proyecto con mas elementos",
        "cual tiene mas cosas"
      ]
    },

    {
      // Identificador para el criterio profesional.
      id: "professional",

      // Nombre mostrado al usuario.
      label:
        "más profesional",

      // Patrones relacionados con este criterio.
      patterns: [
        "proyecto mas profesional",
        "cual se ve mas profesional",
        "mejor para una entrevista",
        "cual mostrarias primero",
        "mejor presentacion profesional"
      ]
    },

    {
      // Identificador para el criterio de documentación.
      id: "documented",

      // Nombre mostrado al usuario.
      label:
        "mejor documentado",

      // Patrones relacionados con documentación.
      patterns: [
        "mejor documentado",
        "proyecto con mejor documentacion",
        "cual tiene mas documentacion",
        "proyecto mejor explicado"
      ]
    },

    {
      // Identificador para el criterio de tecnologías.
      id: "technologies",

      // Nombre mostrado al usuario.
      label:
        "con más tecnologías",

      // Patrones relacionados con el tamaño del stack.
      patterns: [
        "cual tiene mas tecnologias",
        "proyecto con mas tecnologias",
        "cual usa mas herramientas",
        "stack mas grande"
      ]
    },

    {
      // Identificador para el criterio multimedia.
      id: "media",

      // Nombre mostrado al usuario.
      label:
        "con más contenido multimedia",

      // Patrones relacionados con imágenes,
      // videos y evidencia visual.
      patterns: [
        "mas contenido multimedia",
        "mas imagenes",
        "mas videos",
        "mejor evidencia visual",
        "proyecto con mas capturas"
      ]
    }
  ];

  // Busca el primer criterio cuyos patrones
  // coincidan con el mensaje recibido.
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


// Ordena los proyectos de acuerdo con la puntuación
// calculada para el criterio seleccionado.
function rankProjects(
  projects,
  rankingType
) {
  return projects
    // Asigna a cada proyecto su puntuación correspondiente.
    .map(project => ({
      project,

      score:
        calculateRankingScore(
          project,
          rankingType.id
        )
    }))

    // Ordena los resultados de mayor a menor puntuación.
    .sort(
      (firstResult, secondResult) =>
        secondResult.score -
        firstResult.score
    );
}


// Calcula la puntuación de un proyecto según
// el criterio de clasificación seleccionado.
function calculateRankingScore(
  project,
  rankingType
) {

  // Selecciona la fórmula correspondiente
  // al tipo de ranking solicitado.
  switch (rankingType) {

    // Calcula la puntuación de proyecto más completo.
    case "complete":
      return calculateCompleteScore(
        project
      );

    // Calcula la puntuación orientada
    // a presentación profesional.
    case "professional":
      return calculateProfessionalScore(
        project
      );

    // Calcula la puntuación relacionada
    // con la cantidad de documentación.
    case "documented":
      return calculateDocumentationScore(
        project
      );

    // Utiliza la cantidad de tecnologías
    // como puntuación del proyecto.
    case "technologies":
      return getProjectStack(
        project
      ).length;

    // Utiliza la cantidad de recursos multimedia
    // como puntuación del proyecto.
    case "media":
      return getMediaCount(
        project
      );

    // Si el criterio no es reconocido,
    // devuelve una puntuación de cero.
    default:
      return 0;
  }
}


// Calcula la puntuación para determinar
// qué tan completo es un proyecto.
function calculateCompleteScore(
  project
) {

  // Comienza con la puntuación de complejidad.
  let score =
    calculateComplexityScore(
      project
    );

  // Añade puntos según la cantidad de tecnologías.
  score +=
    getProjectStack(project).length * 2;

  // Añade la cantidad de contenido multimedia.
  score +=
    getMediaCount(project);

  // Una demo válida aumenta la puntuación.
  if (hasValidLink(project.demo)) {
    score += 3;
  }

  // Un repositorio válido aumenta la puntuación.
  if (hasValidLink(project.codigo)) {
    score += 3;
  }

  // Añade puntuación si existe una descripción corta.
  if (project.descripcionCorta) {
    score += 1;
  }

  // Añade más puntuación si existe una descripción larga.
  if (project.descripcionLarga) {
    score += 2;
  }

  // Añade puntuación si existe una imagen de portada.
  if (project.imagenPortada) {
    score += 1;
  }

  // Devuelve la puntuación total del proyecto.
  return score;
}


// Calcula la puntuación orientada
// a la presentación profesional.
function calculateProfessionalScore(
  project
) {

  // Comienza con la puntuación de complejidad.
  let score =
    calculateComplexityScore(
      project
    );

  // Una demo pública aporta puntuación adicional.
  if (hasValidLink(project.demo)) {
    score += 5;
  }

  // Un repositorio público aporta puntuación adicional.
  if (hasValidLink(project.codigo)) {
    score += 5;
  }

  // La imagen de portada aporta evidencia visual.
  if (project.imagenPortada) {
    score += 2;
  }

  // Una descripción larga y suficientemente desarrollada
  // aporta puntuación adicional.
  if (
    project.descripcionLarga &&
    project.descripcionLarga.length >= 100
  ) {
    score += 3;
  }

  // Añade hasta tres puntos según la cantidad
  // de recursos multimedia.
  score += Math.min(
    getMediaCount(project),
    3
  );

  // Devuelve la puntuación profesional total.
  return score;
}


// Calcula la puntuación relacionada
// con la documentación disponible.
function calculateDocumentationScore(
  project
) {

  // Comienza la puntuación en cero.
  let score = 0;

  // La longitud de la descripción corta
  // contribuye a la puntuación.
  if (project.descripcionCorta) {
    score +=
      project.descripcionCorta.length;
  }

  // La longitud de la descripción larga
  // contribuye a la puntuación.
  if (project.descripcionLarga) {
    score +=
      project.descripcionLarga.length;
  }

  // Un repositorio válido aporta una cantidad
  // fija de puntos.
  if (hasValidLink(project.codigo)) {
    score += 50;
  }

  // La cantidad de tecnologías registradas
  // también contribuye a la puntuación.
  if (
    Array.isArray(project.stack)
  ) {
    score +=
      project.stack.length * 10;
  }

  // Devuelve la puntuación total de documentación.
  return score;
}


// Construye la respuesta que se mostrará
// después de clasificar los proyectos.
function buildRankingResponse(
  rankedResults,
  rankingType
) {

  // Obtiene el primer resultado de la clasificación.
  const bestResult =
    rankedResults[0];

  // Si no existe un resultado válido,
  // no genera ninguna respuesta.
  if (!bestResult) {
    return null;
  }

  // Obtiene el segundo resultado cuando existe.
  const secondResult =
    rankedResults[1] || null;

  // Obtiene el proyecto correspondiente
  // al resultado principal.
  const bestProject =
    bestResult.project;

  // Guarda el resultado dentro del contexto
  // para que pueda ser utilizado posteriormente.
  saveRankingContext(
    bestProject,
    rankedResults
  );

  // Devuelve la respuesta con la explicación
  // y las sugerencias correspondientes.
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

      ${secondResult
        ? `
            <br><br>

            Como segunda opción aparece
            <strong>${secondResult.project.titulo}</strong>.
          `
        : ""
      }
    `,

    // Mantiene el proyecto principal
    // como resultado de la respuesta.
    projects: [
      bestProject
    ],

    // Sugerencias disponibles después
    // de mostrar el resultado.
    suggestions: [
      "¿por qué?",
      "ábrelo",
      "qué tecnologías usa"
    ]
  };
}


// Genera una explicación basada en el criterio
// utilizado para clasificar el proyecto.
function getRankingExplanation(
  project,
  rankingType
) {

  // Obtiene la cantidad de tecnologías
  // utilizadas por el proyecto.
  const stackCount =
    getProjectStack(project).length;

  // Obtiene la cantidad de recursos multimedia.
  const mediaCount =
    getMediaCount(project);

  // Contiene las explicaciones correspondientes
  // a cada tipo de clasificación.
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

  // Devuelve la explicación correspondiente
  // al tipo de clasificación detectado.
  return (
    explanations[rankingType] ||
    "Es el proyecto que obtuvo la mejor coincidencia."
  );
}


// Guarda el resultado del ranking dentro
// del contexto global del chatbot.
function saveRankingContext(
  bestProject,
  rankedResults
) {

  // Indica que el tema actual corresponde
  // a una clasificación de proyectos.
  chatbotContext.lastTopic =
    "project-ranking";

  // Guarda el proyecto principal seleccionado.
  chatbotContext.lastProject =
    bestProject;

  // Guarda el proyecto como último proyecto mencionado.
  chatbotContext.lastMentionedProject =
    bestProject;

  // Guarda el proyecto como último recomendado.
  chatbotContext.lastRecommendedProject =
    bestProject;

  // Guarda todos los proyectos ordenados
  // según el ranking calculado.
  chatbotContext.lastProjects =
    rankedResults.map(
      result => result.project
    );

  // Guarda el proyecto principal como
  // el último proyecto mostrado.
  chatbotContext.lastProjectsShown = [
    bestProject
  ];
}


// Obtiene el stack tecnológico del proyecto.
// Si no existe un arreglo válido, devuelve un arreglo vacío.
function getProjectStack(project) {
  return Array.isArray(project?.stack)
    ? project.stack
    : [];
}


// Cuenta los recursos multimedia disponibles
// para un proyecto.
function getMediaCount(project) {

  // Si existe un arreglo de recursos multimedia,
  // utiliza su cantidad.
  if (Array.isArray(project?.media)) {
    return project.media.length;
  }

  // Si existe un arreglo de imágenes grandes,
  // utiliza su cantidad.
  if (
    Array.isArray(project?.imagenLarge)
  ) {
    return project.imagenLarge.length;
  }

  // Si existe una imagen de portada,
  // cuenta un recurso multimedia.
  return project?.imagenPortada
    ? 1
    : 0;
}


// Comprueba si un enlace existe
// y no corresponde al marcador "#".
function hasValidLink(link) {
  return Boolean(
    link &&
    link !== "#"
  );
}