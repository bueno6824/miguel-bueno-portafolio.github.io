import {
  getConversationContext,
  getActiveProject,
  getComparisonProjects
} from "./chatbotConversationContext.js";

import {
  normalizeText
} from "./chatbotUtils.js";

import {
  calculateComplexityScore
} from "./chatbotAnalysis.js"

function normalizeShortQuestion(
  message = ""
) {
  return normalizeText(message)
    .replace(
      /[¿?¡!.,;:()"']/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function getShortQuestionResponse(
  message
) {
  const normalizedMessage =
    normalizeShortQuestion(message);

  if (!normalizedMessage) {
    return null;
  }

  if (
    !isShortContextualQuestion(
      normalizedMessage
    )
  ) {
    return null;
  }

  const context =
    getConversationContext();

  return (
    getWhyResponse(
      normalizedMessage,
      context
    ) ||
    getWhichResponse(
      normalizedMessage,
      context
    ) ||
    getWhenResponse(
      normalizedMessage,
      context
    ) ||
    getWhereResponse(
      normalizedMessage,
      context
    ) ||
    getHowResponse(
      normalizedMessage,
      context
    ) ||
    getWithWhatResponse(
      normalizedMessage,
      context
    ) ||
    null
  );
}

function isShortContextualQuestion(
  message
) {
  const words =
    message
      .split(/\s+/)
      .filter(Boolean);

  if (words.length > 7) {
    return false;
  }

  const patterns = [
    "por que",
    "y por que",
    "cual",
    "y cual",
    "cuando",
    "y cuando",
    "donde",
    "y donde",
    "como",
    "y como",
    "con que",
    "y con que"
  ];

  return patterns.some(pattern =>
    message === pattern ||
    message.startsWith(
      `${pattern} `
    )
  );
}

function getWhyResponse(
  message,
  context
) {
  if (
    message !== "por que" &&
    message !== "y por que"
  ) {
    return null;
  }

  if (
    context.guideActive &&
    context.activeProject
  ) {
    return buildGuideWhyResponse(
      context.activeProject,
      context
    );
  }

  if (
    context.comparisonActive
  ) {
    return buildComparisonWhyResponse(
      context.comparisonProjects
    );
  }

  if (context.activeProject) {
    return buildProjectWhyResponse(
      context.activeProject
    );
  }

  return null;
}

function buildGuideWhyResponse(
  project,
  context
) {
  const stack =
    getProjectStack(project);

  const reasons = [];

  if (stack.length) {
    reasons.push(
      `utiliza ${stack.length} tecnologías principales`
    );
  }

  if (
    project.demo &&
    project.demo !== "#"
  ) {
    reasons.push(
      "cuenta con una demostración disponible"
    );
  }

  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    reasons.push(
      "permite revisar el código fuente"
    );
  }

  reasons.push(
    `se relaciona con el perfil ${
      context.professionalProfile ||
      "profesional evaluado"
    }`
  );

  return {
    answer: `
      Elegí
      <strong>${project.titulo}</strong>
      porque:

      <br><br>

      ${reasons
        .map(reason => `• ${reason}`)
        .join("<br>")}

      <br><br>

      Además, su puntuación estimada de
      complejidad es
      <strong>${
        calculateComplexityScore(project)
      }</strong>.
    `,

    projects: [
      project
    ],

    suggestions: [
      "qué tecnologías usa",
      "abre el recomendado",
      "siguiente paso"
    ]
  };
}

function buildComparisonWhyResponse(
  projects
) {
  if (
    !Array.isArray(projects) ||
    projects.length < 2
  ) {
    return null;
  }

  const [
    firstProject,
    secondProject
  ] = projects;

  const firstScore =
    calculateComplexityScore(
      firstProject
    );

  const secondScore =
    calculateComplexityScore(
      secondProject
    );

  if (firstScore === secondScore) {
    return {
      answer: `
        Los dos proyectos tienen una
        puntuación técnica similar.

        <br><br>

        <strong>${firstProject.titulo}</strong>
        destaca en
        <strong>${
          firstProject.categoria ||
          "su categoría"
        }</strong>,

        mientras que

        <strong>${secondProject.titulo}</strong>
        demuestra capacidades en
        <strong>${
          secondProject.categoria ||
          "otra área"
        }</strong>.
      `,

      projects,

      suggestions:
        getComparisonSuggestions()
    };
  }

  const winner =
    firstScore > secondScore
      ? firstProject
      : secondProject;

  return {
    answer: `
      Elegí
      <strong>${winner.titulo}</strong>
      porque obtuvo una mayor puntuación
      estimada de complejidad.

      <br><br>

      El análisis considera el stack,
      el nivel, la categoría, la demo,
      el repositorio y los recursos multimedia.
    `,

    projects: [
      winner
    ],

    suggestions:
      getComparisonSuggestions()
  };
}

function buildProjectWhyResponse(
  project
) {
  const stack =
    getProjectStack(project);

  return {
    answer: `
      <strong>${project.titulo}</strong>
      es relevante porque combina:

      <br><br>

      • Categoría:
      <strong>${
        project.categoria ||
        "no especificada"
      }</strong>
      <br>

      • Nivel:
      <strong>${
        project.nivel ||
        "no especificado"
      }</strong>
      <br>

      • Tecnologías principales:
      <strong>${stack.length}</strong>
      <br>

      • Complejidad estimada:
      <strong>${
        calculateComplexityScore(project)
      }</strong>

      <br><br>

      También permite demostrar cómo se resolvió
      un problema real mediante software,
      arquitectura y organización del código.
    `,

    projects: [
      project
    ],

    suggestions: [
      "qué tecnologías usa",
      "qué hace",
      "tiene código"
    ]
  };
}

function getWhichResponse(
  message,
  context
) {
  if (
    message !== "cual" &&
    message !== "y cual"
  ) {
    return null;
  }

  if (
    context.comparisonActive &&
    context.comparisonProjects.length >= 2
  ) {
    return {
      answer: `
        Actualmente estamos comparando:

        <br><br>

        <strong>1.</strong>
        ${context.comparisonProjects[0].titulo}

        <br>

        <strong>2.</strong>
        ${context.comparisonProjects[1].titulo}

        <br><br>

        Puedes preguntarme cuál es más complejo,
        cuál usa más tecnologías o cuál recomendaría.
      `,

      projects:
        context.comparisonProjects,

      suggestions:
        getComparisonSuggestions()
    };
  }

  if (context.activeProject) {
    return {
      answer: `
        El proyecto actual es
        <strong>${context.activeProject.titulo}</strong>.
      `,

      projects: [
        context.activeProject
      ],

      suggestions: [
        "qué tecnologías usa",
        "qué hace",
        "ábrelo"
      ]
    };
  }

  return null;
}

function getWhenResponse(
  message,
  context
) {
  if (
    message !== "cuando" &&
    message !== "y cuando"
  ) {
    return null;
  }

  const project =
    context.activeProject;

  if (!project) {
    return null;
  }

  return {
    answer: `
      <strong>${project.titulo}</strong>
      está registrado en el año
      <strong>${
        project.año ||
        "no especificado"
      }</strong>.
    `,

    projects: [
      project
    ],

    suggestions: [
      "qué hace",
      "qué tecnologías usa",
      "tiene demo"
    ]
  };
}

function getWhereResponse(
  message,
  context
) {
  if (
    message !== "donde" &&
    message !== "y donde"
  ) {
    return null;
  }

  const project =
    context.activeProject;

  if (
    project?.demo &&
    project.demo !== "#"
  ) {
    return {
      answer: `
        Puedes revisar
        <strong>${project.titulo}</strong>
        mediante su demo pública.
      `,

      action: {
        type: "link",
        url: project.demo
      },

      direct: false,

      suggestions: [
        "abre la demo",
        "abre el código",
        "qué tecnologías usa"
      ]
    };
  }

  if (
    project?.codigo &&
    project.codigo !== "#"
  ) {
    return {
      answer: `
        Puedes revisar el código de
        <strong>${project.titulo}</strong>
        desde su repositorio.
      `,

      suggestions: [
        "abre el código",
        "qué hace",
        "tiene demo"
      ]
    };
  }

  return {
    answer:
      "Puedes encontrar más información en la sección de proyectos del portafolio.",

    action: {
      type: "section",
      target: "#projects"
    },

    direct: false,

    suggestions: [
      "sí",
      "proyectos",
      "contacto"
    ]
  };
}

function getHowResponse(
  message,
  context
) {
  if (
    message !== "como" &&
    message !== "y como"
  ) {
    return null;
  }

  const project =
    context.activeProject;

  if (!project) {
    return null;
  }

  const stack =
    getProjectStack(project);

  return {
    answer: `
      <strong>${project.titulo}</strong>
      fue desarrollado utilizando:

      <br><br>

      ${
        stack.length
          ? stack
              .map(item => `• ${item}`)
              .join("<br>")
          : "No hay tecnologías registradas."
      }

      <br><br>

      El proyecto se organizó combinando
      las herramientas necesarias para resolver
      su objetivo principal y mantener el código
      escalable y fácil de mantener.
    `,

    projects: [
      project
    ],

    suggestions: [
      "qué hace",
      "tiene código",
      "abre el proyecto"
    ]
  };
}

function getWithWhatResponse(
  message,
  context
) {
  if (
    message !== "con que" &&
    message !== "y con que"
  ) {
    return null;
  }

  const project =
    context.activeProject;

  if (!project) {
    return null;
  }

  const stack =
    getProjectStack(project);

  return {
    answer: `
      Se desarrolló principalmente con:

      <br><br>

      ${
        stack.length
          ? stack
              .map(item => `• ${item}`)
              .join("<br>")
          : "Tecnologías no especificadas."
      }
    `,

    projects: [
      project
    ],

    suggestions: [
      "qué hace",
      "tiene demo",
      "tiene código"
    ]
  };
}

function getProjectStack(project) {
  return Array.isArray(project?.stack)
    ? project.stack
    : [];
}

function getComparisonSuggestions() {
  return [
    "cuál es más complejo",
    "cuál usa más tecnologías",
    "cuál recomendarías"
  ];
}