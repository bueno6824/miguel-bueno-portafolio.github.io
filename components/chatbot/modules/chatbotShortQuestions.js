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

// Normaliza preguntas cortas para facilitar su análisis.
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

// Obtiene una respuesta para preguntas cortas relacionadas con el contexto actual.
export function getShortQuestionResponse(
  message
) {
  // Normaliza el mensaje recibido.
  const normalizedMessage =
    normalizeShortQuestion(message);

  // Ignora mensajes vacíos.
  if (!normalizedMessage) {
    return null;
  }

  // Verifica si el mensaje corresponde a una pregunta contextual corta.
  if (
    !isShortContextualQuestion(
      normalizedMessage
    )
  ) {
    return null;
  }

  // Obtiene el contexto actual de la conversación.
  const context =
    getConversationContext();

  // Intenta resolver la pregunta según su tipo.
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

// Determina si el mensaje es una pregunta corta que depende del contexto.
function isShortContextualQuestion(
  message
) {
  // Divide el mensaje en palabras.
  const words =
    message
      .split(/\s+/)
      .filter(Boolean);

  // Limita las preguntas consideradas como cortas.
  if (words.length > 7) {
    return false;
  }

  // Patrones de preguntas contextuales reconocidos.
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

  // Comprueba si el mensaje coincide con alguno de los patrones.
  return patterns.some(pattern =>
    message === pattern ||
    message.startsWith(
      `${pattern} `
    )
  );
}

// Genera respuestas para preguntas relacionadas con el motivo de una elección.
function getWhyResponse(
  message,
  context
) {
  // Verifica que la pregunta corresponda a "por qué".
  if (
    message !== "por que" &&
    message !== "y por que"
  ) {
    return null;
  }

  // Si está activo el modo guía y existe un proyecto actual, responde sobre él.
  if (
    context.guideActive &&
    context.activeProject
  ) {
    return buildGuideWhyResponse(
      context.activeProject,
      context
    );
  }

  // Si existe una comparación activa, responde sobre los proyectos comparados.
  if (
    context.comparisonActive
  ) {
    return buildComparisonWhyResponse(
      context.comparisonProjects
    );
  }

  // Si existe un proyecto activo, genera una explicación sobre él.
  if (context.activeProject) {
    return buildProjectWhyResponse(
      context.activeProject
    );
  }

  // No existe suficiente contexto para responder.
  return null;
}

// Construye la respuesta de "por qué" cuando el chatbot está en modo guía.
function buildGuideWhyResponse(
  project,
  context
) {
  // Obtiene las tecnologías utilizadas por el proyecto.
  const stack =
    getProjectStack(project);

  // Almacena las razones que se mostrarán al usuario.
  const reasons = [];

  // Agrega como razón la cantidad de tecnologías principales.
  if (stack.length) {
    reasons.push(
      `utiliza ${stack.length} tecnologías principales`
    );
  }

  // Comprueba si el proyecto cuenta con una demo válida.
  if (
    project.demo &&
    project.demo !== "#"
  ) {
    reasons.push(
      "cuenta con una demostración disponible"
    );
  }

  // Comprueba si el proyecto cuenta con un repositorio válido.
  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    reasons.push(
      "permite revisar el código fuente"
    );
  }

  // Agrega la relación con el perfil profesional evaluado.
  reasons.push(
    `se relaciona con el perfil ${context.professionalProfile ||
    "profesional evaluado"
    }`
  );

  // Devuelve la respuesta estructurada.
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
      <strong>${calculateComplexityScore(project)
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

// Construye la respuesta de "por qué" cuando existen dos proyectos en comparación.
function buildComparisonWhyResponse(
  projects
) {
  // Verifica que existan al menos dos proyectos para comparar.
  if (
    !Array.isArray(projects) ||
    projects.length < 2
  ) {
    return null;
  }

  // Obtiene los dos primeros proyectos de la comparación.
  const [
    firstProject,
    secondProject
  ] = projects;

  // Calcula la complejidad estimada del primer proyecto.
  const firstScore =
    calculateComplexityScore(
      firstProject
    );

  // Calcula la complejidad estimada del segundo proyecto.
  const secondScore =
    calculateComplexityScore(
      secondProject
    );

  // Cuando ambos tienen la misma puntuación, muestra una comparación equilibrada.
  if (firstScore === secondScore) {
    return {
      answer: `
        Los dos proyectos tienen una
        puntuación técnica similar.

        <br><br>

        <strong>${firstProject.titulo}</strong>
        destaca en
        <strong>${firstProject.categoria ||
        "su categoría"
        }</strong>,

        mientras que

        <strong>${secondProject.titulo}</strong>
        demuestra capacidades en
        <strong>${secondProject.categoria ||
        "otra área"
        }</strong>.
      `,

      projects,

      suggestions:
        getComparisonSuggestions()
    };
  }

  // Selecciona el proyecto con mayor puntuación de complejidad.
  const winner =
    firstScore > secondScore
      ? firstProject
      : secondProject;

  // Devuelve la explicación basada en el análisis de complejidad.
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

// Construye la respuesta de "por qué" para un proyecto activo.
function buildProjectWhyResponse(
  project
) {
  // Obtiene las tecnologías principales del proyecto.
  const stack =
    getProjectStack(project);

  // Devuelve la información utilizada para explicar la relevancia del proyecto.
  return {
    answer: `
      <strong>${project.titulo}</strong>
      es relevante porque combina:

      <br><br>

      • Categoría:
      <strong>${project.categoria ||
      "no especificada"
      }</strong>
      <br>

      • Nivel:
      <strong>${project.nivel ||
      "no especificado"
      }</strong>
      <br>

      • Tecnologías principales:
      <strong>${stack.length}</strong>
      <br>

      • Complejidad estimada:
      <strong>${calculateComplexityScore(project)
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

// Genera respuestas para preguntas relacionadas con cuál proyecto está activo o en comparación.
function getWhichResponse(
  message,
  context
) {
  // Verifica que la pregunta corresponda a "cuál".
  if (
    message !== "cual" &&
    message !== "y cual"
  ) {
    return null;
  }

  // Si existe una comparación activa, muestra los proyectos involucrados.
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

  // Si existe un proyecto activo, informa cuál es.
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

  // No existe un proyecto o comparación activa.
  return null;
}

// Genera respuestas relacionadas con el año del proyecto activo.
function getWhenResponse(
  message,
  context
) {
  // Verifica que la pregunta corresponda a "cuándo".
  if (
    message !== "cuando" &&
    message !== "y cuando"
  ) {
    return null;
  }

  // Obtiene el proyecto actualmente activo.
  const project =
    context.activeProject;

  // No puede responder si no existe un proyecto activo.
  if (!project) {
    return null;
  }

  // Devuelve el año registrado del proyecto.
  return {
    answer: `
      <strong>${project.titulo}</strong>
      está registrado en el año
      <strong>${project.año ||
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

// Genera respuestas relacionadas con dónde consultar el proyecto.
function getWhereResponse(
  message,
  context
) {
  // Verifica que la pregunta corresponda a "dónde".
  if (
    message !== "donde" &&
    message !== "y donde"
  ) {
    return null;
  }

  // Obtiene el proyecto actualmente activo.
  const project =
    context.activeProject;

  // Si existe una demo válida, ofrece abrirla.
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

  // Si no existe demo, pero sí código disponible, informa sobre el repositorio.
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

  // Si no existe demo ni código, dirige a la sección de proyectos.
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

// Genera respuestas relacionadas con cómo fue desarrollado el proyecto.
function getHowResponse(
  message,
  context
) {
  // Verifica que la pregunta corresponda a "cómo".
  if (
    message !== "como" &&
    message !== "y como"
  ) {
    return null;
  }

  // Obtiene el proyecto actualmente activo.
  const project =
    context.activeProject;

  // No puede responder si no existe un proyecto activo.
  if (!project) {
    return null;
  }

  // Obtiene las tecnologías utilizadas por el proyecto.
  const stack =
    getProjectStack(project);

  // Devuelve la explicación sobre el desarrollo del proyecto.
  return {
    answer: `
      <strong>${project.titulo}</strong>
      fue desarrollado utilizando:

      <br><br>

      ${stack.length
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

// Genera respuestas relacionadas con las tecnologías utilizadas.
function getWithWhatResponse(
  message,
  context
) {
  // Verifica que la pregunta corresponda a "con qué".
  if (
    message !== "con que" &&
    message !== "y con que"
  ) {
    return null;
  }

  // Obtiene el proyecto actualmente activo.
  const project =
    context.activeProject;

  // No puede responder si no existe un proyecto activo.
  if (!project) {
    return null;
  }

  // Obtiene las tecnologías principales del proyecto.
  const stack =
    getProjectStack(project);

  // Devuelve la lista de tecnologías utilizadas.
  return {
    answer: `
      Se desarrolló principalmente con:

      <br><br>

      ${stack.length
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

// Obtiene el stack tecnológico del proyecto de forma segura.
function getProjectStack(project) {
  return Array.isArray(project?.stack)
    ? project.stack
    : [];
}

// Obtiene las sugerencias disponibles para preguntas de comparación.
function getComparisonSuggestions() {
  return [
    "cuál es más complejo",
    "cuál usa más tecnologías",
    "cuál recomendarías"
  ];
}