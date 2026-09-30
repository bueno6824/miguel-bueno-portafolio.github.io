/* ==============================

   CHATBOT CONTEXT

============================== */

// Objeto principal que almacena el estado y contexto actual del chatbot.
export const chatbotContext = {

  // Último tema tratado en la conversación.
  lastTopic: null,

  // Lista de los últimos proyectos utilizados en el contexto.
  lastProjects: [],

  // Último proyecto activo o relevante.
  lastProject: null,

  // Último proyecto mencionado explícitamente.
  lastMentionedProject: null,

  // Último proyecto recomendado por el chatbot.
  lastRecommendedProject: null,

  // Último proyecto que fue abierto.
  lastOpenedProject: null,

  // Última tecnología mencionada.
  lastTechnology: null,

  // Última categoría mencionada.
  lastCategory: null,

  // Proyectos involucrados en una comparación.
  comparisonProjects: [],

  // Proyecto identificado como ganador de una comparación.
  comparisonWinner: null,

  // Últimos proyectos mostrados al usuario.
  lastProjectsShown: [],

  // Último proyecto seleccionado por el usuario.
  lastSelectedProject: null,

  // Índice del último proyecto seleccionado.
  lastSelectedIndex: -1,

  // Estado y progreso del modo guía del chatbot.
  guideMode: {

    // Indica si el modo guía está activo.
    active: false,

    // Público al que está dirigida la guía.
    audience: null,

    // Perfil profesional utilizado durante la guía.
    profile: null,

    // Paso actual dentro del proceso de guía.
    currentStep: 0,

    // Proyectos recomendados durante la guía.
    recommendedProjects: [],

    // Pasos que ya fueron completados.
    completedSteps: []

  }

};

// Contexto utilizado específicamente para las recomendaciones.
recommendationContext: null

/* ==============================

   CONTEXT HELPERS

============================== */

// Restablece todos los valores del contexto del chatbot a su estado inicial.
export function resetChatbotContext() {

  // Restablece el último tema tratado.
  chatbotContext.lastTopic = null;

  // Limpia la lista de últimos proyectos.
  chatbotContext.lastProjects = [];

  // Restablece el último proyecto activo.
  chatbotContext.lastProject = null;

  // Restablece el último proyecto mencionado.
  chatbotContext.lastMentionedProject = null;

  // Restablece el último proyecto recomendado.
  chatbotContext.lastRecommendedProject = null;

  // Restablece el último proyecto abierto.
  chatbotContext.lastOpenedProject = null;

  // Restablece la última tecnología mencionada.
  chatbotContext.lastTechnology = null;

  // Restablece la última categoría mencionada.
  chatbotContext.lastCategory = null;

  // Limpia los proyectos utilizados en comparaciones.
  chatbotContext.comparisonProjects = [];

  // Restablece el ganador de la comparación.
  chatbotContext.comparisonWinner = null;

  // Limpia los últimos proyectos mostrados.
  chatbotContext.lastProjectsShown = [];

  // Restablece el último proyecto seleccionado.
  chatbotContext.lastSelectedProject = null;

  // Restablece el índice del proyecto seleccionado.
  chatbotContext.lastSelectedIndex = -1;

  // Restablece completamente el estado del modo guía.
  chatbotContext.guideMode = {

    // Desactiva el modo guía.
    active: false,

    // Limpia el público seleccionado.
    audience: null,

    // Limpia el perfil profesional seleccionado.
    profile: null,

    // Regresa el paso actual al inicio.
    currentStep: 0,

    // Limpia los proyectos recomendados.
    recommendedProjects: [],

    // Limpia los pasos completados.
    completedSteps: []

  };

  // Restablece el contexto utilizado para recomendaciones.
  chatbotContext.recommendationContext =

    null;

}