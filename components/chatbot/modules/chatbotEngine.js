// Importa el contexto global del chatbot.
// Se utiliza para conservar información de la conversación.
import {

  chatbotContext

} from "./chatbotState.js";


// Importa funciones para normalizar textos
// y detectar palabras clave.
import {

  normalizeText,

  matchesKeyword

} from "./chatbotUtils.js";


// Importa las respuestas predefinidas
// utilizadas por el chatbot.
import {

  responses

} from "../data/chatbotResponses.js";


// Importa funciones relacionadas con
// la obtención, búsqueda y selección de proyectos.
import {

  getProjectsList,

  getProjectFromMessage,

  searchProjects,

  getProjectSearchResponse,

  getSpecialProjectResponse

} from "./chatbotProjects.js";


// Importa funciones relacionadas con herramientas
// y respuestas orientadas a reclutadores.
import {

  getToolsList,

  getRecruiterResponse

} from "./chatbotRecruiter.js";


// Importa el sistema de sugerencias inteligentes.
import {

  getSmartSuggestions

} from "./chatbotSuggestions.js";


// Importa la función que permite detectar
// solicitudes directas de navegación por secciones.
import {

  getDirectSectionAction

} from "./chatbotActions.js";


// Importa las respuestas relacionadas
// con estadísticas del portafolio.
import {

  getStatisticsResponse

} from "./chatbotStatistics.js";


// Importa el sistema de comparación de proyectos.
import {

  getComparisonResponse

} from "./chatbotCompare.js";


// Importa la función que permite resolver
// referencias a proyectos mencionados anteriormente.
import {

  resolveProjectReference

} from "./chatbotMemory.js";


// Importa las respuestas relacionadas
// con la memoria contextual de proyectos.
import {

  getProjectMemoryResponse

} from "./chatbotProjectMemory.js";


// Importa respuestas avanzadas orientadas
// a análisis desde la perspectiva de un reclutador.
import {

  getAdvancedRecruiterResponse

} from "./chatbotRecruiterAdvanced.js";


// Importa el sistema de guía interactiva
// del portafolio.
import {

  getGuideResponse

} from "./chatbotGuide.js";


// Importa frases introductorias para
// presentar proyectos al usuario.
import {

  getProjectIntroPhrase

} from "./chatbotPhrases.js";


// Importa el detector de intenciones
// relacionadas con navegación natural.
import {

  getNavigationIntent

} from "./chatbotNavigationIntent.js";


// Importa el procesamiento de preguntas cortas
// y consultas contextuales breves.
import {

  getShortQuestionResponse

} from "./chatbotShortQuestions.js";


// Importa el sistema de filtrado de proyectos.
import {

  getProjectFilterResponse

} from "./chatbotProjectFilters.js";


// Importa el sistema de ranking de proyectos.
import {

  getProjectRankingResponse

} from "./chatbotProjectRanking.js";


// Importa el sistema de recomendaciones
// de proyectos.
import {

  getRecommendationResponse

} from "./chatbotRecommendations.js";


// ==========================================
// RESPUESTA CONTEXTUAL
// ==========================================

// Procesa mensajes que dependen del contexto
// de una interacción anterior.
export function getContextualResponse(message) {

  // Normaliza el mensaje para facilitar
  // las comprobaciones posteriores.
  const normalizedMessage =

    normalizeText(message);


  // Detecta si el usuario está haciendo referencia
  // al primer proyecto mostrado anteriormente.
  const wantsFirst =

    normalizedMessage.includes("abre el primero") ||

    normalizedMessage.includes("abrir el primero") ||

    normalizedMessage.includes("el primero");


  // Detecta si el usuario está haciendo referencia
  // al segundo proyecto mostrado anteriormente.
  const wantsSecond =

    normalizedMessage.includes("abre el segundo") ||

    normalizedMessage.includes("abrir el segundo") ||

    normalizedMessage.includes("el segundo");


  // Detecta si el usuario está haciendo referencia
  // al tercer proyecto mostrado anteriormente.
  const wantsThird =

    normalizedMessage.includes("abre el tercero") ||

    normalizedMessage.includes("abrir el tercero") ||

    normalizedMessage.includes("el tercero");


  // Detecta referencias directas como
  // "abre ese" o "quiero ver ese proyecto".
  const wantsThat =

    normalizedMessage === "abre ese" ||

    normalizedMessage === "abrir ese" ||

    normalizedMessage.includes("abre ese proyecto") ||

    normalizedMessage.includes("quiero ver ese");


  // Detecta solicitudes generales de recomendación
  // sobre los proyectos mostrados anteriormente.
  const wantsBest =

    normalizedMessage.includes("cual recomiendas") ||

    normalizedMessage.includes("cuál recomiendas") ||

    normalizedMessage.includes("cual es mejor") ||

    normalizedMessage.includes("cuál es mejor");


  // ==========================================
  // ABRIR PRIMER PROYECTO
  // ==========================================

  // Comprueba que el usuario solicite el primer proyecto
  // y que exista al menos un proyecto en el contexto.
  if (

    wantsFirst &&

    chatbotContext.lastProjects.length >= 1

  ) {

    // Obtiene el primer proyecto de la lista.
    const project =

      chatbotContext.lastProjects[0];


    // Devuelve una acción para abrir
    // el proyecto seleccionado.
    return {

      // Mensaje que se mostrará al usuario.
      answer:

        `Perfecto 🚀 Voy a abrir <strong>${project.titulo}</strong>.`,

      // Define la acción que debe ejecutar
      // el sistema del chatbot.
      action: {

        type: "project",

        projectId: project.id

      },

      // Indica que se trata de una acción directa.
      direct: true

    };

  }


  // ==========================================
  // ABRIR SEGUNDO PROYECTO
  // ==========================================

  // Comprueba que el usuario solicite el segundo proyecto
  // y que exista dentro del contexto.
  if (

    wantsSecond &&

    chatbotContext.lastProjects.length >= 2

  ) {

    // Obtiene el segundo proyecto.
    const project =

      chatbotContext.lastProjects[1];


    // Devuelve la acción para abrirlo.
    return {

      answer:

        `Perfecto 🚀 Voy a abrir <strong>${project.titulo}</strong>.`,

      action: {

        type: "project",

        projectId: project.id

      },

      direct: true

    };

  }


  // ==========================================
  // ABRIR TERCER PROYECTO
  // ==========================================

  // Comprueba que el usuario solicite el tercer proyecto
  // y que existan al menos tres proyectos disponibles.
  if (

    wantsThird &&

    chatbotContext.lastProjects.length >= 3

  ) {

    // Obtiene el tercer proyecto.
    const project =

      chatbotContext.lastProjects[2];


    // Devuelve la acción correspondiente.
    return {

      answer:

        `Perfecto 🚀 Voy a abrir <strong>${project.titulo}</strong>.`,

      action: {

        type: "project",

        projectId: project.id

      },

      direct: true

    };

  }


  // ==========================================
  // ABRIR PROYECTO REFERENCIADO COMO "ESE"
  // ==========================================

  // Comprueba si el usuario hace referencia
  // al último proyecto almacenado.
  if (

    wantsThat &&

    chatbotContext.lastProject

  ) {

    // Devuelve una acción para abrir
    // el último proyecto registrado.
    return {

      answer:

        `Claro 🚀 Voy a abrir <strong>${chatbotContext.lastProject.titulo}</strong>.`,

      action: {

        type: "project",

        projectId: chatbotContext.lastProject.id

      },

      direct: true

    };

  }


  // ==========================================
  // RECOMENDACIÓN CONTEXTUAL
  // ==========================================

  // Comprueba si el usuario solicita
  // una recomendación entre proyectos previamente mostrados.
  if (

    wantsBest &&

    chatbotContext.lastProjects.length

  ) {

    // Selecciona el primer proyecto
    // de los proyectos almacenados.
    const project =

      chatbotContext.lastProjects[0];


    // Guarda el proyecto recomendado
    // como el último proyecto utilizado.
    chatbotContext.lastProject = project;


    // Devuelve una recomendación contextual.
    return {

      answer: `

        🔥 De los proyectos que acabamos de revisar, te recomiendo

        <strong>${project.titulo}</strong>.<br><br>

        ¿Quieres que lo abra?

      `,

      // Proporciona una acción para abrir
      // directamente el proyecto recomendado.
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


  // Detecta si el usuario está utilizando
  // referencias posicionales como primero, segundo o tercero.
  const asksForPosition =

    normalizedMessage.includes("primero") ||

    normalizedMessage.includes("segundo") ||

    normalizedMessage.includes("tercero");


  // Si el usuario utiliza una referencia posicional
  // pero todavía no existen proyectos en el contexto,
  // solicita primero mostrar una lista.
  if (

    asksForPosition &&

    !chatbotContext.lastProjects.length

  ) {

    return {

      // Explica que primero se necesita
      // disponer de una lista de proyectos.
      answer:

        "Primero necesito mostrarte una lista de proyectos 😄.",

      // Ofrece consultas que pueden generar
      // una lista de proyectos.
      suggestions: [

        "proyectos",

        "proyectos frontend",

        "proyectos IoT"

      ]

    };

  }


  // Si ninguna condición contextual coincide,
  // permite que otros sistemas del chatbot
  // procesen el mensaje.
  return null;

}


// ==========================================
// RESPUESTA FALLBACK
// ==========================================

// Genera una respuesta cuando el chatbot
// no encuentra una coincidencia específica.
export function getFallbackResponse() {

  // Lista de respuestas alternativas
  // para mensajes que no pudieron ser interpretados.
  const fallbackResponses = [

    "No entendí completamente 😅, pero puedes preguntarme por proyectos, herramientas, Arduino, ubicación o contacto.",

    "Mmm, creo que no tengo esa información todavía 🤔. Intenta preguntarme por tecnologías, proyectos o contacto.",

    "Todavía estoy aprendiendo 😄. Puedo ayudarte con información sobre el portafolio de Miguel.",

    "No tengo una respuesta exacta para eso, pero puedo guiarte por proyectos, stack, ubicación o GitHub."

  ];


  // Genera un índice aleatorio
  // para seleccionar una respuesta.
  const randomIndex =

    Math.floor(

      Math.random() *

      fallbackResponses.length

    );


  // Devuelve una respuesta aleatoria.
  return fallbackResponses[randomIndex];

}


// ==========================================
// PROCESAMIENTO PRINCIPAL DEL CHATBOT
// ==========================================

// Procesa un mensaje y determina qué módulo
// debe encargarse de responderlo.
export function getBotResponse(message) {

  // Normaliza el mensaje para las comprobaciones
  // que se realizan directamente en esta función.
  const normalizedMessage =

    normalizeText(message);


  // ==========================================
  // COMPARACIÓN DE PROYECTOS
  // ==========================================

  // Comprueba primero si el usuario solicita
  // comparar proyectos.
  const comparisonResponse =

    getComparisonResponse(message);


  // Si existe una respuesta de comparación,
  // la devuelve inmediatamente.
  if (comparisonResponse) {

    return comparisonResponse;

  }


  // ==========================================
  // MEMORIA DE PROYECTOS
  // ==========================================

  // Intenta resolver referencias a proyectos
  // mencionados previamente.
  const memoryProjectResponse =

    getMemoryProjectResponse(message);


  // Si se encontró una referencia válida,
  // devuelve la respuesta correspondiente.
  if (memoryProjectResponse) {

    return memoryProjectResponse;

  }


  // Procesa referencias adicionales relacionadas
  // con la memoria de proyectos.
  const projectMemoryResponse =

    getProjectMemoryResponse(message);


  // Si existe una respuesta válida,
  // detiene el procesamiento.
  if (projectMemoryResponse) {

    return projectMemoryResponse;

  }


  // ==========================================
  // PREGUNTAS CORTAS
  // ==========================================

  // Procesa preguntas breves que pueden ser
  // interpretadas mediante contexto.
  const shortQuestionResponse =

    getShortQuestionResponse(message);


  // Si existe una respuesta para la pregunta corta,
  // la devuelve.
  if (shortQuestionResponse) {

    return shortQuestionResponse;

  }


  // ==========================================
  // RESPUESTAS CONTEXTUALES
  // ==========================================

  // Procesa referencias como "el primero",
  // "ese proyecto", etc.
  const contextualResponse =

    getContextualResponse(message);


  // Si existe una respuesta contextual,
  // la devuelve.
  if (contextualResponse) {

    return contextualResponse;

  }


  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  // Procesa consultas relacionadas
  // con estadísticas del portafolio.
  const statisticsResponse =

    getStatisticsResponse(message);


  // Si existe una respuesta estadística,
  // la devuelve.
  if (statisticsResponse) {

    return statisticsResponse;

  }


  // ==========================================
  // RANKING DE PROYECTOS
  // ==========================================

  // Procesa consultas relacionadas
  // con el ranking de proyectos.
  const rankingResponse =

    getProjectRankingResponse(message);


  // Si existe un resultado de ranking,
  // lo devuelve.
  if (rankingResponse) {

    return rankingResponse;

  }


  // ==========================================
  // RECOMENDACIONES
  // ==========================================

  // Procesa solicitudes de recomendación
  // entre los proyectos.
  const recommendationResponse =

    getRecommendationResponse(message);


  // Si existe una recomendación válida,
  // la devuelve.
  if (recommendationResponse) {

    return recommendationResponse;

  }


  // ==========================================
  // PROYECTOS ESPECIALES
  // ==========================================

  // Procesa consultas sobre proyectos
  // con características especiales.
  const specialProjectResponse =

    getSpecialProjectResponse(message);


  // Si existe una respuesta,
  // la devuelve.
  if (specialProjectResponse) {

    return specialProjectResponse;

  }


  // ==========================================
  // MODO GUÍA
  // ==========================================

  // Procesa las interacciones relacionadas
  // con la guía del portafolio.
  const guideResponse =

    getGuideResponse(message);


  // Si existe una respuesta de guía,
  // la devuelve.
  if (guideResponse) {

    return guideResponse;

  }


  // ==========================================
  // RECLUTADOR AVANZADO
  // ==========================================

  // Procesa consultas avanzadas orientadas
  // a un análisis para reclutadores.
  const advancedRecruiterResponse =

    getAdvancedRecruiterResponse(message);


  // Si existe una respuesta avanzada,
  // la devuelve.
  if (advancedRecruiterResponse) {

    return advancedRecruiterResponse;

  }


  // ==========================================
  // RECLUTADOR
  // ==========================================

  // Procesa consultas generales
  // relacionadas con reclutadores.
  const recruiterResponse =

    getRecruiterResponse(message);


  // Si existe una respuesta para reclutadores,
  // la devuelve.
  if (recruiterResponse) {

    return recruiterResponse;

  }


  // ==========================================
  // NAVEGACIÓN NATURAL
  // ==========================================

  // Detecta intenciones de navegación expresadas
  // mediante lenguaje natural.
  const naturalNavigationResponse =

    getNavigationIntent(message);


  // Si existe una intención de navegación válida,
  // la devuelve.
  if (naturalNavigationResponse) {

    return naturalNavigationResponse;

  }


  // ==========================================
  // NAVEGACIÓN DIRECTA POR SECCIÓN
  // ==========================================

  // Detecta solicitudes explícitas para ir
  // a una sección determinada del portafolio.
  const directSectionAction =

    getDirectSectionAction(message);


  // Si existe una acción directa,
  // la devuelve.
  if (directSectionAction) {

    return directSectionAction;

  }


  // ==========================================
  // LISTA GENERAL DE PROYECTOS
  // ==========================================

  // Detecta solicitudes generales para
  // mostrar el portafolio de proyectos.
  if (

    normalizedMessage === "proyectos" ||

    normalizedMessage === "proyecto" ||

    normalizedMessage === "projects" ||

    normalizedMessage === "portfolio" ||

    normalizedMessage === "portafolio"

  ) {

    // Devuelve la lista completa de proyectos.
    return getProjectsList();

  }


  // ==========================================
  // PROYECTO ESPECÍFICO
  // ==========================================

  // Intenta identificar un proyecto concreto
  // mencionado en el mensaje.
  const matchedProject =

    getProjectFromMessage(message);


  // Si se encontró un proyecto específico,
  // actualiza el contexto y genera su respuesta.
  if (matchedProject) {

    // Define el tema actual como proyecto.
    chatbotContext.lastTopic =

      "project";


    // Guarda el proyecto como último proyecto utilizado.
    chatbotContext.lastProject =

      matchedProject;


    // Guarda el proyecto como último proyecto mencionado.
    chatbotContext.lastMentionedProject =

      matchedProject;


    // Guarda el proyecto como último proyecto seleccionado.
    chatbotContext.lastSelectedProject =

      matchedProject;


    // Actualiza la lista de últimos proyectos
    // para que contenga el proyecto encontrado.
    chatbotContext.lastProjects = [

      matchedProject

    ];


    // Guarda también el proyecto como
    // último proyecto mostrado.
    chatbotContext.lastProjectsShown = [

      matchedProject

    ];


    // Devuelve la respuesta de presentación
    // del proyecto identificado.
    return {

      answer: `

      ${getProjectIntroPhrase()}

      <br><br>

      <strong>${matchedProject.titulo}</strong>

      <br><br>

      ¿Quieres que lo abra?

    `,

      // Ofrece acciones y consultas relacionadas
      // con el proyecto.
      suggestions: [

        {

          label: "Abrir proyecto",

          value: matchedProject.id,

          type: "project"

        },

        "qué tecnologías usa",

        "tiene demo"

      ]

    };

  }


  // ==========================================
  // FILTROS DE PROYECTOS
  // ==========================================

  // Procesa solicitudes para filtrar proyectos
  // por diferentes criterios.
  const projectFilterResponse =

    getProjectFilterResponse(message);


  // Si existe una respuesta de filtrado,
  // la devuelve.
  if (projectFilterResponse) {

    return projectFilterResponse;

  }


  // ==========================================
  // BÚSQUEDA DE PROYECTOS
  // ==========================================

  // Procesa búsquedas específicas dentro
  // del conjunto de proyectos.
  const projectSearchResponse =

    getProjectSearchResponse(message);


  // Si existe una respuesta de búsqueda,
  // la devuelve.
  if (projectSearchResponse) {

    return projectSearchResponse;

  }


  // ==========================================
  // HERRAMIENTAS Y TECNOLOGÍAS
  // ==========================================

  // Detecta consultas relacionadas con
  // herramientas, tecnologías o stack.
  if (

    normalizedMessage.includes("herramienta") ||

    normalizedMessage.includes("herramientas") ||

    normalizedMessage.includes("tecnologia") ||

    normalizedMessage.includes("tecnologias") ||

    normalizedMessage.includes("stack")

  ) {

    // Devuelve la lista de herramientas
    // y tecnologías disponibles.
    return getToolsList();

  }


  // ==========================================
  // RESPUESTAS PREDEFINIDAS
  // ==========================================

  // Busca una respuesta dentro del conjunto
  // de respuestas configuradas en chatbotResponses.js.
  const foundResponse =

    responses.find(item =>

      item.keywords.some(keyword =>

        matchesKeyword(

          message,

          keyword

        )

      )

    );


  // Si se encontró una respuesta coincidente,
  // selecciona una de sus respuestas disponibles.
  if (foundResponse) {

    // Genera un índice aleatorio
    // para variar las respuestas del chatbot.
    const randomIndex =

      Math.floor(

        Math.random() *

        foundResponse.answer.length

      );


    // Devuelve la respuesta encontrada
    // junto con sus sugerencias y acciones.
    return {

      answer: foundResponse.answer[randomIndex],

      suggestions:

        foundResponse.suggestions ||

        getSmartSuggestions(message),

      action: foundResponse.action || null,

      direct: foundResponse.direct || false

    };

  }


  // ==========================================
  // FALLBACK FINAL
  // ==========================================

  // Si ningún módulo pudo procesar el mensaje,
  // devuelve una respuesta genérica con sugerencias.
  return {

    answer: getFallbackResponse(),

    suggestions: getSmartSuggestions(message)

  };

}


// ==========================================
// RESOLUCIÓN DE REFERENCIAS DE PROYECTOS
// ==========================================

// Intenta determinar a qué proyecto se refiere
// el usuario mediante el contexto anterior.
function getMemoryProjectResponse(message) {

  // Busca un proyecto relacionado con
  // la referencia incluida en el mensaje.
  const project =

    resolveProjectReference(message);


  // Si no existe una referencia válida,
  // no se genera ninguna respuesta.
  if (!project) {

    return null;

  }


  // Guarda el proyecto como el último
  // proyecto utilizado.
  chatbotContext.lastProject =

    project;


  // Guarda el proyecto como el último
  // proyecto mencionado.
  chatbotContext.lastMentionedProject =

    project;


  // Guarda el proyecto como el último
  // proyecto seleccionado.
  chatbotContext.lastSelectedProject =

    project;


  // Obtiene la lista de proyectos mostrados
  // anteriormente, siempre que sea un arreglo válido.
  const referenceProjects =

    Array.isArray(

      chatbotContext.lastProjectsShown

    )

      ? chatbotContext.lastProjectsShown

      : [];


  // Busca la posición del proyecto seleccionado
  // dentro de los proyectos mostrados anteriormente.
  chatbotContext.lastSelectedIndex =

    referenceProjects.findIndex(item =>

      item.id === project.id

    );


  // Devuelve la respuesta y la acción
  // para abrir el proyecto identificado.
  return {

    answer:

      `Claro 🚀 Voy a abrir <strong>${project.titulo}</strong>.`,

    action: {

      type: "project",

      projectId: project.id

    },

    // Indica que la acción debe ejecutarse directamente.
    direct: true,

    // Proporciona consultas relacionadas
    // con el proyecto seleccionado.
    suggestions: [

      "qué tecnologías usa",

      "tiene demo",

      "abre el código"

    ]

  };

}