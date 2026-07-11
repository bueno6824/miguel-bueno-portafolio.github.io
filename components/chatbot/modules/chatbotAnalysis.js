import {
  getProjects
} from "./chatbotProjects.js";

import {
  normalizeText
} from "./chatbotUtils.js";

/* ==============================
   ANALYSIS CACHE
============================== */

let cachedAnalysis = null;
let cachedProjectsReference = null;


/* ==============================
   PUBLIC ANALYSIS
============================== */

export function analyzeProjects({
  forceRefresh = false
} = {}) {
  const projects =
    getProjects();

  if (
    !forceRefresh &&
    cachedAnalysis &&
    cachedProjectsReference === projects
  ) {
    return cachedAnalysis;
  }

  cachedProjectsReference =
    projects;

  cachedAnalysis =
    buildProjectsAnalysis(
      projects
    );

  return cachedAnalysis;
}


/* ==============================
   CACHE RESET
============================== */

export function resetProjectsAnalysis() {
  cachedAnalysis = null;
  cachedProjectsReference = null;
}

function buildProjectsAnalysis(projects) {
  const safeProjects =
    Array.isArray(projects)
      ? projects
      : [];

  const technologyCount = {};
  const categoryCount = {};
  const levelCount = {};

  safeProjects.forEach(project => {
    countCategory(
      categoryCount,
      project.categoria
    );

    countCategory(
      levelCount,
      project.nivel
    );

    const stack =
      Array.isArray(project.stack)
        ? project.stack
        : [];

    stack.forEach(technology => {
      countCategory(
        technologyCount,
        technology
      );
    });
  });

  return {
    totalProjects:
      safeProjects.length,

    projects:
      safeProjects,

    technologies:
      technologyCount,

    categories:
      categoryCount,

    levels:
      levelCount,

    latestProject:
      getLatestProjectFromList(
        safeProjects
      ),

    oldestProject:
      getOldestProjectFromList(
        safeProjects
      ),

    mostTechnologiesProject:
      getProjectWithMostTechnologies(
        safeProjects
      ),

    mostComplexProject:
      getMostComplexProject(
        safeProjects
      )
  };
}

function countCategory(
  collection,
  value
) {
  const normalizedValue =
    normalizeText(value);

  if (!normalizedValue) {
    return;
  }

  const existingKey =
    Object.keys(collection)
      .find(key =>
        normalizeText(key) ===
        normalizedValue
      );

  const key =
    existingKey ||
    String(value).trim();

  collection[key] =
    (collection[key] || 0) + 1;
}

function getLatestProjectFromList(
  projects
) {
  return [...projects]
    .sort((projectA, projectB) => {
      return (
        getProjectYear(projectB) -
        getProjectYear(projectA)
      );
    })[0] || null;
}


function getOldestProjectFromList(
  projects
) {
  return [...projects]
    .sort((projectA, projectB) => {
      return (
        getProjectYear(projectA) -
        getProjectYear(projectB)
      );
    })[0] || null;
}


function getProjectYear(project) {
  const year =
    Number.parseInt(
      project?.año,
      10
    );

  return Number.isFinite(year)
    ? year
    : 0;
}

function getProjectWithMostTechnologies(
  projects
) {
  return projects.reduce(
    (selectedProject, currentProject) => {
      if (!selectedProject) {
        return currentProject;
      }

      const selectedStackLength =
        Array.isArray(
          selectedProject.stack
        )
          ? selectedProject.stack.length
          : 0;

      const currentStackLength =
        Array.isArray(
          currentProject.stack
        )
          ? currentProject.stack.length
          : 0;

      return currentStackLength >
        selectedStackLength
        ? currentProject
        : selectedProject;
    },
    null
  );
}

function getMostComplexProject(
  projects
) {
  return projects.reduce(
    (selectedProject, currentProject) => {
      if (!selectedProject) {
        return currentProject;
      }

      const selectedScore =
        calculateComplexityScore(
          selectedProject
        );

      const currentScore =
        calculateComplexityScore(
          currentProject
        );

      return currentScore >
        selectedScore
        ? currentProject
        : selectedProject;
    },
    null
  );
}

export function calculateComplexityScore(
  project
) {
  if (!project) {
    return 0;
  }

  let score = 0;

  const stack =
    Array.isArray(project.stack)
      ? project.stack
      : [];

  score += stack.length * 2;

  const level =
    normalizeText(project.nivel);

  const levelScores = {
    basico: 1,
    intermedio: 3,
    avanzado: 5
  };

  score +=
    levelScores[level] || 0;

  const category =
    normalizeText(
      project.categoria
    );

  const categoryScores = {
    frontend: 2,
    backend: 3,
    fullstack: 5,
    "full stack": 5,
    iot: 4,
    movil: 3,
    escritorio: 3
  };

  score +=
    categoryScores[category] || 0;

  if (
    project.demo &&
    project.demo !== "#"
  ) {
    score += 1;
  }

  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    score += 1;
  }

  const media =
    Array.isArray(project.media)
      ? project.media
      : [];

  score += Math.min(
    media.length,
    3
  );

  return score;
}

export function getProjectsByTechnology(
  technology
) {
  const normalizedTechnology =
    normalizeText(technology);

  if (!normalizedTechnology) {
    return [];
  }

  return getProjects().filter(project => {
    const stack =
      Array.isArray(project.stack)
        ? project.stack
        : [];

    return stack.some(item =>
      normalizeText(item).includes(
        normalizedTechnology
      )
    );
  });
}


export function getProjectsByCategory(
  category
) {
  const normalizedCategory =
    normalizeText(category);

  if (!normalizedCategory) {
    return [];
  }

  return getProjects().filter(project => {
    return normalizeText(
      project.categoria
    ).includes(
      normalizedCategory
    );
  });
}


export function getTechnologyCount(
  technology
) {
  return getProjectsByTechnology(
    technology
  ).length;
}


export function getCategoryCount(
  category
) {
  return getProjectsByCategory(
    category
  ).length;
}

