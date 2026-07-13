import {
  getProjectsData,
  openProjectModal
} from "../../modals/modal.js";

import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText,
  matchesKeyword
} from "./chatbotUtils.js";

import {
  getOpeningProjectPhrase
} from "./chatbotPhrases.js";

/* ==============================
   MODULE CALLBACKS
============================== */

let ui = {};


/* ==============================
   INITIALIZATION
============================== */

export function initChatbotProjects({ui: uiHandlers = {}}=  {}) {
  ui = {
    botMessage:
      typeof uiHandlers.botMessage === "function"
        ? uiHandlers.botMessage
        : null,

    userMessage:
      typeof uiHandlers.userMessage === "function"
        ? uiHandlers.userMessage
        : null,

    typingStart:
      typeof uiHandlers.typingStart === "function"
        ? uiHandlers.typingStart
        : null,

    typingEnd:
      typeof uiHandlers.typingEnd === "function"
        ? uiHandlers.typingEnd
        : null,

    suggestions:
      typeof uiHandlers.suggestions === "function"
        ? uiHandlers.suggestions
        : null,

    projectCards:
      typeof uiHandlers.projectCards === "function"
        ? uiHandlers.projectCards
        : null
  };
}

export function getProjects() {
  const projects = getProjectsData();

  return Array.isArray(projects)
    ? projects
    : [];
}

export function getProjectById(projectId) {
  if (!projectId) {
    return null;
  }

  const normalizedId =
    normalizeText(projectId);

  return (
    getProjects().find(project => {
      return (
        normalizeText(project.id) ===
        normalizedId
      );
    }) || null
  );
}

export function getProjectsList() {
  const projects =
    getProjects();

  if (!projects.length) {
    return {
      answer:
        "Todavía no tengo proyectos cargados 😅.",
      suggestions: [
        "herramientas",
        "contacto"
      ]
    };
  }

  chatbotContext.lastTopic =
    "projects";

  chatbotContext.lastProjects =
    projects;

  chatbotContext.lastProject =
    null;

  return {
    answer:
      "🚀 Estos son los proyectos disponibles:",
    projects,
    suggestions: [
      "proyectos frontend",
      "proyectos IoT",
      "recomiéndame uno"
    ]
  };
}

export function getProjectFromMessage(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  return (
    getProjects().find(project => {
      const id =
        normalizeText(
          project.id || ""
        );

      const title =
        normalizeText(
          project.titulo || ""
        );

      const category =
        normalizeText(
          project.categoria || ""
        );

      const stack =
        Array.isArray(project.stack)
          ? project.stack
              .map(item =>
                normalizeText(item)
              )
              .join(" ")
          : "";

      return (
        normalizedMessage === id ||
        normalizedMessage.includes(id) ||
        id.includes(normalizedMessage) ||

        title.includes(
          normalizedMessage
        ) ||

        normalizedMessage.includes(
          title
        ) ||

        category.includes(
          normalizedMessage
        ) ||

        stack.includes(
          normalizedMessage
        )
      );
    }) || null
  );
}

export function searchProjects(message) {
  const normalizedMessage =
    normalizeText(message);

  const ignoreWords = [
    "proyecto",
    "proyectos",
    "con",
    "de",
    "del",
    "la",
    "el",
    "los",
    "las",
    "quiero",
    "ver",
    "mostrar",
    "muestrame",
    "muéstrame"
  ];

  const searchWords =
    normalizedMessage
      .split(" ")
      .filter(word =>
        word.length > 2 &&
        !ignoreWords.includes(word)
      );

  if (!searchWords.length) return [];

  return getProjects().filter(project => {
    const projectText = [
      project.titulo,
      project.categoria,
      project.nivel,
      project.año,
      project.descripcionCorta,
      project.descripcionLarga,
      ...(project.stack || [])
    ]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return searchWords.some(word =>
      projectText.includes(word)
    );
  });
}

export function getProjectSearchResponse(message) {
  const results =
    searchProjects(message);

  if (!results.length) {
    return null;
  }

  chatbotContext.lastTopic =
    "project-search";

  chatbotContext.lastProjects =
    results;

  chatbotContext.lastProject =
    null;

  return {
    answer:
      `Encontré ${results.length} proyecto(s) relacionado(s) con tu búsqueda 🔎:`,
    projects: results,
    suggestions: [
      "abre el primero",
      "cuál recomiendas",
      "contacto"
    ]
  };
}

export function getRecommendedProject() {
  const projects = getProjects();

  if (!projects.length) return null;

  const priorityProject =
    projects.find(project =>
      normalizeText(project.titulo || "")
        .includes("portafolio")
    );

  return priorityProject || projects[0];
}

export function getLatestProject() {
  const projects = getProjects();

  if (!projects.length) return null;

  return [...projects].sort((a, b) => {
    const yearA = Number(a.año) || 0;
    const yearB = Number(b.año) || 0;

    return yearB - yearA;
  })[0];
}

export function getSpecialProjectResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  const wantsRecommendation =
    normalizedMessage.includes("recomiend") ||
    normalizedMessage.includes("mejor proyecto") ||
    normalizedMessage.includes("proyecto recomendado");

  const wantsLatest =
    normalizedMessage.includes("ultimo proyecto") ||
    normalizedMessage.includes("último proyecto") ||
    normalizedMessage.includes("mas reciente") ||
    normalizedMessage.includes("más reciente") ||
    normalizedMessage.includes("reciente");

  if (wantsRecommendation) {
    const project =
      getRecommendedProject();

    if (!project) return null;
    
chatbotContext.lastTopic = "recommended-project";
chatbotContext.lastProject = project;
chatbotContext.lastProjects = [project];

    return {
      answer: `
        🔥 Te recomiendo revisar <strong>${project.titulo}</strong>.<br><br>
        Es buena opción porque representa muy bien el enfoque de Miguel:
        diseño, estructura, tecnologías y experiencia de usuario.<br><br>
        ¿Quieres abrirlo?
      `,
      suggestions: [
        {
          label: "Abrir proyecto",
          value: project.id,
          type: "project"
        },
        "proyectos",
        "contacto"
      ]
    };
  }

  if (wantsLatest) {
    const project =
      getLatestProject();

    if (!project) return null;

chatbotContext.lastTopic = "latest-project";
chatbotContext.lastProject = project;
chatbotContext.lastProjects = [project];

    return {
      answer: `
        🆕 El proyecto más reciente es <strong>${project.titulo}</strong>.<br><br>
        <strong>Año:</strong> ${project.año || "No especificado"}<br>
        <strong>Categoría:</strong> ${project.categoria || "Sin categoría"}<br>
        <strong>Stack:</strong> ${(project.stack || []).join(", ")}
      `,
      suggestions: [
        {
          label: "Abrir proyecto",
          value: project.id,
          type: "project"
        },
        "proyectos",
        "contacto"
      ]
    };
  }

  return null;
}

export async function processProjectSelection(
  projectId,
  {
    showUserMessage = true,
    showBotMessage = true
  } = {}
) {
  const project =
    getProjectById(projectId);

  if (!project) {
    await ui.botMessage?.(
      "No pude encontrar ese proyecto 😅."
    );

    return false;
  }

const shownProjects =
  Array.isArray(
    chatbotContext.lastProjectsShown
  )
    ? chatbotContext.lastProjectsShown
    : [];

const selectedIndex =
  shownProjects.findIndex(item =>
    item.id === project.id
  );
  
  
  chatbotContext.lastTopic =
    "opened-project";

  chatbotContext.lastProject =
  project;

chatbotContext.lastMentionedProject =
  project;

chatbotContext.lastOpenedProject =
  project;
  
  

  if (showUserMessage) {
  ui.userMessage?.(
    project.titulo
  );
}

  ui.typingStart?.();

  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  ui.typingEnd?.();

  if (showBotMessage) {
  await ui.botMessage?.(
    getOpeningProjectPhrase(
      project.titulo
    )
  );
}

  openProjectModal(
    project.id
  );

  return true;
}