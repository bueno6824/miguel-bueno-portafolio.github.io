import {
  chatbotContext
} from "./chatbotState.js";


/* ==============================
   CONVERSATION CONTEXT
============================== */

export function getConversationContext() {
  const activeProject =
    getActiveProject();

  const activeProjects =
    getActiveProjects();

  const comparisonProjects =
    getComparisonProjects();

  const guideMode =
    getGuideMode();

  return {
    topic:
      chatbotContext.lastTopic ||
      inferCurrentTopic(),

    audience:
      guideMode.audience ||
      null,

    professionalProfile:
      guideMode.profile ||
      null,

    activeProject,

    activeProjects,

    comparisonProjects,

    comparisonActive:
      comparisonProjects.length >= 2,

    guideActive:
      guideMode.active,

    guideStep:
      guideMode.currentStep,

    lastTechnology:
      chatbotContext.lastTechnology ||
      null,

    lastCategory:
      chatbotContext.lastCategory ||
      null,

    hasProjectContext:
      Boolean(activeProject),

    hasProjectsContext:
      activeProjects.length > 0
  };
}

export function getActiveProject() {
  return (
    chatbotContext.lastSelectedProject ||
    chatbotContext.lastMentionedProject ||
    chatbotContext.lastProject ||
    chatbotContext.lastOpenedProject ||
    chatbotContext.lastRecommendedProject ||
    null
  );
}

export function getActiveProjects() {
  const shownProjects =
    getSafeProjects(
      chatbotContext.lastProjectsShown
    );

  if (shownProjects.length) {
    return shownProjects;
  }

  const comparisonProjects =
    getSafeProjects(
      chatbotContext.comparisonProjects
    );

  if (comparisonProjects.length) {
    return comparisonProjects;
  }

  return getSafeProjects(
    chatbotContext.lastProjects
  );
}

export function getComparisonProjects() {
  const comparisonProjects =
    getSafeProjects(
      chatbotContext.comparisonProjects
    );

  if (
    comparisonProjects.length >= 2
  ) {
    return comparisonProjects.slice(
      0,
      2
    );
  }

  if (
    chatbotContext.lastTopic ===
    "project-comparison"
  ) {
    return getSafeProjects(
      chatbotContext.lastProjects
    ).slice(0, 2);
  }

  return [];
}

export function getGuideMode() {
  const guideMode =
    chatbotContext.guideMode;

  if (
    !guideMode ||
    typeof guideMode !== "object"
  ) {
    return {
      active: false,
      audience: null,
      profile: null,
      currentStep: 0,
      recommendedProjects: [],
      completedSteps: []
    };
  }

  return {
    active:
      Boolean(guideMode.active),

    audience:
      guideMode.audience || null,

    profile:
      guideMode.profile || null,

    currentStep:
      Number(
        guideMode.currentStep
      ) || 0,

    recommendedProjects:
      getSafeProjects(
        guideMode.recommendedProjects
      ),

    completedSteps:
      Array.isArray(
        guideMode.completedSteps
      )
        ? guideMode.completedSteps
        : []
  };
}

function inferCurrentTopic() {
  const guideMode =
    getGuideMode();

  if (guideMode.active) {
    return "portfolio-guide";
  }

  if (
    getComparisonProjects()
      .length >= 2
  ) {
    return "project-comparison";
  }

  if (getActiveProject()) {
    return "project";
  }

  if (
    getActiveProjects().length
  ) {
    return "projects";
  }

  if (
    chatbotContext.lastTechnology
  ) {
    return "technology";
  }

  if (
    chatbotContext.lastCategory
  ) {
    return "category";
  }

  return null;
}

function getSafeProjects(
  projects
) {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects.filter(
    project =>
      project &&
      typeof project === "object" &&
      project.id
  );
}

