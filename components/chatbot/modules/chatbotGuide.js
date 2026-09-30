// Importa el contexto global del chatbot,
// utilizado para almacenar el estado del modo guía
// y otros datos de la conversación.
import {

  chatbotContext

} from "./chatbotState.js";


// Importa la función que obtiene todos
// los proyectos disponibles del portafolio.
import {

  getProjects

} from "./chatbotProjects.js";


// Importa la función que calcula
// la complejidad estimada de un proyecto.
import {

  calculateComplexityScore

} from "./chatbotAnalysis.js";


// Importa la función que normaliza textos
// para facilitar las comparaciones.
import {

  normalizeText

} from "./chatbotUtils.js";


/* ==============================
   GUIDE RESPONSE
============================== */

// Procesa las solicitudes relacionadas
// con el modo guía del portafolio.
export function getGuideResponse(message) {

  // Normaliza el mensaje recibido.
  const normalizedMessage =

    normalizeText(message);

  // Si el mensaje está vacío,
  // no se procesa.
  if (!normalizedMessage) {

    return null;

  }

  /*
   * Primero detectamos si el usuario
   * quiere comenzar el recorrido.
   */

  // Comprueba si el usuario quiere activar
  // el modo guía.
  const activation =

    detectGuideActivation(

      normalizedMessage

    );

  // Si se detectó una solicitud de activación,
  // inicia el modo guía.
  if (activation) {

    return startGuideMode(

      activation

    );

  }

  /*
   * Si el modo ya está activo,
   * procesamos los comandos del recorrido.
   */

  // Si el modo guía ya está activo,
  // procesa el mensaje como una instrucción
  // dentro del recorrido.
  if (

    chatbotContext.guideMode.active

  ) {

    return handleActiveGuide(

      normalizedMessage

    );

  }

  // Si no se activó el modo guía
  // y tampoco está activo,
  // permite que otros módulos procesen el mensaje.
  return null;

}


// Detecta si el mensaje del usuario
// indica que desea iniciar un recorrido guiado.
function detectGuideActivation(message) {

  // Patrones relacionados con reclutadores
  // o personas evaluando el portafolio.
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

  // Patrones relacionados con una vacante
  // o un proceso de contratación.
  const vacancyPatterns = [

    "tengo una vacante",

    "busco un desarrollador",

    "busco desarrollador",

    "necesito un desarrollador",

    "estoy contratando"

  ];

  // Comprueba si el mensaje corresponde
  // a alguno de los patrones de reclutador.
  const isRecruiter =

    matchesAny(

      message,

      recruiterPatterns

    );

  // Comprueba si el mensaje contiene
  // una referencia a una vacante.
  const hasVacancy =

    matchesAny(

      message,

      vacancyPatterns

    );

  // Si no es reclutador ni menciona
  // una vacante, no activa el modo guía.
  if (

    !isRecruiter &&

    !hasVacancy

  ) {

    return null;

  }

  // Devuelve la información necesaria
  // para iniciar el recorrido.
  return {

    // Define la audiencia como reclutador.
    audience: "recruiter",

    // Intenta detectar el perfil profesional
    // que se está evaluando.
    profile:

      detectProfessionalProfile(

        message

      )

  };

}


// Detecta qué perfil profesional
// está buscando o evaluando el usuario.
function detectProfessionalProfile(message) {

  // Perfiles profesionales disponibles
  // dentro del sistema de recomendación.
  const profiles = [

    {

      // Perfil orientado a desarrollo frontend.
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

      // Perfil orientado a desarrollo backend.
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

      // Perfil que combina frontend y backend.
      id: "fullstack",

      patterns: [

        "full stack",

        "fullstack",

        "frontend y backend"

      ]

    },

    {

      // Perfil orientado a IoT y sistemas embebidos.
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

  // Busca el primer perfil cuyas palabras clave
  // coincidan con el mensaje.
  const detectedProfile =

    profiles.find(profile =>

      matchesAny(

        message,

        profile.patterns

      )

    );

  // Devuelve el identificador del perfil
  // o null si no se detectó ninguno.
  return detectedProfile?.id || null;

}


// Inicializa el modo guía y prepara
// los proyectos recomendados.
function startGuideMode({ audience, profile }) {

  // Obtiene los proyectos más adecuados
  // para el perfil detectado.
  const recommendedProjects =

    getGuideProjects(profile);

  // Configura el estado inicial del modo guía.
  chatbotContext.guideMode = {

    // Activa el modo guía.
    active: true,

    // Guarda la audiencia detectada.
    audience,

    // Guarda el perfil profesional.
    profile,

    // Inicia el recorrido en el paso uno.
    currentStep: 1,

    // Inicialmente no hay pasos completados.
    recommendedProjects,

    completedSteps: []

  };

  // Establece el tema actual
  // como recorrido del portafolio.
  chatbotContext.lastTopic =

    "portfolio-guide";

  // Si existen proyectos recomendados,
  // los guarda también dentro del contexto general.
  if (recommendedProjects.length) {

    // Guarda los proyectos recomendados
    // como últimos proyectos mostrados.
    chatbotContext.lastProjects =

      recommendedProjects;

    // Conserva los mismos proyectos
    // como proyectos visibles.
    chatbotContext.lastProjectsShown =

      recommendedProjects;

    // Guarda el primer proyecto como
    // recomendación principal.
    chatbotContext.lastRecommendedProject =

      recommendedProjects[0];

    // También lo registra como último proyecto mencionado.
    chatbotContext.lastMentionedProject =

      recommendedProjects[0];

  }

  // Obtiene una etiqueta legible
  // para el perfil profesional detectado.
  const profileLabel =

    getProfileLabel(profile);

  // Devuelve la respuesta inicial
  // del modo guía.
  return {

    answer: `

      <strong>👔 Modo guía activado</strong>

      <br><br>

      ${profile
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

    // Muestra los primeros proyectos recomendados
    // dentro de la respuesta.
    projects:

      recommendedProjects.slice(0, 2),

    // Ofrece acciones para continuar
    // el recorrido.
    suggestions: [

      "comenzar recorrido",

      "ver proyecto recomendado",

      "salir del modo guía",

      "¿por qué contratar a Miguel?"

    ]

  };

}


// Obtiene y ordena los proyectos
// más relevantes para el perfil solicitado.
function getGuideProjects(profile) {

  // Obtiene todos los proyectos disponibles.
  const projects =

    getProjects();

  // Si no existen proyectos,
  // devuelve una lista vacía.
  if (!projects.length) {

    return [];

  }

  // Crea una copia de los proyectos,
  // calcula una puntuación para cada uno
  // y después los ordena.
  return [...projects]

    // Asocia cada proyecto con su puntuación.
    .map(project => ({

      project,

      score:

        calculateGuideScore(

          project,

          profile

        )

    }))

    // Ordena de mayor a menor puntuación.
    .sort(

      (firstResult, secondResult) =>

        secondResult.score -

        firstResult.score

    )

    // Recupera únicamente los proyectos.
    .map(result =>

      result.project

    )

    // Limita la recomendación a los tres
    // proyectos con mayor puntuación.
    .slice(0, 3);

}


// Calcula qué tan adecuado es un proyecto
// para el perfil profesional detectado.
function calculateGuideScore(project, profile) {

  // Comienza utilizando la puntuación
  // general de complejidad del proyecto.
  let score =

    calculateComplexityScore(

      project

    );

  // Genera un texto con toda la información
  // relevante del proyecto para buscar tecnologías.
  const searchableText =

    getProjectSearchableText(

      project

    );

  // Define las tecnologías relevantes
  // para cada perfil profesional.
  const profileTechnologies = {

    // Tecnologías relacionadas con frontend.
    frontend: [

      "html",

      "css",

      "javascript",

      "bootstrap",

      "tailwind",

      "react",

      "web"

    ],

    // Tecnologías relacionadas con backend.
    backend: [

      "node",

      "express",

      "mysql",

      "php",

      "laravel",

      "api",

      "backend"

    ],

    // Tecnologías que pueden representar
    // un perfil full stack.
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

    // Tecnologías relacionadas con IoT
    // y sistemas embebidos.
    iot: [

      "arduino",

      "esp32",

      "iot",

      "sensor",

      "hardware",

      "c++"

    ]

  };

  // Obtiene las tecnologías correspondientes
  // al perfil detectado.
  const technologies =

    profileTechnologies[profile] ||

    [];

  // Recorre las tecnologías del perfil
  // y aumenta la puntuación cuando aparecen
  // en la información del proyecto.
  technologies.forEach(

    technology => {

      if (

        searchableText.includes(

          technology

        )

      ) {

        // Cada coincidencia tecnológica
        // aporta cuatro puntos.
        score += 4;

      }

    }

  );

  // Si el proyecto tiene una demo válida,
  // agrega puntos adicionales.
  if (

    project.demo &&

    project.demo !== "#"

  ) {

    score += 3;

  }

  // Si el proyecto tiene un repositorio válido,
  // agrega puntos adicionales.
  if (

    project.codigo &&

    project.codigo !== "#"

  ) {

    score += 3;

  }

  // Una imagen de portada disponible
  // aporta un punto adicional.
  if (project.imagenPortada) {

    score += 1;

  }

  // Devuelve la puntuación final.
  return score;

}


// Construye un texto con los campos
// relevantes de un proyecto para búsquedas.
function getProjectSearchableText(project) {

  // Reúne diferentes propiedades del proyecto
  // que pueden contener información tecnológica.
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

  // Une los valores y normaliza el texto
  // para facilitar las búsquedas.
  return normalizeText(

    values

      .filter(Boolean)

      .join(" ")

  );

}


// Procesa las acciones disponibles
// mientras el modo guía está activo.
function handleActiveGuide(message) {

  // ==========================================
  // SALIR DEL MODO GUÍA
  // ==========================================

  // Detecta solicitudes para finalizar
  // o cancelar el recorrido.
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


  // ==========================================
  // COMENZAR RECORRIDO
  // ==========================================

  // Detecta solicitudes para iniciar
  // formalmente el recorrido.
  if (

    matchesAny(message, [

      "comenzar recorrido",

      "iniciar recorrido",

      "empezar recorrido"

    ])

  ) {

    // Reinicia el paso actual al primero.
    chatbotContext.guideMode.currentStep = 1;

    // Devuelve la información del primer paso.
    return getGuideStepResponse(1);

  }


  // ==========================================
  // SIGUIENTE PASO
  // ==========================================

  // Detecta solicitudes para avanzar.
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


  // ==========================================
  // PASO ANTERIOR
  // ==========================================

  // Detecta solicitudes para regresar
  // al paso anterior.
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


  // ==========================================
  // PROYECTO RECOMENDADO
  // ==========================================

  // Detecta solicitudes para mostrar
  // o abrir el proyecto recomendado.
  if (

    matchesAny(message, [

      "ver proyecto recomendado",

      "muestra el proyecto recomendado",

      "abre el recomendado"

    ])

  ) {

    return getRecommendedGuideProject();

  }


  // ==========================================
  // GITHUB
  // ==========================================

  // Detecta solicitudes para abrir
  // el perfil de GitHub.
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


  // ==========================================
  // HABILIDADES
  // ==========================================

  // Detecta solicitudes relacionadas
  // con la sección de habilidades.
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


  // ==========================================
  // HERRAMIENTAS
  // ==========================================

  // Detecta solicitudes relacionadas
  // con la sección de herramientas.
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


  // ==========================================
  // CONTACTO
  // ==========================================

  // Detecta solicitudes para ir
  // a la sección de contacto.
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


  // ==========================================
  // PROGRESO DEL RECORRIDO
  // ==========================================

  // Detecta preguntas sobre el paso actual
  // y el progreso del recorrido.
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

  // Si no coincide ninguna acción del modo guía,
  // devuelve null para permitir que otro módulo
  // procese el mensaje.
  return null;

}


// Devuelve la respuesta correspondiente
// al número de paso actual.
function getGuideStepResponse(step) {

  // Selecciona el contenido según
  // el paso solicitado.
  switch (step) {

    // Paso uno: proyecto recomendado.
    case 1:

      return getGuideProjectStep();

    // Paso dos: arquitectura y tecnologías.
    case 2:

      return getGuideArchitectureStep();

    // Paso tres: GitHub y código.
    case 3:

      return getGuideGitHubStep();

    // Paso cuatro: habilidades.
    case 4:

      return getGuideSkillsStep();

    // Paso cinco: contacto.
    case 5:

      return getGuideContactStep();

    // Si el paso no es válido,
    // finaliza el recorrido.
    default:

      return finishGuide();

  }

}


// Avanza el modo guía al siguiente paso.
function advanceGuideStep() {

  // Obtiene el estado actual del modo guía.
  const guideMode =

    chatbotContext.guideMode;

  // Obtiene el paso actual
  // utilizando uno como valor predeterminado.
  const currentStep =

    Number(guideMode.currentStep) || 1;

  // Marca el paso actual como completado.
  markGuideStepCompleted(

    currentStep

  );

  // Calcula el siguiente paso.
  const nextStep =

    currentStep + 1;

  // Si ya se superaron los cinco pasos,
  // finaliza el recorrido.
  if (nextStep > 5) {

    return finishGuide();

  }

  // Actualiza el paso actual.
  guideMode.currentStep =

    nextStep;

  // Devuelve la respuesta correspondiente
  // al nuevo paso.
  return getGuideStepResponse(

    nextStep

  );

}


// Regresa al paso anterior del recorrido.
function previousGuideStep() {

  // Obtiene el estado actual del modo guía.
  const guideMode =

    chatbotContext.guideMode;

  // Obtiene el paso actual.
  const currentStep =

    Number(guideMode.currentStep) || 1;

  // Calcula el paso anterior sin permitir
  // que sea menor que uno.
  const previousStep =

    Math.max(

      currentStep - 1,

      1

    );

  // Actualiza el paso actual.
  guideMode.currentStep =

    previousStep;

  // Devuelve la respuesta del paso anterior.
  return getGuideStepResponse(

    previousStep

  );

}


// Registra un paso como completado.
function markGuideStepCompleted(step) {

  // Obtiene la lista de pasos completados.
  const completedSteps =

    chatbotContext

      .guideMode

      .completedSteps;

  // Si la lista no es un arreglo,
  // la inicializa.
  if (

    !Array.isArray(completedSteps)

  ) {

    chatbotContext

      .guideMode

      .completedSteps = [];

  }

  // Evita agregar el mismo paso
  // más de una vez.
  if (

    !chatbotContext

      .guideMode

      .completedSteps

      .includes(step)

  ) {

    // Registra el paso como completado.
    chatbotContext

      .guideMode

      .completedSteps

      .push(step);

  }

}


// Construye la respuesta correspondiente
// al primer paso del recorrido.
function getGuideProjectStep() {

  // Obtiene el primer proyecto recomendado.
  const project =

    chatbotContext

      .guideMode

      .recommendedProjects[0];

  // Si no existe un proyecto recomendado,
  // informa al usuario.
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

  // Guarda el proyecto como recomendado actualmente.
  chatbotContext.lastRecommendedProject =

    project;

  // También lo registra como último proyecto mencionado.
  chatbotContext.lastMentionedProject =

    project;

  // Devuelve la información del primer paso.
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

    // Muestra el proyecto recomendado.
    projects: [

      project

    ],

    // Ofrece acciones relacionadas
    // con el siguiente paso.
    suggestions: [

      "abre el recomendado",

      "qué tecnologías usa",

      "siguiente paso"

    ]

  };

}


// Construye la respuesta del segundo paso,
// centrado en tecnologías y arquitectura.
function getGuideArchitectureStep() {

  // Obtiene el proyecto actualmente utilizado
  // dentro del recorrido.
  const project =

    getCurrentGuideProject();

  // Si no existe un proyecto activo,
  // solicita recuperar uno.
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

  // Obtiene el stack tecnológico del proyecto.
  const stack =

    Array.isArray(project.stack)

      ? project.stack

      : [];

  // Devuelve la información del segundo paso.
  return {

    answer: `

      <strong>🧠 Paso 2 de 5: Tecnologías y arquitectura</strong>

      <br><br>

      El proyecto

      <strong>${project.titulo}</strong>

      utiliza principalmente:

      <br><br>

      ${stack.length

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

    // Mantiene el proyecto dentro
    // del contexto de la respuesta.
    projects: [

      project

    ],

    // Sugiere acciones relacionadas
    // con el código y el siguiente paso.
    suggestions: [

      "tiene código",

      "abre el código",

      "siguiente paso"

    ]

  };

}


// Construye la respuesta correspondiente
// al tercer paso del recorrido.
function getGuideGitHubStep() {

  // Obtiene el proyecto actual.
  const project =

    getCurrentGuideProject();

  // Comprueba si el proyecto tiene
  // un enlace válido al código.
  const hasProjectCode =

    Boolean(

      project?.codigo &&

      project.codigo !== "#"

    );

  // Devuelve la información relacionada
  // con GitHub y el código.
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

      ${hasProjectCode

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

    // Incluye el proyecto si existe.
    projects:

      project

        ? [project]

        : [],

    // Cambia las sugerencias dependiendo
    // de si el proyecto tiene repositorio.
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


// Genera una acción para abrir
// el perfil general de GitHub.
function openGuideGitHub() {

  return {

    // Mensaje mostrado antes de ejecutar la acción.
    answer:

      "💻 Abriendo el perfil de GitHub de Miguel.",

    // Define la acción como un enlace.
    action: {

      type: "link",

      // URL del perfil de GitHub.
      url:

        "[https://github.com/bueno6824](https://github.com/bueno6824)"

    },

    // Indica que la acción debe ejecutarse directamente.
    direct: true,

    // Sugiere acciones posteriores.
    suggestions: [

      "siguiente paso",

      "ver habilidades",

      "ver herramientas"

    ]

  };

}


// Construye la respuesta del cuarto paso,
// centrado en habilidades y herramientas.
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

    // Devuelve las sugerencias de navegación
    // disponibles durante este paso.
    suggestions:

      getGuideNavigationSuggestions()

  };

}


// Construye la respuesta del quinto paso,
// centrado en el contacto.
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

    // Devuelve las sugerencias disponibles
    // al finalizar la revisión.
    suggestions:

      getGuideFinalSuggestions()

  };

}


// Crea una acción de navegación
// hacia una sección determinada del portafolio.
function openGuideSection(

  target,

  sectionLabel

) {

  // Si no existe un destino válido,
  // no crea ninguna acción.
  if (!target) {

    return null;

  }

  // Devuelve una respuesta con una acción
  // de desplazamiento hacia la sección.
  return {

    answer:

      `🚀 Te llevo a la sección de <strong>${sectionLabel}</strong>.`,

    // Define la acción como navegación
    // hacia una sección.
    action: {

      type: "section",

      target

    },

    // Indica que la acción debe ejecutarse directamente.
    direct: true,

    // Ofrece nuevas opciones de navegación.
    suggestions:

      getGuideNavigationSuggestions()

  };

}


// Obtiene el proyecto que debe considerarse
// como proyecto actual dentro del recorrido.
function getCurrentGuideProject() {

  return (

    // Primero intenta utilizar el primer
    // proyecto recomendado del modo guía.
    chatbotContext

      .guideMode

      .recommendedProjects[0] ||

    // Como alternativa, utiliza el último
    // proyecto recomendado.
    chatbotContext.lastRecommendedProject ||

    // Como última alternativa, utiliza
    // el último proyecto mencionado.
    chatbotContext.lastMentionedProject ||

    // Si no existe ninguno, devuelve null.
    null

  );

}


// Devuelve información sobre el progreso
// actual del recorrido.
function getGuideProgressResponse() {

  // Obtiene el número del paso actual.
  const currentStep =

    chatbotContext

      .guideMode

      .currentStep;

  // Obtiene los pasos que ya fueron completados.
  const completedSteps =

    chatbotContext

      .guideMode

      .completedSteps;

  // Devuelve el estado actual del recorrido.
  return {

    answer: `

      <strong>🧭 Progreso del recorrido</strong>

      <br><br>

      Paso actual:

      <strong>${currentStep} de 5</strong>

      <br><br>

      Pasos completados:

      <strong>${Array.isArray(completedSteps)

        ? completedSteps.length

        : 0
      }</strong>

    `,

    // Ofrece acciones para continuar
    // o retroceder en el recorrido.
    suggestions: [

      "siguiente paso",

      "paso anterior",

      "salir del modo guía"

    ]

  };

}


// Finaliza el recorrido del modo guía.
function finishGuide() {

  // Marca el quinto paso como completado.
  markGuideStepCompleted(5);

  // Mantiene el paso actual en cinco.
  chatbotContext

    .guideMode

    .currentStep = 5;

  // Devuelve el mensaje de finalización.
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

    // Ofrece opciones posteriores
    // a la finalización del recorrido.
    suggestions: [

      "ir a contacto",

      "ver proyectos",

      "salir del modo guía"

    ]

  };

}


// Obtiene el proyecto recomendado
// y genera una acción para abrirlo.
function getRecommendedGuideProject() {

  // Obtiene el primer proyecto recomendado.
  const project =

    chatbotContext

      .guideMode

      .recommendedProjects[0];

  // Si no existe un proyecto,
  // no genera ninguna acción.
  if (!project) {

    return null;

  }

  // Guarda el proyecto como última recomendación.
  chatbotContext.lastRecommendedProject =

    project;

  // Guarda también el proyecto como último mencionado.
  chatbotContext.lastMentionedProject =

    project;

  // Devuelve la acción para abrir el proyecto.
  return {

    answer:

      `🚀 Abriendo el proyecto recomendado: <strong>${project.titulo}</strong>.`,

    action: {

      type: "project",

      projectId: project.id

    },

    // Indica que la acción debe ejecutarse directamente.
    direct: true,

    // Ofrece consultas relacionadas
    // después de abrir el proyecto.
    suggestions: [

      "qué tecnologías usa",

      "tiene demo",

      "siguiente paso"

    ]

  };

}


// Detiene el modo guía y restaura
// el estado normal del chatbot.
function stopGuideMode() {

  // Restablece completamente la configuración
  // del modo guía.
  chatbotContext.guideMode = {

    active: false,

    audience: null,

    profile: null,

    currentStep: 0,

    recommendedProjects: [],

    completedSteps: []

  };

  // Elimina el tema específico del recorrido.
  chatbotContext.lastTopic =

    null;

  // Devuelve el mensaje de finalización
  // y algunas opciones generales.
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


// Convierte el identificador interno
// del perfil en una etiqueta legible.
function getProfileLabel(profile) {

  // Mapa de nombres de perfiles.
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

  // Devuelve la etiqueta correspondiente
  // o una descripción genérica.
  return (

    labels[profile] ||

    "desarrollo de software"

  );

}


// Comprueba si un mensaje coincide
// con alguno de los patrones proporcionados.
function matchesAny(

  message,

  patterns = []

) {

  // Recorre los patrones y comprueba
  // si alguno aparece en el mensaje normalizado.
  return patterns.some(pattern =>

    message.includes(

      normalizeText(pattern)

    )

  );

}


// Devuelve las sugerencias de navegación
// disponibles durante el recorrido.
function getGuideNavigationSuggestions() {

  return [

    "ver habilidades",

    "ver herramientas",

    "ir a contacto",

    "siguiente paso"

  ];

}


// Devuelve las sugerencias disponibles
// al finalizar el recorrido.
function getGuideFinalSuggestions() {

  return [

    "ir a contacto",

    "ver habilidades",

    "ver herramientas",

    "finalizar recorrido"

  ];

}