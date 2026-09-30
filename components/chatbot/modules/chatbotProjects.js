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

// Objeto que almacena las funciones de interfaz
// utilizadas por el módulo para mostrar mensajes,
// indicadores de escritura, sugerencias y tarjetas.
let ui = {};

/* ==============================
   INITIALIZATION
============================== */

// Inicializa las funciones de interfaz que utilizará
// el módulo de proyectos del chatbot.
export function initChatbotProjects({ ui: uiHandlers = {} } = {}) {
  ui = {
    // Función para mostrar mensajes del chatbot.
    botMessage:
      typeof uiHandlers.botMessage === "function"
        ? uiHandlers.botMessage
        : null,

    // Función para mostrar mensajes enviados por el usuario.
    userMessage:
      typeof uiHandlers.userMessage === "function"
        ? uiHandlers.userMessage
        : null,

    // Inicia el indicador de escritura del chatbot.
    typingStart:
      typeof uiHandlers.typingStart === "function"
        ? uiHandlers.typingStart
        : null,

    // Detiene el indicador de escritura del chatbot.
    typingEnd:
      typeof uiHandlers.typingEnd === "function"
        ? uiHandlers.typingEnd
        : null,

    // Muestra sugerencias de acciones al usuario.
    suggestions:
      typeof uiHandlers.suggestions === "function"
        ? uiHandlers.suggestions
        : null,

    // Muestra las tarjetas visuales de los proyectos.
    projectCards:
      typeof uiHandlers.projectCards === "function"
        ? uiHandlers.projectCards
        : null
  };
}

// Obtiene todos los proyectos disponibles desde la fuente de datos.
// Si los datos no son un arreglo, devuelve un arreglo vacío.
export function getProjects() {
  const projects = getProjectsData();

  return Array.isArray(projects)
    ? projects
    : [];
}

// Busca un proyecto específico utilizando su identificador.
export function getProjectById(projectId) {
  // No continúa si no se recibió un identificador.
  if (!projectId) {
    return null;
  }

  // Normaliza el identificador para facilitar la comparación.
  const normalizedId =
    normalizeText(projectId);

  // Busca el proyecto cuyo ID coincida con el identificador normalizado.
  return (
    getProjects().find(project => {
      return (
        normalizeText(project.id) ===
        normalizedId
      );
    }) || null
  );
}

// Obtiene la lista completa de proyectos y prepara el contexto
// del chatbot para futuras consultas relacionadas con ellos.
export function getProjectsList() {
  const projects =
    getProjects();

  // Si no existen proyectos, devuelve un mensaje informativo.
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

  // Guarda la información de los proyectos en el contexto
  // para permitir referencias posteriores.
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

// Intenta identificar un proyecto a partir del mensaje del usuario,
// comparando ID, título, categoría y tecnologías utilizadas.
export function getProjectFromMessage(message) {
  const normalizedMessage =
    normalizeText(message);

  // Ignora mensajes vacíos o que no pudieron normalizarse.
  if (!normalizedMessage) {
    return null;
  }

  return (
    getProjects().find(project => {
      // Normaliza el identificador del proyecto.
      const id =
        normalizeText(
          project.id || ""
        );

      // Normaliza el título del proyecto.
      const title =
        normalizeText(
          project.titulo || ""
        );

      // Normaliza la categoría del proyecto.
      const category =
        normalizeText(
          project.categoria || ""
        );

      // Convierte el stack del proyecto en un texto normalizado
      // para poder buscar tecnologías dentro del mensaje.
      const stack =
        Array.isArray(project.stack)
          ? project.stack
            .map(item =>
              normalizeText(item)
            )
            .join(" ")
          : "";

      // Comprueba si el mensaje coincide con alguno de los
      // principales datos identificativos del proyecto.
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

// Busca proyectos utilizando las palabras relevantes del mensaje.
export function searchProjects(message) {
  const normalizedMessage =
    normalizeText(message);

  // Palabras demasiado generales que no aportan información
  // útil para realizar la búsqueda.
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

  // Obtiene únicamente palabras con suficiente longitud
  // que no formen parte de la lista de palabras ignoradas.
  const searchWords =
    normalizedMessage
      .split(" ")
      .filter(word =>
        word.length > 2 &&
        !ignoreWords.includes(word)
      );

  // Si no existen palabras útiles, no realiza ninguna búsqueda.
  if (!searchWords.length) return [];

  // Filtra los proyectos que contienen alguna de las palabras
  // buscadas dentro de su información relevante.
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

// Genera una respuesta del chatbot cuando se encuentran
// proyectos relacionados con la búsqueda del usuario.
export function getProjectSearchResponse(message) {
  const results =
    searchProjects(message);

  // Si no existen coincidencias, permite que otro módulo
  // pueda procesar el mensaje.
  if (!results.length) {
    return null;
  }

  // Guarda los resultados de búsqueda en el contexto.
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

// Obtiene el proyecto recomendado según la prioridad definida.
// Actualmente prioriza el proyecto cuyo título contiene "portafolio".
export function getRecommendedProject() {
  const projects = getProjects();

  // No devuelve ningún proyecto si la lista está vacía.
  if (!projects.length) return null;

  // Busca primero un proyecto relacionado con el portafolio.
  const priorityProject =
    projects.find(project =>
      normalizeText(project.titulo || "")
        .includes("portafolio")
    );

  // Si existe un proyecto prioritario lo devuelve;
  // de lo contrario utiliza el primero de la lista.
  return priorityProject || projects[0];
}

// Obtiene el proyecto con el año más reciente.
export function getLatestProject() {
  const projects = getProjects();

  // No devuelve ningún proyecto si la lista está vacía.
  if (!projects.length) return null;

  // Ordena los proyectos por año de forma descendente
  // y devuelve el primero de la lista.
  return [...projects].sort((a, b) => {
    const yearA = Number(a.año) || 0;
    const yearB = Number(b.año) || 0;

    return yearB - yearA;
  })[0];
}

// Genera respuestas especiales para solicitudes de recomendación
// o para consultar el proyecto más reciente.
export function getSpecialProjectResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  // Detecta si el usuario está solicitando una recomendación.
  const wantsRecommendation =
    normalizedMessage.includes("recomiend") ||
    normalizedMessage.includes("mejor proyecto") ||
    normalizedMessage.includes("proyecto recomendado");

  // Detecta si el usuario está preguntando por el proyecto más reciente.
  const wantsLatest =
    normalizedMessage.includes("ultimo proyecto") ||
    normalizedMessage.includes("último proyecto") ||
    normalizedMessage.includes("mas reciente") ||
    normalizedMessage.includes("más reciente") ||
    normalizedMessage.includes("reciente");

  // Procesa la solicitud de recomendación.
  if (wantsRecommendation) {
    const project =
      getRecommendedProject();

    // Si no existe ningún proyecto, no genera respuesta.
    if (!project) return null;

    // Guarda el proyecto recomendado en el contexto.
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

  // Procesa la solicitud del proyecto más reciente.
  if (wantsLatest) {
    const project =
      getLatestProject();

    // Si no existe ningún proyecto, no genera respuesta.
    if (!project) return null;

    // Guarda el proyecto más reciente en el contexto.
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

  // Si no corresponde a ninguna solicitud especial,
  // permite que otros módulos procesen el mensaje.
  return null;
}

// Procesa la selección de un proyecto y controla la interacción
// visual antes de abrir el modal correspondiente.
export async function processProjectSelection(
  projectId,
  {
    showUserMessage = true,
    showBotMessage = true
  } = {}
) {
  // Obtiene el proyecto utilizando su identificador.
  const project =
    getProjectById(projectId);

  // Si el proyecto no existe, informa al usuario y detiene el proceso.
  if (!project) {
    await ui.botMessage?.(
      "No pude encontrar ese proyecto 😅."
    );

    return false;
  }

  // Obtiene los proyectos que fueron mostrados anteriormente,
  // si existen dentro del contexto del chatbot.
  const shownProjects =
    Array.isArray(
      chatbotContext.lastProjectsShown
    )
      ? chatbotContext.lastProjectsShown
      : [];

  // Obtiene la posición del proyecto seleccionado dentro
  // de los proyectos mostrados anteriormente.
  const selectedIndex =
    shownProjects.findIndex(item =>
      item.id === project.id
    );

  // Actualiza el contexto indicando que se abrió un proyecto.
  chatbotContext.lastTopic =
    "opened-project";

  chatbotContext.lastProject =
    project;

  chatbotContext.lastMentionedProject =
    project;

  chatbotContext.lastOpenedProject =
    project;

  // Muestra el mensaje del usuario si está habilitado.
  if (showUserMessage) {
    ui.userMessage?.(
      project.titulo
    );
  }

  // Inicia el indicador de escritura del chatbot.
  ui.typingStart?.();

  // Espera brevemente para simular el tiempo de respuesta del chatbot.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  // Finaliza el indicador de escritura.
  ui.typingEnd?.();

  // Muestra la frase de apertura del proyecto seleccionado.
  if (showBotMessage) {
    await ui.botMessage?.(
      getOpeningProjectPhrase(
        project.titulo
      )
    );
  }

  // Abre el modal correspondiente al proyecto seleccionado.
  openProjectModal(
    project.id
  );

  return true;
}