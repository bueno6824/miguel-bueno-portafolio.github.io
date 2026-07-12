import {
  chatbotContext
} from "./chatbotState.js";

import {
  getProjects
} from "./chatbotProjects.js";

import {
  calculateComplexityScore
} from "./chatbotAnalysis.js";

import {
  normalizeText
} from "./chatbotUtils.js";

/* ==============================
   GUIDE RESPONSE
============================== */

export function getGuideResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  /*
   * Primero detectamos si el usuario
   * quiere comenzar el recorrido.
   */

  const activation =
    detectGuideActivation(
      normalizedMessage
    );

  if (activation) {
    return startGuideMode(
      activation
    );
  }

  /*
   * Si el modo ya está activo,
   * procesamos los comandos del recorrido.
   */

  if (
    chatbotContext.guideMode.active
  ) {
    return handleActiveGuide(
      normalizedMessage
    );
  }

  return null;
}

function detectGuideActivation(message) {
  const recruiterPatterns = [
    "soy reclutador",
    "soy recruiter",
    "vengo de recursos humanos",
    "estoy evaluando candidatos",
    "quiero evaluar el portafolio",
    "que deberia revisar primero",
    "que debería revisar primero",
    "guiame por el portafolio",
    "guíame por el portafolio"
  ];

  const vacancyPatterns = [
    "tengo una vacante",
    "busco un desarrollador",
    "busco desarrollador",
    "necesito un desarrollador",
    "estoy contratando"
  ];

  const isRecruiter =
    matchesAny(
      message,
      recruiterPatterns
    );

  const hasVacancy =
    matchesAny(
      message,
      vacancyPatterns
    );

  if (
    !isRecruiter &&
    !hasVacancy
  ) {
    return null;
  }

  return {
    audience: "recruiter",
    profile:
      detectProfessionalProfile(
        message
      )
  };
}

function detectProfessionalProfile(  message) {
  const profiles = [
    {
      id: "frontend",
      patterns: [
        "frontend",
        "front end",
        "interfaces",
        "html",
        "css",
        "javascript"
      ]
    },
    {
      id: "backend",
      patterns: [
        "backend",
        "back end",
        "api",
        "servidor",
        "node",
        "express",
        "mysql",
        "base de datos"
      ]
    },
    {
      id: "fullstack",
      patterns: [
        "full stack",
        "fullstack",
        "frontend y backend"
      ]
    },
    {
      id: "iot",
      patterns: [
        "iot",
        "arduino",
        "esp32",
        "hardware",
        "sensores",
        "sistemas embebidos"
      ]
    }
  ];

  const detectedProfile =
    profiles.find(profile =>
      matchesAny(
        message,
        profile.patterns
      )
    );

  return detectedProfile?.id || null;
}

function startGuideMode({  audience,  profile}) {
  const recommendedProjects =
    getGuideProjects(profile);

  chatbotContext.guideMode = {
    active: true,
    audience,
    profile,
    currentStep: 1,
    recommendedProjects,
    completedSteps: []
  };

  chatbotContext.lastTopic =
    "portfolio-guide";

  if (recommendedProjects.length) {
    chatbotContext.lastProjects =
      recommendedProjects;

    chatbotContext.lastProjectsShown =
      recommendedProjects;

    chatbotContext.lastRecommendedProject =
      recommendedProjects[0];

    chatbotContext.lastMentionedProject =
      recommendedProjects[0];
  }

  const profileLabel =
    getProfileLabel(profile);

  return {
    answer: `
      <strong>👔 Modo guía activado</strong>

      <br><br>

      ${
        profile
          ? `
            Detecté que estás evaluando un perfil
            <strong>${profileLabel}</strong>.
          `
          : `
            Te guiaré por los puntos más importantes
            del portafolio profesional de Miguel.
          `
      }

      <br><br>

      Te recomiendo este recorrido:

      <br><br>

      <strong>1.</strong> Revisar el proyecto más relevante
      <br>
      <strong>2.</strong> Analizar las tecnologías y arquitectura
      <br>
      <strong>3.</strong> Consultar GitHub
      <br>
      <strong>4.</strong> Revisar habilidades y herramientas
      <br>
      <strong>5.</strong> Ir a contacto

      <br><br>

      Empezaremos por el proyecto que mejor representa
      sus capacidades para este perfil.
    `,

    projects:
      recommendedProjects.slice(0, 2),

    suggestions: [
      "comenzar recorrido",
      "ver proyecto recomendado",
      "salir del modo guía",
      "¿por qué contratar a Miguel?"
    ]
  };
}

function getGuideProjects(profile) {
  const projects =
    getProjects();

  if (!projects.length) {
    return [];
  }

  return [...projects]
    .map(project => ({
      project,
      score:
        calculateGuideScore(
          project,
          profile
        )
    }))
    .sort(
      (firstResult, secondResult) =>
        secondResult.score -
        firstResult.score
    )
    .map(result =>
      result.project
    )
    .slice(0, 3);
}
function calculateGuideScore(  project,  profile) {
  let score =
    calculateComplexityScore(
      project
    );

  const searchableText =
    getProjectSearchableText(
      project
    );

  const profileTechnologies = {
    frontend: [
      "html",
      "css",
      "javascript",
      "bootstrap",
      "tailwind",
      "react",
      "web"
    ],

    backend: [
      "node",
      "express",
      "mysql",
      "php",
      "laravel",
      "api",
      "backend"
    ],

    fullstack: [
      "html",
      "css",
      "javascript",
      "node",
      "express",
      "mysql",
      "php",
      "full stack"
    ],

    iot: [
      "arduino",
      "esp32",
      "iot",
      "sensor",
      "hardware",
      "c++"
    ]
  };

  const technologies =
    profileTechnologies[profile] ||
    [];

  technologies.forEach(
    technology => {
      if (
        searchableText.includes(
          technology
        )
      ) {
        score += 4;
      }
    }
  );

  if (
    project.demo &&
    project.demo !== "#"
  ) {
    score += 3;
  }

  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    score += 3;
  }

  if (project.imagenPortada) {
    score += 1;
  }

  return score;
}

function getProjectSearchableText(project) {
  const values = [
    project.id,
    project.titulo,
    project.categoria,
    project.nivel,
    project.descripcionCorta,
    project.descripcionLarga,
    ...(Array.isArray(project.stack)
      ? project.stack
      : [])
  ];

  return normalizeText(
    values
      .filter(Boolean)
      .join(" ")
  );
}

function handleActiveGuide(message) {
  if (
    matchesAny(message, [
      "salir del modo guia",
      "terminar recorrido",
      "cancelar recorrido",
      "cerrar guia",
      "modo normal"
    ])
  ) {
    return stopGuideMode();
  }

  if (
    matchesAny(message, [
      "comenzar recorrido",
      "iniciar recorrido",
      "empezar recorrido"
    ])
  ) {
    chatbotContext.guideMode.currentStep = 1;

    return getGuideStepResponse(1);
  }

  if (
    matchesAny(message, [
      "siguiente paso",
      "continuar",
      "continua",
      "avanzar",
      "siguiente"
    ])
  ) {
    return advanceGuideStep();
  }

  if (
    matchesAny(message, [
      "paso anterior",
      "regresar paso",
      "volver al paso anterior",
      "anterior"
    ])
  ) {
    return previousGuideStep();
  }

  if (
    matchesAny(message, [
      "ver proyecto recomendado",
      "muestra el proyecto recomendado",
      "abre el recomendado"
    ])
  ) {
    return getRecommendedGuideProject();
  }

  if (
    matchesAny(message, [
      "abrir github",
      "abre github",
      "ver github",
      "ir a github",
      "muestra github"
    ])
  ) {
    return openGuideGitHub();
  }

  if (
    matchesAny(message, [
      "ver habilidades",
      "ir a habilidades",
      "muestra habilidades",
      "ver skills"
    ])
  ) {
    return openGuideSection(
      "#skills",
      "habilidades"
    );
  }

  if (
    matchesAny(message, [
      "ver herramientas",
      "ir a herramientas",
      "muestra herramientas"
    ])
  ) {
    return openGuideSection(
      "#tools",
      "herramientas"
    );
  }

  if (
    matchesAny(message, [
      "ir a contacto",
      "ver contacto",
      "contactar",
      "quiero contactar",
      "contacto"
    ])
  ) {
    return openGuideSection(
      "#contact",
      "contacto"
    );
  }

  if (
    matchesAny(message, [
      "en que paso voy",
      "que paso sigue",
      "estado del recorrido",
      "paso actual"
    ])
  ) {
    return getGuideProgressResponse();
  }

  return null;
}

function getGuideStepResponse(step) {
  switch (step) {
    case 1:
      return getGuideProjectStep();

    case 2:
      return getGuideArchitectureStep();

    case 3:
      return getGuideGitHubStep();

    case 4:
      return getGuideSkillsStep();

    case 5:
      return getGuideContactStep();

    default:
      return finishGuide();
  }
}

function advanceGuideStep() {
  const guideMode =
    chatbotContext.guideMode;

  const currentStep =
    Number(guideMode.currentStep) || 1;

  markGuideStepCompleted(
    currentStep
  );

  const nextStep =
    currentStep + 1;

  if (nextStep > 5) {
    return finishGuide();
  }

  guideMode.currentStep =
    nextStep;

  return getGuideStepResponse(
    nextStep
  );
}

function previousGuideStep() {
  const guideMode =
    chatbotContext.guideMode;

  const currentStep =
    Number(guideMode.currentStep) || 1;

  const previousStep =
    Math.max(
      currentStep - 1,
      1
    );

  guideMode.currentStep =
    previousStep;

  return getGuideStepResponse(
    previousStep
  );
}

function markGuideStepCompleted(step) {
  const completedSteps =
    chatbotContext
      .guideMode
      .completedSteps;

  if (
    !Array.isArray(completedSteps)
  ) {
    chatbotContext
      .guideMode
      .completedSteps = [];
  }

  if (
    !chatbotContext
      .guideMode
      .completedSteps
      .includes(step)
  ) {
    chatbotContext
      .guideMode
      .completedSteps
      .push(step);
  }
}

function getGuideProjectStep() {
  const project =
    chatbotContext
      .guideMode
      .recommendedProjects[0];

  if (!project) {
    return {
      answer:
        "No pude encontrar un proyecto recomendado para iniciar el recorrido 😅.",

      suggestions: [
        "proyectos",
        "herramientas",
        "contacto"
      ]
    };
  }

  chatbotContext.lastRecommendedProject =
    project;

  chatbotContext.lastMentionedProject =
    project;

  return {
    answer: `
      <strong>📌 Paso 1 de 5: Proyecto recomendado</strong>

      <br><br>

      Te recomiendo comenzar con
      <strong>${project.titulo}</strong>.

      <br><br>

      Este proyecto fue seleccionado según:

      <br><br>

      • Su relación con la vacante
      <br>
      • Las tecnologías utilizadas
      <br>
      • Su nivel técnico
      <br>
      • La disponibilidad de código o demo
      <br>
      • La calidad de su presentación

      <br><br>

      Puedes abrirlo o continuar con el análisis
      de su arquitectura.
    `,

    projects: [
      project
    ],

    suggestions: [
      "abre el recomendado",
      "qué tecnologías usa",
      "siguiente paso"
    ]
  };
}

function getGuideArchitectureStep() {
  const project =
    getCurrentGuideProject();

  if (!project) {
    return {
      answer:
        "No encontré un proyecto activo para analizar.",

      suggestions: [
        "ver proyecto recomendado",
        "proyectos",
        "siguiente paso"
      ]
    };
  }

  const stack =
    Array.isArray(project.stack)
      ? project.stack
      : [];

  return {
    answer: `
      <strong>🧠 Paso 2 de 5: Tecnologías y arquitectura</strong>

      <br><br>

      El proyecto
      <strong>${project.titulo}</strong>
      utiliza principalmente:

      <br><br>

      ${
        stack.length
          ? stack
              .map(
                technology =>
                  `• ${technology}`
              )
              .join("<br>")
          : "No hay tecnologías registradas."
      }

      <br><br>

      Este paso permite evaluar aspectos como:

      <br><br>

      • Organización del código
      <br>
      • Separación de responsabilidades
      <br>
      • Manejo de componentes y módulos
      <br>
      • Uso de tecnologías apropiadas
      <br>
      • Escalabilidad y mantenimiento

      <br><br>

      Después puedes revisar el código público
      desde GitHub.
    `,

    projects: [
      project
    ],

    suggestions: [
      "tiene código",
      "abre el código",
      "siguiente paso"
    ]
  };
}

function getGuideGitHubStep() {
  const project =
    getCurrentGuideProject();

  const hasProjectCode =
    Boolean(
      project?.codigo &&
      project.codigo !== "#"
    );

  return {
    answer: `
      <strong>💻 Paso 3 de 5: GitHub y código</strong>

      <br><br>

      GitHub permite revisar directamente:

      <br><br>

      • Estructura de carpetas
      <br>
      • Organización de módulos
      <br>
      • Historial de commits
      <br>
      • Documentación del proyecto
      <br>
      • Calidad y legibilidad del código

      <br><br>

      ${
        hasProjectCode
          ? `
            El proyecto recomendado tiene un
            repositorio disponible.
          `
          : `
            Puedes revisar el perfil general
            de GitHub de Miguel.
          `
      }
    `,

    projects:
      project
        ? [project]
        : [],

    suggestions: hasProjectCode
      ? [
          "abre el código",
          "abrir github",
          "siguiente paso"
        ]
      : [
          "abrir github",
          "siguiente paso",
          "ver habilidades"
        ]
  };
}

function openGuideGitHub() {
  return {
    answer:
      "💻 Abriendo el perfil de GitHub de Miguel.",

    action: {
      type: "link",
      url:
        "https://github.com/bueno6824"
    },

    direct: true,

    suggestions: [
      "siguiente paso",
      "ver habilidades",
      "ver herramientas"
    ]
  };
}

function getGuideSkillsStep() {
  return {
    answer: `
      <strong>🛠 Paso 4 de 5: Habilidades y herramientas</strong>

      <br><br>

      Ahora conviene revisar las tecnologías
      y herramientas que Miguel utiliza en sus
      proyectos.

      <br><br>

      Entre sus áreas principales están:

      <br><br>

      • Desarrollo Frontend
      <br>
      • JavaScript y arquitectura modular
      <br>
      • Desarrollo Backend y bases de datos
      <br>
      • Git y GitHub
      <br>
      • Arduino, sensores e IoT
      <br>
      • Diseño responsive y experiencia de usuario

      <br><br>

      Puedes visitar la sección de habilidades
      o la sección de herramientas.
    `,

    suggestions:
  getGuideNavigationSuggestions()
  };
}

function getGuideContactStep() {
  return {
    answer: `
      <strong>📩 Paso 5 de 5: Contacto</strong>

      <br><br>

      Ya revisaste:

      <br><br>

      ✅ Proyecto recomendado
      <br>
      ✅ Tecnologías y arquitectura
      <br>
      ✅ GitHub y código
      <br>
      ✅ Habilidades y herramientas

      <br><br>

      El último paso es visitar la sección de
      contacto para enviar un mensaje directo
      a Miguel.

      <br><br>

      Puedes consultar una vacante, solicitar
      más información o proponer una entrevista.
    `,

    suggestions:
  getGuideFinalSuggestions()
  };
}

function openGuideSection(
  target,
  sectionLabel
) {
  if (!target) {
    return null;
  }

  return {
    answer:
      `🚀 Te llevo a la sección de <strong>${sectionLabel}</strong>.`,

    action: {
      type: "section",
      target
    },

    direct: true,

    suggestions:
      getGuideNavigationSuggestions()
  };
}

function getCurrentGuideProject() {
  return (
    chatbotContext
      .guideMode
      .recommendedProjects[0] ||
    chatbotContext.lastRecommendedProject ||
    chatbotContext.lastMentionedProject ||
    null
  );
}

function getGuideProgressResponse() {
  const currentStep =
    chatbotContext
      .guideMode
      .currentStep;

  const completedSteps =
    chatbotContext
      .guideMode
      .completedSteps;

  return {
    answer: `
      <strong>🧭 Progreso del recorrido</strong>

      <br><br>

      Paso actual:
      <strong>${currentStep} de 5</strong>

      <br><br>

      Pasos completados:
      <strong>${
        Array.isArray(completedSteps)
          ? completedSteps.length
          : 0
      }</strong>
    `,

    suggestions: [
      "siguiente paso",
      "paso anterior",
      "salir del modo guía"
    ]
  };
}

function finishGuide() {
  markGuideStepCompleted(5);

  chatbotContext
    .guideMode
    .currentStep = 5;

  return {
    answer: `
      <strong>🎉 Recorrido completado</strong>

      <br><br>

      Ya revisaste los puntos más importantes
      del portafolio profesional de Miguel:

      <br><br>

      ✅ Proyecto destacado
      <br>
      ✅ Arquitectura y tecnologías
      <br>
      ✅ Código en GitHub
      <br>
      ✅ Habilidades profesionales
      <br>
      ✅ Opciones de contacto

      <br><br>

      Puedes contactar a Miguel o seguir
      explorando otros proyectos.
    `,

    suggestions: [
      "ir a contacto",
      "ver proyectos",
      "salir del modo guía"
    ]
  };
}

function getRecommendedGuideProject() {
  const project =
    chatbotContext
      .guideMode
      .recommendedProjects[0];

  if (!project) {
    return null;
  }

  chatbotContext.lastRecommendedProject =
    project;

  chatbotContext.lastMentionedProject =
    project;

  return {
    answer:
      `🚀 Abriendo el proyecto recomendado: <strong>${project.titulo}</strong>.`,

    action: {
      type: "project",
      projectId: project.id
    },

    direct: true,

    suggestions: [
      "qué tecnologías usa",
      "tiene demo",
      "siguiente paso"
    ]
  };
}

function stopGuideMode() {
  chatbotContext.guideMode = {
    active: false,
    audience: null,
    profile: null,
    currentStep: 0,
    recommendedProjects: [],
    completedSteps: []
  };

  chatbotContext.lastTopic =
    null;

  return {
    answer:
      "✅ Recorrido finalizado. Regresamos al modo normal del chatbot.",

    suggestions: [
      "proyectos",
      "herramientas",
      "contacto"
    ]
  };
}

function getProfileLabel(profile) {
  const labels = {
    frontend:
      "Frontend",

    backend:
      "Backend",

    fullstack:
      "Full Stack",

    iot:
      "IoT y sistemas embebidos"
  };

  return (
    labels[profile] ||
    "desarrollo de software"
  );
}

function matchesAny(
  message,
  patterns = []
) {
  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

function getGuideNavigationSuggestions() {
  return [
    "ver habilidades",
    "ver herramientas",
    "ir a contacto",
    "siguiente paso"
  ];
}

function getGuideFinalSuggestions() {
  return [
    "ir a contacto",
    "ver habilidades",
    "ver herramientas",
    "finalizar recorrido"
  ];
}