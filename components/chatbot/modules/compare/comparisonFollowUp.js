// ==========================================
// DETECTORES DE PREGUNTAS DE COMPARACIÓN
// ==========================================

// Importa funciones encargadas de detectar diferentes
// tipos de preguntas relacionadas con comparaciones.
import {

  // Detecta preguntas sobre cuál proyecto utiliza
  // una mayor cantidad de tecnologías.
  asksForMoreTechnologies,

  // Detecta preguntas sobre la complejidad
  // o dificultad de los proyectos.
  asksForMoreComplexity,

  // Detecta preguntas sobre cuál proyecto
  // es más reciente.
  asksForMoreRecent,

  // Detecta preguntas orientadas a saber
  // qué proyecto podría interesar a un reclutador.
  asksForRecruiterRecommendation,

  // Detecta solicitudes generales de recomendación.
  asksForGeneralRecommendation

} from "./comparisonDetector.js";


// ==========================================
// PROYECTOS UTILIZADOS EN LA COMPARACIÓN
// ==========================================

// Importa la función que recupera los proyectos
// almacenados actualmente en el contexto de comparación.
import {

  getContextualComparisonProjects

} from "./comparisonProjects.js";


// ==========================================
// DETECCIÓN DE TECNOLOGÍAS
// ==========================================

// Importa la función que identifica una tecnología
// específica mencionada en la pregunta del usuario.
import {

  detectComparedTechnology

} from "./comparisonMetrics.js";


// ==========================================
// CONSTRUCTORES DE RESPUESTAS
// ==========================================

// Importa las funciones encargadas de construir
// las respuestas correspondientes a cada tipo
// de comparación.
import {

  // Construye una respuesta comparando
  // la cantidad de tecnologías.
  buildTechnologyCountResponse,

  // Construye una respuesta comparando
  // la complejidad de los proyectos.
  buildComplexityResponse,

  // Construye una respuesta comparando
  // cuál proyecto es más reciente.
  buildRecentResponse,

  // Construye una respuesta sobre el uso
  // de una tecnología específica.
  buildTechnologyUsageResponse,

  // Construye una recomendación general
  // entre los proyectos comparados.
  buildGeneralRecommendation,

  // Construye una recomendación enfocada
  // en el contexto de un reclutador.
  buildRecruiterRecommendation

} from "./comparisonResponses.js";


// ==========================================
// RESPUESTA A PREGUNTAS DE SEGUIMIENTO
// ==========================================

// Procesa una nueva pregunta relacionada con una
// comparación que ya se realizó anteriormente.
export function getComparisonFollowUpResponse(message) {

  // Recupera los proyectos que actualmente forman
  // parte del contexto de comparación.
  const projects =

    getContextualComparisonProjects();


  // ==========================================
  // VALIDAR CONTEXTO DE COMPARACIÓN
  // ==========================================

  // Si no existen al menos dos proyectos,
  // no es posible realizar una comparación.
  if (projects.length < 2) {

    // Devuelve null para indicar que no existe
    // una respuesta de comparación disponible.
    return null;

  }


  // ==========================================
  // OBTENER LOS DOS PROYECTOS
  // ==========================================

  // Extrae los dos primeros proyectos del contexto
  // para utilizarlos durante la comparación.
  const [
    firstProject,
    secondProject
  ] = projects;


  // ==========================================
  // COMPARACIÓN POR CANTIDAD DE TECNOLOGÍAS
  // ==========================================

  // Comprueba si el usuario pregunta cuál proyecto
  // utiliza una mayor cantidad de tecnologías.
  if (

    asksForMoreTechnologies(message)

  ) {

    // Construye y devuelve la respuesta correspondiente
    // utilizando los dos proyectos comparados.
    return buildTechnologyCountResponse(

      firstProject,

      secondProject

    );

  }


  // ==========================================
  // COMPARACIÓN DE COMPLEJIDAD
  // ==========================================

  // Comprueba si el usuario pregunta cuál proyecto
  // es más complejo o difícil.
  if (

    asksForMoreComplexity(message)

  ) {

    // Construye y devuelve la respuesta
    // relacionada con la complejidad.
    return buildComplexityResponse(

      firstProject,

      secondProject

    );

  }


  // ==========================================
  // COMPARACIÓN POR FECHA
  // ==========================================

  // Comprueba si el usuario pregunta cuál proyecto
  // es más reciente.
  if (

    asksForMoreRecent(message)

  ) {

    // Construye y devuelve la respuesta
    // relacionada con la antigüedad de los proyectos.
    return buildRecentResponse(

      firstProject,

      secondProject

    );

  }


  // ==========================================
  // DETECTAR TECNOLOGÍA ESPECÍFICA
  // ==========================================

  // Intenta identificar si el usuario está preguntando
  // por una tecnología concreta utilizada por alguno
  // de los proyectos.
  const detectedTechnology =

    detectComparedTechnology(

      message,

      firstProject,

      secondProject

    );


  // Si se detectó una tecnología específica...
  if (detectedTechnology) {

    // Construye y devuelve una respuesta indicando
    // cómo utilizan esa tecnología los proyectos.
    return buildTechnologyUsageResponse(

      firstProject,

      secondProject,

      detectedTechnology

    );

  }


  // ==========================================
  // RECOMENDACIÓN PARA RECLUTADORES
  // ==========================================

  // Comprueba si la pregunta solicita una recomendación
  // desde la perspectiva de un reclutador.
  if (

    asksForRecruiterRecommendation(

      message

    )

  ) {

    // Construye y devuelve la respuesta
    // correspondiente a ese tipo de consulta.
    return buildRecruiterRecommendation(

      firstProject,

      secondProject

    );

  }


  // ==========================================
  // RECOMENDACIÓN GENERAL
  // ==========================================

  // Comprueba si el usuario solicita una recomendación
  // general entre los dos proyectos.
  if (

    asksForGeneralRecommendation(

      message

    )

  ) {

    // Construye y devuelve la respuesta
    // de recomendación general.
    return buildGeneralRecommendation(

      firstProject,

      secondProject

    );

  }


  // ==========================================
  // SIN RESPUESTA DE COMPARACIÓN
  // ==========================================

  // Si ninguna de las condiciones anteriores coincide,
  // devuelve null para indicar que esta función
  // no puede procesar el mensaje.
  return null;

}