import {
  getProjects
} from "../chatbotProjects.js";

import {
  chatbotContext
} from "../chatbotState.js";

import {
  normalizeText
} from "../chatbotUtils.js";

import {
  extractProjectIndexes,
  refersToPreviousProjects
} from "./comparisonDetector.js";

export function getProjectsForComparison(message) {
  const projects =
    getProjects();

  if (projects.length < 2) {
    return [];
  }

  const detectedProjects = [];

  /* ==============================
     IDS EXPLÍCITOS
  ============================== */

  const cleanMessage =
  normalizeProjectTitle(message);

projects.forEach(project => {
  const projectId =
    normalizeText(project.id);

  const projectTitle =
    normalizeProjectTitle(
      project.titulo
    );

  const matchesId =
    projectId &&
    cleanMessage.includes(
      projectId
    );

  const matchesTitle =
    projectTitle &&
    cleanMessage.includes(
      projectTitle
    );

  if (
    matchesId ||
    matchesTitle
  ) {
    addUniqueProject(
      detectedProjects,
      project
    );
  }
});

  /* ==============================
     REFERENCIAS NUMÉRICAS
  ============================== */

  const indexes =
    extractProjectIndexes(message);

  indexes.forEach(index => {
    const project =
      projects[index];

    if (project) {
      addUniqueProject(
        detectedProjects,
        project
      );
    }
  });

  /* ==============================
     CONTEXTO RECIENTE
  ============================== */

  if (
  detectedProjects.length < 2 &&
  refersToPreviousProjects(
    cleanMessage
  )
) {
  const contextualProjects = [
    ...(chatbotContext.lastProjectsShown || []),
    ...(chatbotContext.comparisonProjects || []),
    ...(chatbotContext.lastProjects || [])
  ];

  contextualProjects.forEach(project => {
    addUniqueProject(
      detectedProjects,
      project
    );
  });
}

  return detectedProjects.slice(0, 2);
}

export function addUniqueProject( collection, project) {
  if (!project?.id) {
    return;
  }

  const alreadyExists =
    collection.some(item =>
      normalizeText(item.id) ===
      normalizeText(project.id)
    );

  if (!alreadyExists) {
    collection.push(project);
  }
}

export function getContextualComparisonProjects() {
  const contextualProjects =
    Array.isArray(
      chatbotContext.lastProjects
    )
      ? chatbotContext.lastProjects
      : [];

  if (
    chatbotContext.lastTopic !==
      "project-comparison" ||
    contextualProjects.length < 2
  ) {
    return [];
  }

  return contextualProjects.slice(0, 2);
}

function normalizeProjectTitle(value = "") {
  return normalizeText(value)
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}