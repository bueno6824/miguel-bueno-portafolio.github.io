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

// Procesa solicitudes avanzadas relacionadas con reclutamiento,
// perfiles profesionales y selección de proyectos.
export function getAdvancedRecruiterResponse(
  message
) {
  // Normaliza el mensaje para facilitar la detección
  // de intenciones y palabras clave.
  const normalizedMessage =
    normalizeText(message);

  // Ignora mensajes vacíos.
  if (!normalizedMessage) {
    return null;
  }

  // Obtiene todos los proyectos disponibles.
  const projects =
    getProjects();

  // Si no existen proyectos, no genera una recomendación.
  if (!projects.length) {
    return null;
  }

  // Detecta si el usuario está solicitando un perfil
  // profesional específico.
  const requestedProfile =
    detectRequestedProfile(
      normalizedMessage
    );

  // Si existe un perfil solicitado, genera la recomendación
  // de proyectos correspondiente.
  if (requestedProfile) {
    return buildProfileRecommendation(
      requestedProfile,
      projects
    );
  }

  // Detecta solicitudes relacionadas con el nivel técnico
  // de los proyectos.
  if (
    asksForTechnicalLevel(
      normalizedMessage
    )
  ) {
    return buildTechnicalRecommendation(
      projects
    );
  }

  // Detecta solicitudes específicas sobre qué proyecto
  // mostrar a un reclutador.
  if (
    asksForRecruiterProject(
      normalizedMessage
    )
  ) {
    return buildBestRecruiterProjectResponse(
      projects
    );
  }

  // Si no se detecta ninguna intención avanzada,
  // permite que otros módulos procesen el mensaje.
  return null;
}

// Detecta el perfil profesional solicitado por el usuario,
// como Frontend, Backend, Full Stack o IoT.
function detectRequestedProfile(message) {
  // Define los perfiles disponibles junto con sus patrones,
  // tecnologías y categorías relacionadas.
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

  // Busca el primer perfil cuyos patrones coincidan
  // con el mensaje normalizado.
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

// Genera una recomendación de proyectos para el perfil solicitado.
function buildProfileRecommendation(
  profile,
  projects
) {
  // Calcula la puntuación y las coincidencias de cada proyecto
  // respecto al perfil profesional seleccionado.
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

      // Conserva únicamente los proyectos con alguna coincidencia.
      .filter(result =>
        result.score > 0
      )

      // Ordena los proyectos desde la mayor hasta la menor
      // puntuación de coincidencia.
      .sort(
        (firstResult, secondResult) =>
          secondResult.score -
          firstResult.score
      );

  // Si no existen proyectos compatibles, devuelve
  // una respuesta alternativa.
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

  // Obtiene el proyecto con mayor coincidencia.
  const bestResult =
    rankedProjects[0];

  // Obtiene una segunda alternativa cuando existe.
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

      ${alternativeResult
        ? `
            <br><br>

            Como alternativa también destacaría
            <strong>${alternativeResult.project.titulo}</strong>.
          `
        : ""
      }
    `,

    // Devuelve el proyecto principal y, cuando existe,
    // una alternativa para mostrar en la interfaz.
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

// Calcula la compatibilidad de un proyecto con un perfil
// utilizando tecnologías, categorías y características generales.
function calculateProfileScore(
  project,
  profile
) {
  let score = 0;

  // Genera un texto normalizado con la información
  // relevante del proyecto.
  const searchableText =
    getProjectSearchableText(
      project
    );

  // Agrega puntuación por cada tecnología del perfil
  // que aparezca en la información del proyecto.
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

  // Agrega puntuación cuando la categoría del proyecto
  // coincide con alguna categoría del perfil.
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

  // Añade parte de la puntuación de complejidad técnica,
  // limitada a un máximo de 10 puntos.
  score += Math.min(
    calculateComplexityScore(project),
    10
  );

  // Valora la existencia de una demostración funcional.
  if (
    project.demo &&
    project.demo !== "#"
  ) {
    score += 2;
  }

  // Valora la disponibilidad del código fuente.
  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    score += 3;
  }

  return score;
}

// Obtiene las razones concretas por las que un proyecto
// coincide con el perfil profesional solicitado.
function getProfileMatches(
  project,
  profile
) {
  const matches = [];

  // Obtiene el texto normalizado que contiene la información
  // principal del proyecto.
  const searchableText =
    getProjectSearchableText(
      project
    );

  // Identifica las tecnologías del perfil presentes
  // en el proyecto.
  const matchingTechnologies =
    profile.technologies.filter(
      technology =>
        searchableText.includes(
          normalizeText(technology)
        )
    );

  // Agrega las tecnologías coincidentes como una razón.
  if (matchingTechnologies.length) {
    matches.push(
      `Tecnologías relacionadas: ${matchingTechnologies.join(", ")}`
    );
  }

  // Comprueba si la categoría del proyecto
  // coincide con el perfil solicitado.
  const matchesCategory =
    profile.categories.some(category =>
      normalizeText(
        project.categoria
      ).includes(
        normalizeText(category)
      )
    );

  // Agrega la categoría como una razón de coincidencia.
  if (matchesCategory) {
    matches.push(
      `Categoría: ${project.categoria}`
    );
  }

  // Comprueba si existe un repositorio de código.
  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    matches.push(
      "Cuenta con repositorio de código"
    );
  }

  // Comprueba si existe una demostración disponible.
  if (
    project.demo &&
    project.demo !== "#"
  ) {
    matches.push(
      "Cuenta con demostración disponible"
    );
  }

  // Si no hubo coincidencias específicas, utiliza
  // una descripción general de las capacidades demostradas.
  if (!matches.length) {
    matches.push(
      "Demuestra capacidad técnica y resolución de problemas"
    );
  }

  return matches;
}

// Combina los datos principales del proyecto en un único texto
// normalizado para realizar búsquedas de tecnologías y categorías.
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

  // Filtra valores vacíos, combina la información y la normaliza.
  return normalizeText(
    values
      .filter(Boolean)
      .join(" ")
  );
}

// Detecta si el usuario solicita información sobre
// el proyecto con mayor nivel técnico o complejidad.
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

  // Comprueba si alguno de los patrones aparece
  // dentro del mensaje normalizado.
  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

// Construye una recomendación basada en el nivel técnico
// estimado de los proyectos disponibles.
function buildTechnicalRecommendation(
  projects
) {
  // Calcula una puntuación técnica para cada proyecto
  // y los ordena de mayor a menor.
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

  // Obtiene el proyecto con mayor puntuación técnica.
  const bestResult =
    rankedProjects[0];

  // No genera respuesta si no existe ningún resultado.
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

// Calcula la puntuación técnica de un proyecto
// considerando complejidad, tecnologías y recursos disponibles.
function calculateTechnicalScore(
  project
) {
  // Utiliza la complejidad técnica como puntuación inicial.
  let score =
    calculateComplexityScore(
      project
    );

  // Obtiene el stack del proyecto.
  const stack =
    Array.isArray(project.stack)
      ? project.stack
      : [];

  // Agrega dos puntos por cada tecnología del stack.
  score += stack.length * 2;

  // Agrega puntuación si existe un repositorio válido.
  if (
    project.codigo &&
    project.codigo !== "#"
  ) {
    score += 3;
  }

  // Agrega puntuación si existe una demostración válida.
  if (
    project.demo &&
    project.demo !== "#"
  ) {
    score += 3;
  }

  // Valora una descripción larga y suficientemente detallada.
  if (
    project.descripcionLarga &&
    project.descripcionLarga.length > 100
  ) {
    score += 2;
  }

  return score;
}

// Detecta solicitudes relacionadas con el proyecto
// que debería mostrarse a un reclutador o en una entrevista.
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

  // Comprueba si el mensaje coincide con alguno
  // de los patrones relacionados con reclutamiento.
  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

// Construye una respuesta con el proyecto que obtiene
// la mayor puntuación según los criterios de presentación profesional.
function buildBestRecruiterProjectResponse(
  projects
) {
  // Calcula la puntuación de cada proyecto y los ordena
  // desde la mayor hasta la menor.
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

  // Obtiene el proyecto con mayor puntuación.
  const bestResult =
    rankedProjects[0];

  // No genera respuesta si no existe ningún proyecto.
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

// Calcula la puntuación específica para valorar
// un proyecto desde una perspectiva de reclutamiento.
function calculateRecruiterProjectScore(
  project
) {
  // Parte de la puntuación técnica general.
  let score =
    calculateTechnicalScore(
      project
    );

  // Agrega puntuación por disponer de una imagen de portada.
  if (project.imagenPortada) {
    score += 1;
  }

  // Considera hasta tres elementos multimedia
  // como evidencia visual del proyecto.
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