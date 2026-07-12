import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText
} from "./chatbotUtils.js";


/* ==============================
   PROJECT REFERENCE RESOLVER
============================== */

export function resolveProjectReference(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  /*
   * Proyecto ganador de una comparación.
   */

  if (
    matchesAny(normalizedMessage, [
      "el ganador",
      "proyecto ganador",
      "abre el ganador",
      "muestra el ganador"
    ])
  ) {
    return (
      chatbotContext.comparisonWinner ||
      null
    );
  }

  /*
   * Proyecto recomendado.
   */

  if (
    matchesAny(normalizedMessage, [
      "el recomendado",
      "proyecto recomendado",
      "abre el recomendado",
      "muestra el recomendado"
    ])
  ) {
    return (
      chatbotContext.lastRecommendedProject ||
      null
    );
  }

  /*
   * Primer proyecto del contexto.
   */

  if (
    matchesAny(normalizedMessage, [
      "el primero",
      "primer proyecto",
      "proyecto uno",
      "proyecto 1",
      "abre el primero"
    ])
  ) {
    return getContextProject(0);
  }

  /*
   * Segundo proyecto del contexto.
   */

  if (
    matchesAny(normalizedMessage, [
      "el segundo",
      "segundo proyecto",
      "proyecto dos",
      "proyecto 2",
      "abre el segundo"
    ])
  ) {
    return getContextProject(1);
  }

  /*
   * El otro proyecto de una comparación.
   */

console.log(
  "Mensaje memoria:",
  normalizedMessage
);

console.log(
  "comparisonProjects:",
  chatbotContext.comparisonProjects
);

console.log(
  "lastProjects:",
  chatbotContext.lastProjects
);

console.log(
  "lastMentionedProject:",
  chatbotContext.lastMentionedProject
);

  if (
    matchesAny(normalizedMessage, [
      "el otro",
      "otro proyecto",
      "abre el otro",
      "muestra el otro"
    ])
  ) {
    return getOtherComparisonProject();
  }

  /*
   * Referencias genéricas:
   * ese, este, ábrelo, muéstralo...
   */
   
   if (
  matchesAny(normalizedMessage, [
    "el ultimo",
    "ultimo proyecto",
    "abre el ultimo",
    "muestra el ultimo",
    "quiero el ultimo"
  ])
) {
  return getLastShownProject();
}

if (
  matchesAny(normalizedMessage, [
    "el anterior",
    "proyecto anterior",
    "abre el anterior",
    "ahora el anterior",
    "muestra el anterior"
  ])
) {
  return getAdjacentProject(-1);
}

if (
  matchesAny(normalizedMessage, [
    "el siguiente",
    "proyecto siguiente",
    "abre el siguiente",
    "ahora el siguiente",
    "muestra el siguiente"
  ])
) {
  return getAdjacentProject(1);
}

if (
  matchesAny(normalizedMessage, [
    "cualquiera",
    "abre cualquiera",
    "elige uno",
    "muestra cualquiera",
    "un proyecto cualquiera"
  ])
) {
  return getRandomContextProject();
}

  if (
  matchesAny(normalizedMessage, [
    "abre ese",
    "abre este",
    "abrelo",
    "abrelo otra vez",
    "muestralo",
    "quiero ese",
    "quiero este",
    "ese proyecto",
    "este proyecto",
    "ahora ese",
    "ahora este"
  ])
) {
  return (
    chatbotContext.lastSelectedProject ||
    chatbotContext.lastMentionedProject ||
    chatbotContext.lastProject ||
    chatbotContext.lastOpenedProject ||
    chatbotContext.lastRecommendedProject ||
    null
  );
}
  return null;
}


/* ==============================
   CONTEXT PROJECT
============================== */

function getContextProject(index) {
  const projects =
    Array.isArray(
      chatbotContext.lastProjects
    )
      ? chatbotContext.lastProjects
      : [];

  return projects[index] || null;
}

function getReferenceProjects() {
  const shownProjects =
    Array.isArray(
      chatbotContext.lastProjectsShown
    )
      ? chatbotContext.lastProjectsShown
      : [];

  if (shownProjects.length) {
    return shownProjects;
  }

  const comparisonProjects =
    Array.isArray(
      chatbotContext.comparisonProjects
    )
      ? chatbotContext.comparisonProjects
      : [];

  if (comparisonProjects.length) {
    return comparisonProjects;
  }

  const lastProjects =
    Array.isArray(
      chatbotContext.lastProjects
    )
      ? chatbotContext.lastProjects
      : [];

  return lastProjects;
}

function getLastShownProject() {
  const projects =
    getReferenceProjects();

  if (!projects.length) {
    return null;
  }

  return projects[
    projects.length - 1
  ];
}

function getAdjacentProject(direction) {
  const projects =
    getReferenceProjects();

  if (!projects.length) {
    return null;
  }

  const currentProject =
    chatbotContext.lastSelectedProject ||
    chatbotContext.lastMentionedProject ||
    chatbotContext.lastOpenedProject ||
    chatbotContext.lastProject;

  let currentIndex =
    projects.findIndex(project =>
      project.id ===
      currentProject?.id
    );

  if (currentIndex < 0) {
    currentIndex =
      chatbotContext.lastSelectedIndex;
  }

  if (currentIndex < 0) {
    return direction > 0
      ? projects[0]
      : projects[
          projects.length - 1
        ];
  }

  const targetIndex =
    currentIndex + direction;

  /*
   * Navegación circular:
   * después del último vuelve al primero,
   * antes del primero vuelve al último.
   */

  const normalizedIndex =
    (
      targetIndex +
      projects.length
    ) %
    projects.length;

  return projects[
    normalizedIndex
  ];
}

function getRandomContextProject() {
  const projects =
    getReferenceProjects();

  if (!projects.length) {
    return null;
  }

  const randomIndex =
    Math.floor(
      Math.random() *
      projects.length
    );

  return projects[
    randomIndex
  ];
}



/* ==============================
   OTHER COMPARISON PROJECT
============================== */

function getOtherComparisonProject() {
  const projects =
    getComparisonProjects();

  if (projects.length < 2) {
    return null;
  }

  const currentProject =
    chatbotContext.lastMentionedProject ||
    chatbotContext.lastProject ||
    chatbotContext.lastOpenedProject;

  if (!currentProject) {
    return projects[1];
  }

  const otherProject =
    projects.find(project =>
      project.id !== currentProject.id
    );

  return otherProject || projects[1];
}


/* ==============================
   COMPARISON PROJECTS
============================== */

function getComparisonProjects() {
  const comparisonProjects =
    Array.isArray(
      chatbotContext.comparisonProjects
    )
      ? chatbotContext.comparisonProjects
      : [];

  if (comparisonProjects.length >= 2) {
    return comparisonProjects.slice(0, 2);
  }

  const lastProjects =
    Array.isArray(
      chatbotContext.lastProjects
    )
      ? chatbotContext.lastProjects
      : [];

  if (lastProjects.length >= 2) {
    return lastProjects.slice(0, 2);
  }

  return [];
}


/* ==============================
   PATTERN MATCHING
============================== */

function matchesAny(message,patterns = []) {
  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}