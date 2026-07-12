import {
  normalizeText
} from "../chatbotUtils.js";

import {
  calculateComplexityScore
} from "../chatbotAnalysis.js";

export function getProjectStack(project) {
  return Array.isArray(project?.stack)
    ? project.stack
    : [];
}

export function getProjectYear(project) {
  const year =
    Number.parseInt(
      project?.año,
      10
    );

  return Number.isFinite(year)
    ? year
    : 0;
}

export function getSharedTechnologies(firstStack,secondStack) {
  return firstStack.filter(
    technology =>
      secondStack.some(item =>
        normalizeText(item) ===
        normalizeText(technology)
      )
  );
}

export function getUniqueTechnologies( sourceStack, comparisonStack) {
  return sourceStack.filter(
    technology =>
      !comparisonStack.some(item =>
        normalizeText(item) ===
        normalizeText(technology)
      )
  );
}

export function projectUsesTechnology( project, technology) {
  const normalizedTechnology =
    normalizeText(technology);

  return getProjectStack(
    project
  ).some(item =>
    normalizeText(item) ===
    normalizedTechnology
  );
}

export function compareTechnologyCount( firstProject, secondProject) {
  const firstCount =
    getProjectStack(
      firstProject
    ).length;

  const secondCount =
    getProjectStack(
      secondProject
    ).length;

  if (firstCount === secondCount) {
    return "Empate";
  }

  return firstCount > secondCount
    ? firstProject.titulo
    : secondProject.titulo;
}

export function compareComplexity( firstProject, secondProject) {
  const firstScore =
    calculateComplexityScore(
      firstProject
    );

  const secondScore =
    calculateComplexityScore(
      secondProject
    );

  if (firstScore === secondScore) {
    return "Empate";
  }

  return firstScore > secondScore
    ? firstProject.titulo
    : secondProject.titulo;
}

export function compareProjectYears( firstProject, secondProject) {
  const firstYear =
    Number.parseInt(
      firstProject.año,
      10
    ) || 0;

  const secondYear =
    Number.parseInt(
      secondProject.año,
      10
    ) || 0;

  if (firstYear === secondYear) {
    return "Ambos son del mismo año";
  }

  return firstYear > secondYear
    ? firstProject.titulo
    : secondProject.titulo;
}

export function calculateGeneralProjectScore( project) {
  let score =
    calculateComplexityScore(
      project
    );

  const stack =
    getProjectStack(project);

  score += stack.length;

  if (
    project.demo &&
    project.demo !== "#"
  ) {
    score += 2;
  }

  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    score += 2;
  }

  if (
    project.descripcionLarga
  ) {
    score += 1;
  }

  return score;
}

export function calculateRecruiterScore(project) {
  let score =
    calculateComplexityScore(
      project
    );

  const stack =
    getProjectStack(project);

  score += stack.length * 2;

  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    score += 3;
  }

  if (
    project.demo &&
    project.demo !== "#"
  ) {
    score += 3;
  }

  if (
    project.descripcionLarga &&
    project.descripcionLarga.length > 80
  ) {
    score += 2;
  }

  return score;
}

export function detectComparedTechnology( message, firstProject, secondProject) {
  const technologies = [
    ...getProjectStack(
      firstProject
    ),

    ...getProjectStack(
      secondProject
    )
  ];

  return (
    technologies.find(technology =>
      message.includes(
        normalizeText(technology)
      )
    ) || null
  );
}