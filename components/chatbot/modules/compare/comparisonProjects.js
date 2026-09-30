// ==========================================
// OBTENER PROYECTOS
// ==========================================

// Importa la función que proporciona la lista
// completa de proyectos disponibles.
import {

  getProjects

} from "../chatbotProjects.js";


// ==========================================
// CONTEXTO DEL CHATBOT
// ==========================================

// Importa el estado global utilizado para conservar
// información de la conversación actual.
import {

  chatbotContext

} from "../chatbotState.js";


// ==========================================
// NORMALIZACIÓN DE TEXTO
// ==========================================

// Importa la función utilizada para normalizar textos
// antes de realizar comparaciones.
import {

  normalizeText

} from "../chatbotUtils.js";


// ==========================================
// DETECCIÓN DE REFERENCIAS A PROYECTOS
// ==========================================

// Importa funciones encargadas de detectar proyectos
// mencionados mediante números o referencias contextuales.
import {

  extractProjectIndexes,

  refersToPreviousProjects

} from "./comparisonDetector.js";


// ==========================================
// OBTENER PROYECTOS PARA COMPARACIÓN
// ==========================================

// Identifica hasta dos proyectos que el usuario
// desea utilizar dentro de una comparación.
export function getProjectsForComparison(message) {

  // Obtiene todos los proyectos disponibles.
  const projects =

    getProjects();


  // Si no existen al menos dos proyectos,
  // no es posible realizar una comparación.
  if (projects.length < 2) {

    return [];

  }


  // Almacena los proyectos detectados
  // dentro del mensaje del usuario.
  const detectedProjects = [];


  /* ==============================
     IDS EXPLÍCITOS
  ============================== */

  // Normaliza el mensaje completo para facilitar
  // la búsqueda de IDs y títulos.
  const cleanMessage =

    normalizeProjectTitle(message);


  // Recorre todos los proyectos disponibles
  // para buscar coincidencias explícitas.
  projects.forEach(project => {

    // Normaliza el identificador del proyecto.
    const projectId =

      normalizeText(project.id);


    // Normaliza el título del proyecto para
    // poder compararlo con el mensaje.
    const projectTitle =

      normalizeProjectTitle(

        project.titulo

      );


    // Comprueba si el ID del proyecto aparece
    // dentro del mensaje.
    const matchesId =

      projectId &&

      cleanMessage.includes(

        projectId

      );


    // Comprueba si el título del proyecto
    // aparece dentro del mensaje.
    const matchesTitle =

      projectTitle &&

      cleanMessage.includes(

        projectTitle

      );


    // Si coincide el ID o el título,
    // agrega el proyecto a los detectados.
    if (

      matchesId ||

      matchesTitle

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

  // Obtiene los índices de proyectos mencionados
  // mediante referencias numéricas.
  const indexes =

    extractProjectIndexes(message);


  // Recorre los índices encontrados.
  indexes.forEach(index => {

    // Obtiene el proyecto correspondiente
    // a cada índice.
    const project =

      projects[index];


    // Comprueba que el proyecto exista.
    if (project) {

      // Agrega el proyecto evitando duplicados.
      addUniqueProject(

        detectedProjects,

        project

      );

    }

  });


  /* ==============================
     CONTEXTO RECIENTE
  ============================== */

  // Si todavía no se han encontrado dos proyectos
  // y el mensaje hace referencia a proyectos anteriores,
  // intenta recuperarlos desde el contexto del chatbot.
  if (

    detectedProjects.length < 2 &&

    refersToPreviousProjects(

      cleanMessage

    )

  ) {

    // Combina diferentes fuentes de proyectos almacenados
    // previamente en el contexto de conversación.
    const contextualProjects = [

      ...(chatbotContext.lastProjectsShown || []),

      ...(chatbotContext.comparisonProjects || []),

      ...(chatbotContext.lastProjects || [])

    ];


    // Recorre los proyectos almacenados en el contexto.
    contextualProjects.forEach(project => {

      // Agrega cada proyecto evitando duplicados.
      addUniqueProject(

        detectedProjects,

        project

      );

    });

  }


  // Devuelve como máximo los dos primeros proyectos
  // detectados para realizar la comparación.
  return detectedProjects.slice(0, 2);

}


// ==========================================
// AGREGAR PROYECTO SIN DUPLICADOS
// ==========================================

// Agrega un proyecto a una colección solamente
// si todavía no existe dentro de ella.
export function addUniqueProject(collection, project) {

  // Ignora el proyecto si no existe
  // o si no tiene un identificador.
  if (!project?.id) {

    return;

  }


  // Comprueba si ya existe un proyecto con
  // el mismo ID dentro de la colección.
  const alreadyExists =

    collection.some(item =>

      normalizeText(item.id) ===

      normalizeText(project.id)

    );


  // Si el proyecto todavía no existe,
  // lo agrega a la colección.
  if (!alreadyExists) {

    collection.push(project);

  }

}


// ==========================================
// OBTENER PROYECTOS DEL CONTEXTO
// ==========================================

// Recupera los dos proyectos utilizados
// en la comparación actual desde el estado del chatbot.
export function getContextualComparisonProjects() {

  // Obtiene los últimos proyectos almacenados
  // en el contexto si la propiedad es un arreglo.
  const contextualProjects =

    Array.isArray(

      chatbotContext.lastProjects

    )

      ? chatbotContext.lastProjects

      : [];


  // Comprueba que el último tema de conversación
  // sea una comparación de proyectos y que existan
  // al menos dos proyectos almacenados.
  if (

    chatbotContext.lastTopic !==

    "project-comparison" ||

    contextualProjects.length < 2

  ) {

    // Si no se cumple el contexto esperado,
    // devuelve una lista vacía.
    return [];

  }


  // Devuelve únicamente los dos primeros proyectos
  // almacenados en el contexto.
  return contextualProjects.slice(0, 2);

}


// ==========================================
// NORMALIZAR TÍTULO DE PROYECTO
// ==========================================

// Función interna utilizada para limpiar y normalizar
// títulos antes de compararlos con mensajes.
function normalizeProjectTitle(value = "") {

  // Primero normaliza el texto utilizando
  // la función general del chatbot.
  return normalizeText(value)

    // Reemplaza caracteres especiales por espacios,
    // conservando letras, números y espacios.
    .replace(

      /[^\p{L}\p{N}\s]/gu,

      " "

    )

    // Reemplaza múltiples espacios consecutivos
    // por un único espacio.
    .replace(/\s+/g, " ")

    // Elimina espacios innecesarios al inicio y al final.
    .trim();

}