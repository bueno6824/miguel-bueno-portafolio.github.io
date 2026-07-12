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
   ADVANCED RECRUITER RESPONSE
============================== */

export function getAdvancedRecruiterResponse(
  message
) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  const projects =
    getProjects();

  if (!projects.length) {
    return null;
  }

  const requestedProfile =
    detectRequestedProfile(
      normalizedMessage
    );

  if (requestedProfile) {
    return buildProfileRecommendation(
      requestedProfile,
      projects
    );
  }

  if (
    asksForTechnicalLevel(
      normalizedMessage
    )
  ) {
    return buildTechnicalRecommendation(
      projects
    );
  }

  if (
    asksForRecruiterProject(
      normalizedMessage
    )
  ) {
    return buildBestRecruiterProjectResponse(
      projects
    );
  }

  return null;
}

function detectRequestedProfile(message) {
  const profiles = [
    {
      id: "frontend",

      label:
        "Frontend",

      patterns: [
        "frontend",
        "front end",
        "interfaces",
        "interfaz web",
        "desarrollo web",
        "html css javascript"
      ],

      technologies: [
        "html",
        "css",
        "javascript",
        "bootstrap",
        "tailwind",
        "react"
      ],

      categories: [
        "web",
        "frontend"
      ]
    },

    {
      id: "backend",

      label:
        "Backend",

      patterns: [
        "backend",
        "back end",
        "servidor",
        "base de datos",
        "apis",
        "api rest"
      ],

      technologies: [
        "node",
        "node.js",
        "express",
        "mysql",
        "php",
        "laravel",
        "sqlite",
        "api"
      ],

      categories: [
        "backend",
        "full stack",
        "fullstack"
      ]
    },

    {
      id: "fullstack",

      label:
        "Full Stack",

      patterns: [
        "full stack",
        "fullstack",
        "desarrollador completo",
        "frontend y backend"
      ],

      technologies: [
        "html",
        "css",
        "javascript",
        "node",
        "express",
        "mysql",
        "php",
        "laravel"
      ],

      categories: [
        "full stack",
        "fullstack",
        "web"
      ]
    },

    {
      id: "iot",

      label:
        "IoT y sistemas embebidos",

      patterns: [
        "iot",
        "arduino",
        "esp32",
        "sistemas embebidos",
        "automatizacion",
        "sensores",
        "hardware"
      ],

      technologies: [
        "arduino",
        "esp32",
        "c++",
        "iot",
        "sensores"
      ],

      categories: [
        "iot",
        "hardware",
        "automatizacion"
      ]
    }
  ];

  return (
    profiles.find(profile =>
      profile.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      )
    ) || null
  );
}

function buildProfileRecommendation(
  profile,
  projects
) {
  const rankedProjects =
    projects
      .map(project => ({
        project,

        score:
          calculateProfileScore(
            project,
            profile
          ),

        matches:
          getProfileMatches(
            project,
            profile
          )
      }))
      .filter(result =>
        result.score > 0
      )
      .sort(
        (firstResult, secondResult) =>
          secondResult.score -
          firstResult.score
      );

  if (!rankedProjects.length) {
    return {
      answer: `
        No encontré un proyecto que coincida
        directamente con una vacante
        <strong>${profile.label}</strong>.

        <br><br>

        Aun así, puedo mostrar proyectos que
        demuestran arquitectura, JavaScript,
        diseño de interfaces y capacidad de
        aprendizaje.
      `,

      suggestions: [
        "proyectos",
        "proyecto más complejo",
        "contacto"
      ]
    };
  }

  const bestResult =
    rankedProjects[0];

  const alternativeResult =
    rankedProjects[1] || null;

  return {
    answer: `
      Para una vacante
      <strong>${profile.label}</strong>,
      el proyecto que mejor representa las
      habilidades de Miguel es:

      <br><br>

      <strong>${bestResult.project.titulo}</strong>

      <br><br>

      Coincide principalmente por:

      <br>

      ${bestResult.matches
        .map(match => `• ${match}`)
        .join("<br>")}

      <br><br>

      Puntuación de coincidencia:
      <strong>${bestResult.score}</strong>.

      ${
        alternativeResult
          ? `
            <br><br>

            Como alternativa también destacaría
            <strong>${alternativeResult.project.titulo}</strong>.
          `
          : ""
      }
    `,

    projects:
      alternativeResult
        ? [
            bestResult.project,
            alternativeResult.project
          ]
        : [
            bestResult.project
          ],

    suggestions: [
      "¿por qué contratar a Miguel?",
      "proyecto más técnico",
      "contacto"
    ]
  };
}

function calculateProfileScore(
  project,
  profile
) {
  let score = 0;

  const searchableText =
    getProjectSearchableText(
      project
    );

  profile.technologies.forEach(
    technology => {
      if (
        searchableText.includes(
          normalizeText(technology)
        )
      ) {
        score += 4;
      }
    }
  );

  profile.categories.forEach(
    category => {
      if (
        normalizeText(
          project.categoria
        ).includes(
          normalizeText(category)
        )
      ) {
        score += 6;
      }
    }
  );

  score += Math.min(
    calculateComplexityScore(project),
    10
  );

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
    score += 3;
  }

  return score;
}

function getProfileMatches(
  project,
  profile
) {
  const matches = [];

  const searchableText =
    getProjectSearchableText(
      project
    );

  const matchingTechnologies =
    profile.technologies.filter(
      technology =>
        searchableText.includes(
          normalizeText(technology)
        )
    );

  if (matchingTechnologies.length) {
    matches.push(
      `Tecnologías relacionadas: ${matchingTechnologies.join(", ")}`
    );
  }

  const matchesCategory =
    profile.categories.some(category =>
      normalizeText(
        project.categoria
      ).includes(
        normalizeText(category)
      )
    );

  if (matchesCategory) {
    matches.push(
      `Categoría: ${project.categoria}`
    );
  }

  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    matches.push(
      "Cuenta con repositorio de código"
    );
  }

  if (
    project.demo &&
    project.demo !== "#"
  ) {
    matches.push(
      "Cuenta con demostración disponible"
    );
  }

  if (!matches.length) {
    matches.push(
      "Demuestra capacidad técnica y resolución de problemas"
    );
  }

  return matches;
}

function getProjectSearchableText(
  project
) {
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

function asksForTechnicalLevel(
  message
) {
  const patterns = [
    "proyecto mas tecnico",
    "proyecto con mas nivel",
    "demuestra mas nivel tecnico",
    "proyecto mas avanzado",
    "proyecto mas complejo",
    "mayor capacidad tecnica"
  ];

  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

function buildTechnicalRecommendation(
  projects
) {
  const rankedProjects =
    [...projects]
      .map(project => ({
        project,

        score:
          calculateTechnicalScore(
            project
          )
      }))
      .sort(
        (firstResult, secondResult) =>
          secondResult.score -
          firstResult.score
      );

  const bestResult =
    rankedProjects[0];

  if (!bestResult) {
    return null;
  }

  return {
    answer: `
      El proyecto que actualmente demuestra
      mayor nivel técnico es
      <strong>${bestResult.project.titulo}</strong>.

      <br><br>

      La evaluación considera:

      <br><br>

      • Cantidad de tecnologías
      <br>
      • Complejidad estimada
      <br>
      • Nivel del proyecto
      <br>
      • Repositorio disponible
      <br>
      • Demo funcional
      <br>
      • Descripción y documentación

      <br><br>

      Puntuación técnica:
      <strong>${bestResult.score}</strong>.
    `,

    projects: [
      bestResult.project
    ],

    suggestions: [
      "qué tecnologías usa",
      "tiene código",
      "contacto"
    ]
  };
}

function calculateTechnicalScore(
  project
) {
  let score =
    calculateComplexityScore(
      project
    );

  const stack =
    Array.isArray(project.stack)
      ? project.stack
      : [];

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
    project.descripcionLarga.length > 100
  ) {
    score += 2;
  }

  return score;
}

function asksForRecruiterProject(
  message
) {
  const patterns = [
    "que proyecto mostrarias a un reclutador",
    "mejor proyecto para un reclutador",
    "que proyecto representa mejor a miguel",
    "mejor proyecto del portafolio",
    "proyecto para una entrevista",
    "proyecto mas profesional"
  ];

  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

function buildBestRecruiterProjectResponse(
  projects
) {
  const rankedProjects =
    projects
      .map(project => ({
        project,

        score:
          calculateRecruiterProjectScore(
            project
          )
      }))
      .sort(
        (firstResult, secondResult) =>
          secondResult.score -
          firstResult.score
      );

  const bestResult =
    rankedProjects[0];

  if (!bestResult) {
    return null;
  }

  return {
    answer: `
      Para presentarlo en una entrevista,
      recomendaría
      <strong>${bestResult.project.titulo}</strong>.

      <br><br>

      Es el proyecto que ofrece la combinación
      más completa de complejidad, stack,
      presentación, código y demostración.

      <br><br>

      Aun así, la elección final debe adaptarse
      al tipo de vacante: Frontend, Backend,
      Full Stack o IoT.
    `,

    projects: [
      bestResult.project
    ],

    suggestions: [
      "busco un frontend",
      "busco un full stack",
      "busco experiencia en IoT"
    ]
  };
}

function calculateRecruiterProjectScore(
  project
) {
  let score =
    calculateTechnicalScore(
      project
    );

  if (project.imagenPortada) {
    score += 1;
  }

  if (
    Array.isArray(project.media)
  ) {
    score += Math.min(
      project.media.length,
      3
    );
  }

  return score;
}

