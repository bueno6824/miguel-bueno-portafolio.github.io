import {
  getProjects,
  getProjectById
} from "./chatbotProjects.js";

import {
  calculateComplexityScore
} from "./chatbotAnalysis.js";

import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText
} from "./chatbotUtils.js"

/* ==============================
   COMPARISON RESPONSE
============================== */

export function getComparisonResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  /*
   * Primero intentamos responder usando
   * los dos proyectos comparados previamente.
   */

  const contextualResponse =
    getComparisonFollowUpResponse(
      normalizedMessage
    );

  if (contextualResponse) {
    return contextualResponse;
  }

  /*
   * Si no es una pregunta contextual,
   * comprobamos si solicita una comparación nueva.
   */

  if (
    !isComparisonRequest(
      normalizedMessage
    )
  ) {
    return null;
  }

  const projects =
    getProjectsForComparison(
      normalizedMessage
    );

  if (projects.length < 2) {
    return {
      answer:
        "Necesito identificar dos proyectos para compararlos 😅. Puedes decir, por ejemplo: <strong>“Compara el proyecto 1 con el 2”</strong>.",

      suggestions: [
        "ver proyectos",
        "compara el proyecto 1 con el 2",
        "proyecto más complejo"
      ]
    };
  }

  const [
    firstProject,
    secondProject
  ] = projects;

  chatbotContext.lastTopic =
    "project-comparison";

  chatbotContext.lastProjects = [
    firstProject,
    secondProject
  ];

  return buildComparisonResponse(
    firstProject,
    secondProject
  );
}

/* ==============================
   COMPARISON FOLLOW-UP
============================== */

function getComparisonFollowUpResponse(message) {
  const projects =
    getContextualComparisonProjects();

  if (projects.length < 2) {
    return null;
  }

  const [
    firstProject,
    secondProject
  ] = projects;

  if (
    asksForMoreTechnologies(message)
  ) {
    return buildTechnologyCountResponse(
      firstProject,
      secondProject
    );
  }

  if (
    asksForMoreComplexity(message)
  ) {
    return buildComplexityResponse(
      firstProject,
      secondProject
    );
  }

  if (
    asksForMoreRecent(message)
  ) {
    return buildRecentResponse(
      firstProject,
      secondProject
    );
  }

  const detectedTechnology =
    detectComparedTechnology(
      message,
      firstProject,
      secondProject
    );

  if (detectedTechnology) {
    return buildTechnologyUsageResponse(
      firstProject,
      secondProject,
      detectedTechnology
    );
  }

  if (
    asksForRecruiterRecommendation(
      message
    )
  ) {
    return buildRecruiterRecommendation(
      firstProject,
      secondProject
    );
  }

  if (
    asksForGeneralRecommendation(
      message
    )
  ) {
    return buildGeneralRecommendation(
      firstProject,
      secondProject
    );
  }

  return null;
}

function getContextualComparisonProjects() {
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

function asksForMoreTechnologies(
  message) {
  const patterns = [
    "cual usa mas tecnologias",
    "cual tiene mas tecnologias",
    "cual utiliza mas tecnologias",
    "cual de los dos usa mas",
    "quien usa mas tecnologias",
    "mas tecnologias"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

function asksForMoreComplexity(
  message) {
  const patterns = [
    "cual es mas complejo",
    "cual fue mas complejo",
    "cual es mas dificil",
    "cual fue mas dificil",
    "mayor complejidad",
    "mas complejo",
    "mas dificil"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

function asksForMoreRecent(
  message) {
  const patterns = [
    "cual es mas reciente",
    "cual fue mas reciente",
    "cual es mas nuevo",
    "cual fue el ultimo",
    "cual hiciste despues",
    "mas reciente"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

function asksForRecruiterRecommendation(
  message) {
  const patterns = [
    "mejor para un reclutador",
    "mejor para reclutadores",
    "cual mostrarias a una empresa",
    "cual mostrarias en una entrevista",
    "cual sirve mas para conseguir trabajo",
    "cual demuestra mas experiencia"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

function asksForGeneralRecommendation(
  message) {
  const patterns = [
    "cual recomiendas",
    "cual recomendarias",
    "cual es mejor",
    "con cual te quedas",
    "cual mostrarias",
    "elige uno"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

function matchesAnyPattern(
  message,
  patterns) {
  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

function isComparisonRequest(message) {
  const comparisonKeywords = [
    "compara",
    "comparar",
    "comparalos",
    "comparalos",
    "comparacion",
    "diferencias",
    "diferencia entre",
    "cual de los dos",
    "cual es mejor",
    "entre ambos",
    "entre los dos"
  ];

  return comparisonKeywords.some(
    keyword =>
      message.includes(
        normalizeText(keyword)
      )
  );
}

function getProjectsForComparison(message) {
  const projects =
    getProjects();

  if (projects.length < 2) {
    return [];
  }

  const detectedProjects = [];

  /* ==============================
     IDS EXPLÍCITOS
  ============================== */

  projects.forEach(project => {
    const projectId =
      normalizeText(project.id);

    const projectTitle =
      normalizeText(project.titulo);

    if (
      message.includes(projectId) ||
      (
        projectTitle &&
        message.includes(projectTitle)
      )
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
    refersToPreviousProjects(message)
  ) {
    const contextualProjects =
      Array.isArray(
        chatbotContext.lastProjects
      )
        ? chatbotContext.lastProjects
        : [];

    contextualProjects.forEach(project => {
      addUniqueProject(
        detectedProjects,
        project
      );
    });
  }

  return detectedProjects.slice(0, 2);
}

function extractProjectIndexes(message) {
  const indexes = [];

  const addIndex = index => {
    if (
      index >= 0 &&
      !indexes.includes(index)
    ) {
      indexes.push(index);
    }
  };

  /* ==============================
     REFERENCIAS CON NÚMEROS
  ============================== */

  const numericPatterns = [
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?1\b/g,
      index: 0
    },
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?2\b/g,
      index: 1
    },
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?3\b/g,
      index: 2
    },
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?4\b/g,
      index: 3
    }
  ];

  numericPatterns.forEach(
    ({ regex, index }) => {
      if (regex.test(message)) {
        addIndex(index);
      }
    }
  );

  /* ==============================
     REFERENCIAS ESCRITAS
  ============================== */

  const wordReferences = [
    {
      patterns: [
        "proyecto uno",
        "primer proyecto",
        "el primero",
        "primero"
      ],
      index: 0
    },
    {
      patterns: [
        "proyecto dos",
        "segundo proyecto",
        "el segundo",
        "segundo"
      ],
      index: 1
    },
    {
      patterns: [
        "proyecto tres",
        "tercer proyecto",
        "el tercero",
        "tercero"
      ],
      index: 2
    },
    {
      patterns: [
        "proyecto cuatro",
        "cuarto proyecto",
        "el cuarto",
        "cuarto"
      ],
      index: 3
    }
  ];

  wordReferences.forEach(reference => {
    const matches =
      reference.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      );

    if (matches) {
      addIndex(reference.index);
    }
  });

  return indexes;
}

function refersToPreviousProjects(message) {
  const contextualPatterns = [
    "comparalos",
    "compara esos",
    "compara ambos",
    "entre ellos",
    "entre los dos",
    "cual de esos",
    "cual de los dos",
    "que diferencias tienen"
  ];

  return contextualPatterns.some(
    pattern =>
      message.includes(
        normalizeText(pattern)
      )
  );
}

function addUniqueProject(
  collection,
  project) {
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

function buildComparisonResponse(
  firstProject,
  secondProject) {
  const firstStack =
    getProjectStack(firstProject);

  const secondStack =
    getProjectStack(secondProject);

  const firstComplexity =
    calculateComplexityScore(
      firstProject
    );

  const secondComplexity =
    calculateComplexityScore(
      secondProject
    );

  const sharedTechnologies =
    getSharedTechnologies(
      firstStack,
      secondStack
    );

  const firstUniqueTechnologies =
    getUniqueTechnologies(
      firstStack,
      secondStack
    );

  const secondUniqueTechnologies =
    getUniqueTechnologies(
      secondStack,
      firstStack
    );

  const technologiesWinner =
    compareTechnologyCount(
      firstProject,
      secondProject
    );

  const complexityWinner =
    compareComplexity(
      firstProject,
      secondProject
    );

  const recentWinner =
    compareProjectYears(
      firstProject,
      secondProject
    );

  return {
    answer: `
      <strong>⚖️ Comparación de proyectos</strong>

      <br><br>

      <strong>1. ${firstProject.titulo}</strong>
      <br>
      Categoría:
      <strong>${firstProject.categoria || "No especificada"}</strong>
      <br>
      Nivel:
      <strong>${firstProject.nivel || "No especificado"}</strong>
      <br>
      Año:
      <strong>${firstProject.año || "No especificado"}</strong>
      <br>
      Tecnologías:
      <strong>${firstStack.length}</strong>
      <br>
      Complejidad estimada:
      <strong>${firstComplexity}</strong>

      <br><br>

      <strong>2. ${secondProject.titulo}</strong>
      <br>
      Categoría:
      <strong>${secondProject.categoria || "No especificada"}</strong>
      <br>
      Nivel:
      <strong>${secondProject.nivel || "No especificado"}</strong>
      <br>
      Año:
      <strong>${secondProject.año || "No especificado"}</strong>
      <br>
      Tecnologías:
      <strong>${secondStack.length}</strong>
      <br>
      Complejidad estimada:
      <strong>${secondComplexity}</strong>

      <br><br>

      <strong>📊 Resultado</strong>

      <br><br>

      • Más tecnologías:
      <strong>${technologiesWinner}</strong>

      <br>

      • Mayor complejidad estimada:
      <strong>${complexityWinner}</strong>

      <br>

      • Más reciente:
      <strong>${recentWinner}</strong>

      ${buildTechnologiesComparison(
        sharedTechnologies,
        firstUniqueTechnologies,
        secondUniqueTechnologies,
        firstProject,
        secondProject
      )}
    `,

    projects: [
      firstProject,
      secondProject
    ],

    suggestions: [
      "¿cuál es mejor para un reclutador?",
      "¿cuál es más complejo?",
      "ver proyectos"
    ]
  };
}

function getProjectStack(project) {
  return Array.isArray(project?.stack)
    ? project.stack
    : [];
}

function getSharedTechnologies(
  firstStack,
  secondStack) {
  return firstStack.filter(
    technology =>
      secondStack.some(item =>
        normalizeText(item) ===
        normalizeText(technology)
      )
  );
}

function getUniqueTechnologies(
  sourceStack,
  comparisonStack) {
  return sourceStack.filter(
    technology =>
      !comparisonStack.some(item =>
        normalizeText(item) ===
        normalizeText(technology)
      )
  );
}

function compareTechnologyCount(
  firstProject,
  secondProject) {
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

function compareComplexity(
  firstProject,
  secondProject) {
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

function compareProjectYears(
  firstProject,
  secondProject) {
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

function buildTechnologiesComparison(
  sharedTechnologies,
  firstUniqueTechnologies,
  secondUniqueTechnologies,
  firstProject,
  secondProject) {
  const sections = [];

  if (sharedTechnologies.length) {
    sections.push(`
      <br><br>
      <strong>🤝 Tecnologías compartidas:</strong>
      <br>
      ${sharedTechnologies.join(", ")}
    `);
  }

  if (firstUniqueTechnologies.length) {
    sections.push(`
      <br><br>
      <strong>🔹 Exclusivas de ${firstProject.titulo}:</strong>
      <br>
      ${firstUniqueTechnologies.join(", ")}
    `);
  }

  if (secondUniqueTechnologies.length) {
    sections.push(`
      <br><br>
      <strong>🔸 Exclusivas de ${secondProject.titulo}:</strong>
      <br>
      ${secondUniqueTechnologies.join(", ")}
    `);
  }

  return sections.join("");
}

function buildTechnologyCountResponse(
  firstProject,
  secondProject) {
  const firstCount =
    getProjectStack(
      firstProject
    ).length;

  const secondCount =
    getProjectStack(
      secondProject
    ).length;

  if (firstCount === secondCount) {
    return {
      answer: `
        Ambos proyectos utilizan la misma cantidad:
        <strong>${firstCount}</strong>
        tecnologías principales.
      `,

      projects: [
        firstProject,
        secondProject
      ],

      suggestions:
        getComparisonSuggestions()
    };
  }

  const winner =
    firstCount > secondCount
      ? firstProject
      : secondProject;

  const winnerCount =
    Math.max(
      firstCount,
      secondCount
    );

  const otherCount =
    Math.min(
      firstCount,
      secondCount
    );

  return {
    answer: `
      <strong>${winner.titulo}</strong>
      utiliza más tecnologías:

      <br><br>

      <strong>${winnerCount}</strong>
      frente a
      <strong>${otherCount}</strong>
      del otro proyecto.
    `,

    projects: [
      winner
    ],

    suggestions:
      getComparisonSuggestions()
  };
}

function buildComplexityResponse(
  firstProject,
  secondProject) {
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
        Ambos proyectos tienen la misma puntuación
        estimada de complejidad:
        <strong>${firstScore}</strong>.
      `,

      projects: [
        firstProject,
        secondProject
      ],

      suggestions:
        getComparisonSuggestions()
    };
  }

  const winner =
    firstScore > secondScore
      ? firstProject
      : secondProject;

  const winnerScore =
    Math.max(
      firstScore,
      secondScore
    );

  const otherScore =
    Math.min(
      firstScore,
      secondScore
    );

  return {
    answer: `
      Según el análisis del stack, nivel,
      categoría, multimedia y enlaces,
      <strong>${winner.titulo}</strong>
      es el más complejo.

      <br><br>

      Puntuación estimada:
      <strong>${winnerScore}</strong>
      frente a
      <strong>${otherScore}</strong>.
    `,

    projects: [
      winner
    ],

    suggestions:
      getComparisonSuggestions()
  };
}

function buildRecentResponse(
  firstProject,
  secondProject) {
  const firstYear =
    getProjectYear(
      firstProject
    );

  const secondYear =
    getProjectYear(
      secondProject
    );

  if (firstYear === secondYear) {
    return {
      answer: `
        Ambos proyectos están registrados en el año
        <strong>${firstYear || "no especificado"}</strong>.
      `,

      projects: [
        firstProject,
        secondProject
      ],

      suggestions:
        getComparisonSuggestions()
    };
  }

  const winner =
    firstYear > secondYear
      ? firstProject
      : secondProject;

  return {
    answer: `
      El más reciente es
      <strong>${winner.titulo}</strong>,
      registrado en
      <strong>${winner.año}</strong>.
    `,

    projects: [
      winner
    ],

    suggestions:
      getComparisonSuggestions()
  };
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

function detectComparedTechnology(
  message,
  firstProject,
  secondProject) {
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

function buildTechnologyUsageResponse(
  firstProject,
  secondProject,
  technology) {
  const firstUsesTechnology =
    projectUsesTechnology(
      firstProject,
      technology
    );

  const secondUsesTechnology =
    projectUsesTechnology(
      secondProject,
      technology
    );

  if (
    firstUsesTechnology &&
    secondUsesTechnology
  ) {
    return {
      answer: `
        Ambos proyectos utilizan
        <strong>${technology}</strong>.
      `,

      projects: [
        firstProject,
        secondProject
      ],

      suggestions:
        getComparisonSuggestions()
    };
  }

  if (
    !firstUsesTechnology &&
    !secondUsesTechnology
  ) {
    return {
      answer: `
        Ninguno de los dos proyectos registra
        <strong>${technology}</strong>
        dentro de su stack principal.
      `,

      suggestions:
        getComparisonSuggestions()
    };
  }

  const winner =
    firstUsesTechnology
      ? firstProject
      : secondProject;

  return {
    answer: `
      El proyecto que utiliza
      <strong>${technology}</strong>
      es
      <strong>${winner.titulo}</strong>.
    `,

    projects: [
      winner
    ],

    suggestions:
      getComparisonSuggestions()
  };
}

function projectUsesTechnology(
  project,
  technology) {
  const normalizedTechnology =
    normalizeText(technology);

  return getProjectStack(
    project
  ).some(item =>
    normalizeText(item) ===
    normalizedTechnology
  );
}

function buildGeneralRecommendation(
  firstProject,
  secondProject) {
  const firstScore =
    calculateGeneralProjectScore(
      firstProject
    );

  const secondScore =
    calculateGeneralProjectScore(
      secondProject
    );

  if (firstScore === secondScore) {
    return {
      answer: `
        Los dos proyectos tienen fortalezas similares.

        <br><br>

        <strong>${firstProject.titulo}</strong>
        destaca por su enfoque
        <strong>${firstProject.categoria || "general"}</strong>,

        mientras que

        <strong>${secondProject.titulo}</strong>
        demuestra habilidades en
        <strong>${secondProject.categoria || "otra área"}</strong>.

        <br><br>

        La mejor elección depende del tipo de vacante
        o habilidad que quieras demostrar.
      `,

      projects: [
        firstProject,
        secondProject
      ],

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
      Como recomendación general elegiría
      <strong>${winner.titulo}</strong>.

      <br><br>

      Su combinación de tecnologías,
      complejidad, nivel y recursos disponibles
      lo convierte en una muestra más completa
      del trabajo realizado.
    `,

    projects: [
      winner
    ],

    suggestions:
      getComparisonSuggestions()
  };
}

function calculateGeneralProjectScore(
  project) {
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

function buildRecruiterRecommendation(
  firstProject,
  secondProject) {
  const firstScore =
    calculateRecruiterScore(
      firstProject
    );

  const secondScore =
    calculateRecruiterScore(
      secondProject
    );

  if (firstScore === secondScore) {
    return {
      answer: `
        Para un reclutador, ambos proyectos aportan
        señales valiosas pero diferentes.

        <br><br>

        <strong>${firstProject.titulo}</strong>
        demuestra experiencia en
        <strong>${firstProject.categoria || "su área"}</strong>,

        mientras que

        <strong>${secondProject.titulo}</strong>
        muestra capacidades en
        <strong>${secondProject.categoria || "otra especialidad"}</strong>.

        <br><br>

        La elección dependería del perfil de la vacante.
      `,

      projects: [
        firstProject,
        secondProject
      ],

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
      Para presentarlo a un reclutador,
      recomendaría
      <strong>${winner.titulo}</strong>.

      <br><br>

      Tiene una combinación más fuerte de stack,
      complejidad, documentación, código y
      demostración disponible.

      <br><br>

      Aun así, la recomendación puede cambiar según
      la vacante: Frontend, Full Stack, Backend o IoT.
    `,

    projects: [
      winner
    ],

    suggestions: [
      "busco un frontend",
      "busco un full stack",
      "ver proyectos"
    ]
  };
}

function calculateRecruiterScore(project) {
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

function getComparisonSuggestions() {
  return [
    "¿cuál es más complejo?",
    "¿cuál usa más tecnologías?",
    "¿cuál es mejor para un reclutador?"
  ];
}