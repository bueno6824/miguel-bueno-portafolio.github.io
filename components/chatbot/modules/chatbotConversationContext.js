// Importa el contexto global del chatbot,
// donde se almacenan los datos de la conversación actual.
import {

  chatbotContext

} from "./chatbotState.js";


/* ==============================
   CONVERSATION CONTEXT
============================== */

// Construye y devuelve un resumen del contexto
// actual de la conversación.
export function getConversationContext() {

  // Obtiene el proyecto que actualmente
  // tiene mayor relevancia en la conversación.
  const activeProject =

    getActiveProject();

  // Obtiene los proyectos actualmente
  // asociados al contexto.
  const activeProjects =

    getActiveProjects();

  // Obtiene los proyectos involucrados
  // en una comparación activa.
  const comparisonProjects =

    getComparisonProjects();

  // Obtiene la información del modo guía
  // del chatbot.
  const guideMode =

    getGuideMode();

  // Devuelve toda la información contextual
  // necesaria para que otros módulos del chatbot
  // puedan interpretar la conversación.
  return {

    // Utiliza el último tema registrado.
    // Si no existe, intenta inferirlo automáticamente.
    topic:

      chatbotContext.lastTopic ||

      inferCurrentTopic(),

    // Identifica el tipo de audiencia
    // para el modo guía.
    audience:

      guideMode.audience ||

      null,

    // Identifica el perfil profesional
    // seleccionado para la guía.
    professionalProfile:

      guideMode.profile ||

      null,

    // Proyecto actualmente activo.
    activeProject,

    // Lista de proyectos actualmente activos.
    activeProjects,

    // Proyectos involucrados en una comparación.
    comparisonProjects,

    // Indica si existe una comparación activa
    // con al menos dos proyectos.
    comparisonActive:

      comparisonProjects.length >= 2,

    // Indica si el modo guía está activo.
    guideActive:

      guideMode.active,

    // Indica el paso actual del modo guía.
    guideStep:

      guideMode.currentStep,

    // Última tecnología mencionada
    // durante la conversación.
    lastTechnology:

      chatbotContext.lastTechnology ||

      null,

    // Última categoría mencionada
    // durante la conversación.
    lastCategory:

      chatbotContext.lastCategory ||

      null,

    // Indica si existe un proyecto activo.
    hasProjectContext:

      Boolean(activeProject),

    // Indica si existen proyectos
    // asociados al contexto actual.
    hasProjectsContext:

      activeProjects.length > 0

  };

}


// Obtiene el proyecto que actualmente tiene
// mayor prioridad dentro del contexto.
export function getActiveProject() {

  // Revisa diferentes fuentes de proyectos
  // en orden de prioridad.
  return (

    // Proyecto seleccionado explícitamente.
    chatbotContext.lastSelectedProject ||

    // Último proyecto mencionado.
    chatbotContext.lastMentionedProject ||

    // Último proyecto utilizado en el contexto.
    chatbotContext.lastProject ||

    // Último proyecto abierto.
    chatbotContext.lastOpenedProject ||

    // Último proyecto recomendado.
    chatbotContext.lastRecommendedProject ||

    // Si no existe ninguno, devuelve null.
    null

  );

}


// Obtiene la lista de proyectos actualmente
// relevantes para la conversación.
export function getActiveProjects() {

  // Obtiene los proyectos mostrados
  // recientemente al usuario.
  const shownProjects =

    getSafeProjects(

      chatbotContext.lastProjectsShown

    );


  // Si existen proyectos mostrados,
  // los considera como los proyectos activos.
  if (shownProjects.length) {

    return shownProjects;

  }


  // Si no existen proyectos mostrados,
  // revisa los proyectos de comparación.
  const comparisonProjects =

    getSafeProjects(

      chatbotContext.comparisonProjects

    );


  // Si existen proyectos de comparación,
  // los utiliza como proyectos activos.
  if (comparisonProjects.length) {

    return comparisonProjects;

  }


  // Como última alternativa, utiliza
  // los últimos proyectos registrados.
  return getSafeProjects(

    chatbotContext.lastProjects

  );

}


// Obtiene los proyectos asociados
// específicamente a una comparación.
export function getComparisonProjects() {

  // Obtiene los proyectos guardados
  // como proyectos de comparación.
  const comparisonProjects =

    getSafeProjects(

      chatbotContext.comparisonProjects

    );


  // Si existen al menos dos proyectos,
  // devuelve únicamente los dos primeros.
  if (

    comparisonProjects.length >= 2

  ) {

    return comparisonProjects.slice(

      0,

      2

    );

  }


  // Si el último tema fue una comparación,
  // intenta recuperar los proyectos utilizados
  // anteriormente en ella.
  if (

    chatbotContext.lastTopic ===

    "project-comparison"

  ) {

    return getSafeProjects(

      chatbotContext.lastProjects

    ).slice(0, 2);

  }


  // Si no existe una comparación válida,
  // devuelve un arreglo vacío.
  return [];

}


// Obtiene y normaliza el estado actual
// del modo guía del chatbot.
export function getGuideMode() {

  // Obtiene la configuración del modo guía
  // almacenada en el contexto.
  const guideMode =

    chatbotContext.guideMode;


  // Si no existe una configuración válida
  // del modo guía, devuelve valores predeterminados.
  if (

    !guideMode ||

    typeof guideMode !== "object"

  ) {

    return {

      // Indica que el modo guía está inactivo.
      active: false,

      // No existe una audiencia seleccionada.
      audience: null,

      // No existe un perfil profesional seleccionado.
      profile: null,

      // El flujo comienza desde el paso cero.
      currentStep: 0,

      // No existen proyectos recomendados.
      recommendedProjects: [],

      // No existen pasos completados.
      completedSteps: []

    };

  }


  // Devuelve una versión segura y normalizada
  // de la configuración del modo guía.
  return {

    // Convierte el estado activo
    // en un valor booleano.
    active:

      Boolean(guideMode.active),

    // Conserva la audiencia seleccionada
    // o utiliza null si no existe.
    audience:

      guideMode.audience || null,

    // Conserva el perfil seleccionado
    // o utiliza null si no existe.
    profile:

      guideMode.profile || null,

    // Convierte el paso actual a número.
    // Si el valor no es válido, utiliza cero.
    currentStep:

      Number(

        guideMode.currentStep

      ) || 0,

    // Obtiene los proyectos recomendados
    // utilizando la función de validación.
    recommendedProjects:

      getSafeProjects(

        guideMode.recommendedProjects

      ),

    // Conserva los pasos completados únicamente
    // si realmente están almacenados como un arreglo.
    completedSteps:

      Array.isArray(

        guideMode.completedSteps

      )

        ? guideMode.completedSteps

        : []

  };

}


// Intenta determinar automáticamente
// cuál es el tema actual de la conversación.
function inferCurrentTopic() {

  // Obtiene primero el estado del modo guía.
  const guideMode =

    getGuideMode();


  // Si el modo guía está activo,
  // ese tiene prioridad como tema actual.
  if (guideMode.active) {

    return "portfolio-guide";

  }


  // Si existen al menos dos proyectos
  // en una comparación, identifica el tema
  // como una comparación de proyectos.
  if (

    getComparisonProjects()

      .length >= 2

  ) {

    return "project-comparison";

  }


  // Si existe un proyecto activo,
  // identifica el tema como proyecto.
  if (getActiveProject()) {

    return "project";

  }


  // Si existen proyectos activos,
  // identifica el tema como proyectos.
  if (

    getActiveProjects().length

  ) {

    return "projects";

  }


  // Si existe una última tecnología registrada,
  // identifica el tema como tecnología.
  if (

    chatbotContext.lastTechnology

  ) {

    return "technology";

  }


  // Si existe una última categoría registrada,
  // identifica el tema como categoría.
  if (

    chatbotContext.lastCategory

  ) {

    return "category";

  }


  // Si no existe suficiente información
  // para determinar el tema actual,
  // devuelve null.
  return null;

}


// Valida y filtra una colección de proyectos
// para garantizar que únicamente contenga
// objetos de proyecto válidos.
function getSafeProjects(

  projects

) {

  // Comprueba que el valor recibido
  // sea realmente un arreglo.
  if (!Array.isArray(projects)) {

    return [];

  }


  // Filtra elementos inválidos y conserva
  // únicamente objetos que tengan un identificador.
  return projects.filter(

    project =>

      project &&

      typeof project === "object" &&

      project.id

  );

}