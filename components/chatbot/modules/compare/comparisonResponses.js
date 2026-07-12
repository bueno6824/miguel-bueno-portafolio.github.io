import {
  calculateComplexityScore
} from "../chatbotAnalysis.js";

import {
  getProjectStack,
  getProjectYear,
  getSharedTechnologies,
  getUniqueTechnologies,
  projectUsesTechnology,
  compareTechnologyCount,
  compareComplexity,
  compareProjectYears,
  calculateGeneralProjectScore,
  calculateRecruiterScore
} from "./comparisonMetrics.js";

export function buildComparisonResponse(firstProject,secondProject) {
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

export function buildTechnologyCountResponse(firstProject,secondProject) {
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

export function buildComplexityResponse( firstProject,secondProject) {
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

export function buildRecentResponse( firstProject, secondProject) {
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

export function buildTechnologyUsageResponse( firstProject,secondProject,technology) {
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

export function buildGeneralRecommendation(firstProject, secondProject) {
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

export function buildRecruiterRecommendation(firstProject, secondProject) {
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

export function buildTechnologiesComparison(sharedTechnologies, firstUniqueTechnologies, secondUniqueTechnologies, firstProject, secondProject) {
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

export function getComparisonSuggestions() {
  return [
    "¿cuál es más complejo?",
    "¿cuál usa más tecnologías?",
    "¿cuál es mejor para un reclutador?"
  ];
}


