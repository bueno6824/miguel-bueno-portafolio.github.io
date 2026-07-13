import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText
} from "./chatbotUtils.js";

import {
  getActiveProject
} from "./chatbotConversationContext.js";

export function getProjectMemoryResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  const project =
  getActiveProject();

  if (!project) {
    return null;
  }

  return (
    getProjectTechnologiesResponse(
      normalizedMessage,
      project
    ) ||
    getProjectDemoResponse(
      normalizedMessage,
      project
    ) ||
    getProjectCodeResponse(
      normalizedMessage,
      project
    ) ||
    getProjectYearResponse(
      normalizedMessage,
      project
    ) ||
    getProjectCategoryResponse(
      normalizedMessage,
      project
    ) ||
    getProjectLevelResponse(
      normalizedMessage,
      project
    ) ||
    getProjectDescriptionResponse(
      normalizedMessage,
      project
    ) ||
    getProjectOpenDemoResponse(
      normalizedMessage,
      project
    ) ||
    getProjectOpenCodeResponse(
      normalizedMessage,
      project
    ) ||
    null
  );
}



function getProjectTechnologiesResponse(message,project) {
  const patterns = [
    "que tecnologias usa",
    "que herramientas usa",
    "cual es su stack",
    "que stack tiene",
    "tecnologias",
    "stack"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  const stack =
    Array.isArray(project.stack)
      ? project.stack
      : [];

  if (!stack.length) {
    return {
      answer:
        `No tengo tecnologías registradas para <strong>${project.titulo}</strong>.`,

      suggestions:
        getProjectMemorySuggestions()
    };
  }

  chatbotContext.lastTechnology =
    stack[0] || null;

  return {
    answer: `
      <strong>${project.titulo}</strong>
      utiliza:

      <br><br>

      ${stack
        .map(
          technology =>
            `• ${technology}`
        )
        .join("<br>")}
    `,

    projects: [
      project
    ],

    suggestions:
      getProjectMemorySuggestions()
  };
}

function getProjectDemoResponse(message,project) {
  const patterns = [
    "tiene demo",
    "hay demo",
    "tiene pagina",
    "se puede probar",
    "tiene sitio",
    "demo disponible"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  const hasDemo =
    Boolean(
      project.demo &&
      project.demo !== "#"
    );

  return {
    answer: hasDemo
      ? `
        Sí 🚀
        <strong>${project.titulo}</strong>
        tiene una demo disponible.
      `
      : `
        No encontré una demo pública registrada para
        <strong>${project.titulo}</strong>.
      `,

    projects: [
      project
    ],

    suggestions: hasDemo
      ? [
          "abre la demo",
          "abre el código",
          "qué tecnologías usa"
        ]
      : getProjectMemorySuggestions()
  };
}

function getProjectCodeResponse(
  message,
  project
) {
  const patterns = [
    "tiene codigo",
    "hay codigo",
    "tiene github",
    "tiene repositorio",
    "codigo disponible",
    "repositorio disponible"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  const hasCode =
    Boolean(
      project.codigo &&
      project.codigo !== "#"
    );

  return {
    answer: hasCode
      ? `
        Sí 💻
        El código de
        <strong>${project.titulo}</strong>
        está disponible.
      `
      : `
        No encontré un repositorio público registrado para
        <strong>${project.titulo}</strong>.
      `,

    projects: [
      project
    ],

    suggestions: hasCode
      ? [
          "abre el código",
          "abre la demo",
          "qué tecnologías usa"
        ]
      : getProjectMemorySuggestions()
  };
}

function getProjectYearResponse(
  message,
  project
) {
  const patterns = [
    "de que año es",
    "cuando lo hiciste",
    "cuando fue creado",
    "en que año",
    "que año es"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  return {
    answer: `
      <strong>${project.titulo}</strong>
      está registrado en el año
      <strong>${project.año || "no especificado"}</strong>.
    `,

    projects: [
      project
    ],

    suggestions:
      getProjectMemorySuggestions()
  };
}

function getProjectCategoryResponse(  message,  project) {
  const patterns = [
    "que categoria tiene",
    "que categoria es",
    "cual es su categoria",
    "cual es la categoria",
    "de que categoria es",
    "a que categoria pertenece",
    "de que tipo es",
    "es frontend",
    "es backend",
    "es web",
    "es iot"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  const category =
    project.categoria ||
    "no especificada";

  chatbotContext.lastCategory =
    category;

  return {
    answer: `
      <strong>${project.titulo}</strong>
      pertenece a la categoría
      <strong>${category}</strong>.
    `,

    projects: [
      project
    ],

    suggestions:
      getProjectMemorySuggestions()
  };
}

function getProjectLevelResponse(
  message,
  project
) {
  const patterns = [
    "que nivel tiene",
    "cual es su nivel",
    "es basico",
    "es intermedio",
    "es avanzado",
    "que tan avanzado es"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  return {
    answer: `
      El nivel registrado de
      <strong>${project.titulo}</strong>
      es
      <strong>${project.nivel || "no especificado"}</strong>.
    `,

    projects: [
      project
    ],

    suggestions:
      getProjectMemorySuggestions()
  };
}

function getProjectDescriptionResponse(  message,  project) {
  const patterns = [
    "que hace",
    "que hace este proyecto",
    "que hace el proyecto",
    "como funciona",
    "de que trata",
    "para que sirve",
    "cual es su funcion",
    "que funcion tiene",
    "explicame el proyecto",
    "descripcion del proyecto",
    "cuentame de ese proyecto",
    "cuentame sobre el proyecto"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  const description =
    project.descripcionLarga ||
    project.descripcionCorta ||
    "No hay una descripción disponible para este proyecto.";

  return {
    answer: `
      <strong>${project.titulo}</strong>

      <br><br>

      ${description}
    `,

    projects: [
      project
    ],

    suggestions:
      getProjectMemorySuggestions()
  };
}

function getProjectOpenDemoResponse(
  message,
  project
) {
  const patterns = [
    "abre la demo",
    "abre el sitio",
    "abre la pagina",
    "quiero probarlo",
    "muestra la demo"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  if (
    !project.demo ||
    project.demo === "#"
  ) {
    return {
      answer:
        `No encontré una demo pública para <strong>${project.titulo}</strong>.`,

      suggestions:
        getProjectMemorySuggestions()
    };
  }

  return {
    answer:
      `🚀 Abriendo la demo de <strong>${project.titulo}</strong>.`,

    action: {
      type: "link",
      url: project.demo
    },

    direct: true,

    suggestions:
      getProjectMemorySuggestions()
  };
}

function getProjectOpenCodeResponse(
  message,
  project
) {
  const patterns = [
    "abre el codigo",
    "abre github",
    "abre el repositorio",
    "muestra el codigo",
    "quiero ver el repo",
    "abre el repo"
  ];

  if (!matchesAny(message, patterns)) {
    return null;
  }

  if (
    !project.codigo ||
    project.codigo === "#"
  ) {
    return {
      answer:
        `No encontré un repositorio público para <strong>${project.titulo}</strong>.`,

      suggestions:
        getProjectMemorySuggestions()
    };
  }

  return {
    answer:
      `💻 Abriendo el código de <strong>${project.titulo}</strong>.`,

    action: {
      type: "link",
      url: project.codigo
    },

    direct: true,

    suggestions:
      getProjectMemorySuggestions()
  };
}

function matchesAny(  message,  patterns = []) {
  const normalizedMessage =
    normalizeText(message);

  return patterns.some(pattern => {
    const normalizedPattern =
      normalizeText(pattern);

    return normalizedMessage.includes(
      normalizedPattern
    );
  });
}

function getProjectMemorySuggestions() {
  return [
    "qué tecnologías usa",
    "tiene demo",
    "tiene código"
  ];
}

