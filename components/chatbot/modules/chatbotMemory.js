import {

  chatbotContext

} from "./chatbotState.js";

import {

  normalizeText

} from "./chatbotUtils.js";


/* ==============================
   PROJECT REFERENCE RESOLVER
============================== */

// Resuelve referencias indirectas a proyectos,
// como "el ganador", "el primero", "el anterior",
// "ese proyecto", etc., utilizando el contexto
// almacenado por el chatbot.
export function resolveProjectReference(message) {

  // Normaliza el mensaje para facilitar
  // la detección de patrones.
  const normalizedMessage =

    normalizeText(message);

  // Si no existe un mensaje válido,
  // no se puede resolver ninguna referencia.
  if (!normalizedMessage) {

    return null;

  }

  /*
   * Proyecto ganador de una comparación.
   */

  // Comprueba si el usuario está haciendo
  // referencia al proyecto ganador de una
  // comparación realizada anteriormente.
  if (

    matchesAny(normalizedMessage, [

      "el ganador",

      "proyecto ganador",

      "abre el ganador",

      "muestra el ganador"

    ])

  ) {

    // Devuelve el ganador almacenado
    // en el contexto de comparación.
    return (

      chatbotContext.comparisonWinner ||

      null

    );

  }

  /*
   * Proyecto recomendado.
   */

  // Detecta referencias al proyecto
  // recomendado previamente por el chatbot.
  if (

    matchesAny(normalizedMessage, [

      "el recomendado",

      "proyecto recomendado",

      "abre el recomendado",

      "muestra el recomendado"

    ])

  ) {

    // Recupera el último proyecto recomendado.
    return (

      chatbotContext.lastRecommendedProject ||

      null

    );

  }

  /*
   * Primer proyecto del contexto.
   */

  // Detecta referencias al primer proyecto
  // de la lista almacenada en el contexto.
  if (

    matchesAny(normalizedMessage, [

      "el primero",

      "primer proyecto",

      "proyecto uno",

      "proyecto 1",

      "abre el primero"

    ])

  ) {

    // Obtiene el proyecto ubicado
    // en la posición cero.
    return getContextProject(0);

  }

  /*
   * Segundo proyecto del contexto.
   */

  // Detecta referencias al segundo proyecto
  // de la lista almacenada en el contexto.
  if (

    matchesAny(normalizedMessage, [

      "el segundo",

      "segundo proyecto",

      "proyecto dos",

      "proyecto 2",

      "abre el segundo"

    ])

  ) {

    // Obtiene el proyecto ubicado
    // en la posición uno.
    return getContextProject(1);

  }

  /*
   * El otro proyecto de una comparación.
   */

  // Detecta cuando el usuario solicita
  // el proyecto alternativo dentro
  // de una comparación.
  if (

    matchesAny(normalizedMessage, [

      "el otro",

      "otro proyecto",

      "abre el otro",

      "muestra el otro"

    ])

  ) {

    // Busca el proyecto diferente
    // al que se encuentra actualmente
    // en el contexto.
    return getOtherComparisonProject();

  }

  /*
   * Referencias genéricas:
   * ese, este, ábrelo, muéstralo...
   */

  // Detecta referencias al último proyecto
  // mostrado en el contexto.
  if (

    matchesAny(normalizedMessage, [

      "el ultimo",

      "ultimo proyecto",

      "abre el ultimo",

      "muestra el ultimo",

      "quiero el ultimo"

    ])

  ) {

    return getLastShownProject();

  }

  // Detecta solicitudes para regresar
  // al proyecto anterior.
  if (

    matchesAny(normalizedMessage, [

      "el anterior",

      "proyecto anterior",

      "abre el anterior",

      "ahora el anterior",

      "muestra el anterior"

    ])

  ) {

    return getAdjacentProject(-1);

  }

  // Detecta solicitudes para avanzar
  // al siguiente proyecto.
  if (

    matchesAny(normalizedMessage, [

      "el siguiente",

      "proyecto siguiente",

      "abre el siguiente",

      "ahora el siguiente",

      "muestra el siguiente"

    ])

  ) {

    return getAdjacentProject(1);

  }

  // Detecta solicitudes donde el usuario
  // permite seleccionar cualquier proyecto
  // del contexto actual.
  if (

    matchesAny(normalizedMessage, [

      "cualquiera",

      "abre cualquiera",

      "elige uno",

      "muestra cualquiera",

      "un proyecto cualquiera"

    ])

  ) {

    return getRandomContextProject();

  }

  // Detecta referencias directas o genéricas
  // al proyecto seleccionado anteriormente.
  if (

    matchesAny(normalizedMessage, [

      "abre ese",

      "abre este",

      "abrelo",

      "abrelo otra vez",

      "muestralo",

      "quiero ese",

      "quiero este",

      "ese proyecto",

      "este proyecto",

      "ahora ese",

      "ahora este"

    ])

  ) {

    // Utiliza una cadena de alternativas
    // para recuperar el proyecto más relevante.
    return (

      // Proyecto seleccionado explícitamente.
      chatbotContext.lastSelectedProject ||

      // Último proyecto mencionado.
      chatbotContext.lastMentionedProject ||

      // Último proyecto general.
      chatbotContext.lastProject ||

      // Último proyecto abierto.
      chatbotContext.lastOpenedProject ||

      // Último proyecto recomendado.
      chatbotContext.lastRecommendedProject ||

      null

    );

  }

  // Si ninguna referencia coincide,
  // no se puede resolver un proyecto.
  return null;

}


/* ==============================
   CONTEXT PROJECT
============================== */

// Obtiene un proyecto por posición
// desde la lista de últimos proyectos.
function getContextProject(index) {

  // Recupera la lista de proyectos almacenada
  // en el contexto, asegurándose de que sea un arreglo.
  const projects =

    Array.isArray(

      chatbotContext.lastProjects

    )

      ? chatbotContext.lastProjects

      : [];

  // Devuelve el proyecto solicitado
  // o null si la posición no existe.
  return projects[index] || null;

}


// Obtiene la lista de proyectos que debe utilizarse
// para resolver referencias contextuales.
function getReferenceProjects() {

  // Primero intenta utilizar los proyectos
  // mostrados más recientemente.
  const shownProjects =

    Array.isArray(

      chatbotContext.lastProjectsShown

    )

      ? chatbotContext.lastProjectsShown

      : [];

  // Si existen proyectos mostrados,
  // estos tienen prioridad.
  if (shownProjects.length) {

    return shownProjects;

  }

  // Si no existen proyectos mostrados,
  // intenta utilizar los proyectos de comparación.
  const comparisonProjects =

    Array.isArray(

      chatbotContext.comparisonProjects

    )

      ? chatbotContext.comparisonProjects

      : [];

  // Si existe una comparación activa,
  // utiliza esos proyectos.
  if (comparisonProjects.length) {

    return comparisonProjects;

  }

  // Como último recurso,
  // utiliza los últimos proyectos registrados.
  const lastProjects =

    Array.isArray(

      chatbotContext.lastProjects

    )

      ? chatbotContext.lastProjects

      : [];

  // Devuelve la lista disponible.
  return lastProjects;

}


// Obtiene el último proyecto
// de la lista de referencia actual.
function getLastShownProject() {

  // Obtiene los proyectos disponibles
  // para resolver referencias.
  const projects =

    getReferenceProjects();

  // Si no hay proyectos,
  // no existe una referencia que resolver.
  if (!projects.length) {

    return null;

  }

  // Devuelve el último elemento de la lista.
  return projects[

    projects.length - 1

  ];

}


// Obtiene el proyecto anterior o siguiente
// respecto al proyecto actualmente seleccionado.
function getAdjacentProject(direction) {

  // Recupera los proyectos disponibles
  // dentro del contexto actual.
  const projects =

    getReferenceProjects();

  // Si no hay proyectos,
  // no se puede realizar navegación.
  if (!projects.length) {

    return null;

  }

  // Determina cuál es el proyecto actual
  // utilizando varias fuentes de contexto.
  const currentProject =

    chatbotContext.lastSelectedProject ||

    chatbotContext.lastMentionedProject ||

    chatbotContext.lastOpenedProject ||

    chatbotContext.lastProject;

  // Busca la posición del proyecto actual
  // dentro de la lista de referencia.
  let currentIndex =

    projects.findIndex(project =>

      project.id ===

      currentProject?.id

    );

  // Si no se encontró por su ID,
  // utiliza el índice almacenado previamente.
  if (currentIndex < 0) {

    currentIndex =

      chatbotContext.lastSelectedIndex;

  }

  // Si todavía no existe una posición válida,
  // selecciona el primero o el último
  // dependiendo de la dirección.
  if (currentIndex < 0) {

    return direction > 0

      ? projects[0]

      : projects[

      projects.length - 1

      ];

  }

  // Calcula la posición objetivo
  // sumando o restando según la dirección.
  const targetIndex =

    currentIndex + direction;

  /*
   * Navegación circular:
   * después del último vuelve al primero,
   * antes del primero vuelve al último.
   */

  // Normaliza el índice para permitir
  // navegación circular dentro del arreglo.
  const normalizedIndex =

    (

      targetIndex +

      projects.length

    ) %

    projects.length;

  // Devuelve el proyecto ubicado
  // en la posición normalizada.
  return projects[

    normalizedIndex

  ];

}


// Selecciona aleatoriamente uno
// de los proyectos disponibles en el contexto.
function getRandomContextProject() {

  // Obtiene la lista de proyectos de referencia.
  const projects =

    getReferenceProjects();

  // Si no hay proyectos disponibles,
  // no se puede seleccionar ninguno.
  if (!projects.length) {

    return null;

  }

  // Genera un índice aleatorio
  // dentro de los límites del arreglo.
  const randomIndex =

    Math.floor(

      Math.random() *

      projects.length

    );

  // Devuelve el proyecto seleccionado.
  return projects[

    randomIndex

  ];

}


/* ==============================
   OTHER COMPARISON PROJECT
============================== */

// Busca el proyecto alternativo dentro
// de una comparación activa.
function getOtherComparisonProject() {

  // Obtiene los proyectos utilizados
  // en la comparación actual.
  const projects =

    getComparisonProjects();

  // Una comparación necesita al menos
  // dos proyectos.
  if (projects.length < 2) {

    return null;

  }

  // Identifica el proyecto que actualmente
  // se encuentra en el contexto.
  const currentProject =

    chatbotContext.lastMentionedProject ||

    chatbotContext.lastProject ||

    chatbotContext.lastOpenedProject;

  // Si no existe un proyecto actual,
  // devuelve el segundo proyecto.
  if (!currentProject) {

    return projects[1];

  }

  // Busca el primer proyecto cuyo ID
  // sea diferente al proyecto actual.
  const otherProject =

    projects.find(project =>

      project.id !== currentProject.id

    );

  // Devuelve el proyecto encontrado
  // o el segundo proyecto como alternativa.
  return otherProject || projects[1];

}


/* ==============================
   COMPARISON PROJECTS
============================== */

// Obtiene los proyectos que deben considerarse
// como parte de la comparación actual.
function getComparisonProjects() {

  // Recupera los proyectos almacenados
  // específicamente para una comparación.
  const comparisonProjects =

    Array.isArray(

      chatbotContext.comparisonProjects

    )

      ? chatbotContext.comparisonProjects

      : [];

  // Si hay al menos dos proyectos,
  // utiliza los dos primeros.
  if (comparisonProjects.length >= 2) {

    return comparisonProjects.slice(0, 2);

  }

  // Si no hay suficientes proyectos de comparación,
  // intenta utilizar los últimos proyectos.
  const lastProjects =

    Array.isArray(

      chatbotContext.lastProjects

    )

      ? chatbotContext.lastProjects

      : [];

  // Si hay al menos dos proyectos recientes,
  // utiliza los dos primeros.
  if (lastProjects.length >= 2) {

    return lastProjects.slice(0, 2);

  }

  // Si no existe una pareja válida,
  // devuelve una lista vacía.
  return [];

}


/* ==============================
   PATTERN MATCHING
============================== */

// Comprueba si el mensaje contiene
// alguno de los patrones proporcionados.
function matchesAny(message, patterns = []) {

  // Recorre todos los patrones y verifica
  // si alguno aparece dentro del mensaje.
  return patterns.some(pattern =>

    message.includes(

      normalizeText(pattern)

    )

  );

}