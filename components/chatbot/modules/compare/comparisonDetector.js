import {
  // Importa la función encargada de normalizar el texto
  // para facilitar la comparación de mensajes.
  normalizeText

} from "../chatbotUtils.js";


// ==========================================
// DETECTAR SOLICITUD DE COMPARACIÓN
// ==========================================

// Determina si el mensaje del usuario solicita
// comparar dos o más proyectos.
export function isComparisonRequest(message) {

  // Palabras y frases que indican una intención
  // de comparación entre proyectos.
  const comparisonKeywords = [

    "compara",

    "comparar",

    "comparalos",

    "comparalos",

    "comparacion",

    "diferencias",

    "diferencia entre",

    "cual de los dos",

    "cual es mejor",

    "entre ambos",

    "entre los dos"

  ];

  // Comprueba si alguna palabra o frase de comparación
  // está presente dentro del mensaje normalizado.
  return comparisonKeywords.some(

    keyword =>

      message.includes(

        normalizeText(keyword)

      )

  );

}


// ==========================================
// EXTRAER ÍNDICES DE PROYECTOS
// ==========================================

// Obtiene los números o referencias de los proyectos
// mencionados dentro del mensaje del usuario.
export function extractProjectIndexes(message) {

  // Almacena los índices de los proyectos encontrados.
  const indexes = [];


  // Función auxiliar para agregar un índice
  // evitando valores inválidos o duplicados.
  const addIndex = index => {

    if (

      index >= 0 &&

      !indexes.includes(index)

    ) {

      indexes.push(index);

    }

  };


  /* ==============================
     REFERENCIAS CON NÚMEROS
  ============================== */

  // Patrones utilizados para detectar referencias
  // numéricas a los proyectos.
  const numericPatterns = [

    {
      // Detecta referencias al proyecto número 1.
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?1\b/g,

      // El primer proyecto corresponde al índice 0.
      index: 0

    },

    {
      // Detecta referencias al proyecto número 2.
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?2\b/g,

      // El segundo proyecto corresponde al índice 1.
      index: 1

    },

    {
      // Detecta referencias al proyecto número 3.
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?3\b/g,

      // El tercer proyecto corresponde al índice 2.
      index: 2

    },

    {
      // Detecta referencias al proyecto número 4.
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?4\b/g,

      // El cuarto proyecto corresponde al índice 3.
      index: 3

    }

  ];


  // Recorre todos los patrones numéricos
  // para comprobar cuáles aparecen en el mensaje.
  numericPatterns.forEach(

    ({ regex, index }) => {

      // Si el patrón coincide con el mensaje,
      // agrega el índice correspondiente.
      if (regex.test(message)) {

        addIndex(index);

      }

    }

  );


  /* ==============================
     REFERENCIAS ESCRITAS
  ============================== */

  // Permite detectar referencias escritas con palabras
  // como "primero", "segundo", "tercero", etc.
  const wordReferences = [

    {
      // Diferentes formas de referirse al primer proyecto.
      patterns: [

        "proyecto uno",

        "primer proyecto",

        "el primero",

        "primero"

      ],

      // Índice correspondiente al primer proyecto.
      index: 0

    },

    {
      // Diferentes formas de referirse al segundo proyecto.
      patterns: [

        "proyecto dos",

        "segundo proyecto",

        "el segundo",

        "segundo"

      ],

      // Índice correspondiente al segundo proyecto.
      index: 1

    },

    {
      // Diferentes formas de referirse al tercer proyecto.
      patterns: [

        "proyecto tres",

        "tercer proyecto",

        "el tercero",

        "tercero"

      ],

      // Índice correspondiente al tercer proyecto.
      index: 2

    },

    {
      // Diferentes formas de referirse al cuarto proyecto.
      patterns: [

        "proyecto cuatro",

        "cuarto proyecto",

        "el cuarto",

        "cuarto"

      ],

      // Índice correspondiente al cuarto proyecto.
      index: 3

    }

  ];


  // Recorre todas las referencias escritas
  // disponibles para los proyectos.
  wordReferences.forEach(reference => {

    // Comprueba si alguna de las expresiones
    // asociadas con el proyecto aparece en el mensaje.
    const matches =

      reference.patterns.some(pattern =>

        message.includes(

          normalizeText(pattern)

        )

      );


    // Si se encontró una referencia válida,
    // agrega el índice del proyecto.
    if (matches) {

      addIndex(reference.index);

    }

  });


  // Devuelve la lista de índices encontrados.
  return indexes;

}


// ==========================================
// REFERENCIAS A PROYECTOS ANTERIORES
// ==========================================

// Detecta cuando el usuario se refiere a proyectos
// mencionados previamente en la conversación.
export function refersToPreviousProjects(message) {

  // Frases que dependen del contexto de proyectos
  // mencionados anteriormente.
  const contextualPatterns = [

    "comparalos",

    "compara esos",

    "compara ambos",

    "entre ellos",

    "entre los dos",

    "cual de esos",

    "cual de los dos",

    "que diferencias tienen"

  ];

  // Comprueba si alguna referencia contextual
  // está presente en el mensaje.
  return contextualPatterns.some(

    pattern =>

      message.includes(

        normalizeText(pattern)

      )

  );

}


// ==========================================
// COMPROBAR MÚLTIPLES PATRONES
// ==========================================

// Función reutilizable para determinar si un mensaje
// coincide con cualquiera de los patrones recibidos.
export function matchesAnyPattern(message, patterns) {

  // Devuelve true si al menos uno de los patrones
  // aparece dentro del mensaje normalizado.
  return patterns.some(pattern =>

    message.includes(

      normalizeText(pattern)

    )

  );

}


// ==========================================
// SOLICITAR COMPARACIÓN DE TECNOLOGÍAS
// ==========================================

// Detecta preguntas relacionadas con cuál proyecto
// utiliza una mayor cantidad de tecnologías.
export function asksForMoreTechnologies(message) {

  // Frases que indican interés en comparar
  // la cantidad de tecnologías utilizadas.
  const patterns = [

    "cual usa mas tecnologias",

    "cual tiene mas tecnologias",

    "cual utiliza mas tecnologias",

    "cual de los dos usa mas",

    "quien usa mas tecnologias",

    "mas tecnologias"

  ];

  // Comprueba si el mensaje coincide con
  // cualquiera de las frases anteriores.
  return matchesAnyPattern(

    message,

    patterns

  );

}


// ==========================================
// SOLICITAR COMPARACIÓN DE COMPLEJIDAD
// ==========================================

// Detecta preguntas relacionadas con la dificultad
// o complejidad de los proyectos.
export function asksForMoreComplexity(message) {

  // Frases relacionadas con complejidad o dificultad.
  const patterns = [

    "cual es mas complejo",

    "cual fue mas complejo",

    "cual es mas dificil",

    "cual fue mas dificil",

    "mayor complejidad",

    "mas complejo",

    "mas dificil"

  ];

  // Comprueba si el mensaje coincide con
  // alguno de los patrones de complejidad.
  return matchesAnyPattern(

    message,

    patterns

  );

}


// ==========================================
// SOLICITAR PROYECTO MÁS RECIENTE
// ==========================================

// Detecta preguntas relacionadas con cuál proyecto
// fue realizado o actualizado más recientemente.
export function asksForMoreRecent(message) {

  // Frases relacionadas con la fecha o actualidad
  // de los proyectos.
  const patterns = [

    "cual es mas reciente",

    "cual fue mas reciente",

    "cual es mas nuevo",

    "cual fue el ultimo",

    "cual hiciste despues",

    "mas reciente"

  ];

  // Comprueba si el mensaje coincide con
  // alguno de los patrones de actualidad.
  return matchesAnyPattern(

    message,

    patterns

  );

}


// ==========================================
// RECOMENDACIÓN PARA RECLUTADORES
// ==========================================

// Detecta cuando el usuario pregunta qué proyecto
// podría ser relevante para un reclutador o empresa.
export function asksForRecruiterRecommendation(message) {

  // Frases relacionadas con entrevistas,
  // contratación y demostración de experiencia.
  const patterns = [

    "mejor para un reclutador",

    "mejor para reclutadores",

    "cual mostrarias a una empresa",

    "cual mostrarias en una entrevista",

    "cual sirve mas para conseguir trabajo",

    "cual demuestra mas experiencia"

  ];

  // Comprueba si el mensaje coincide con
  // alguno de los patrones para reclutadores.
  return matchesAnyPattern(

    message,

    patterns

  );

}


// ==========================================
// RECOMENDACIÓN GENERAL
// ==========================================

// Detecta cuando el usuario solicita una recomendación
// general entre diferentes proyectos.
export function asksForGeneralRecommendation(message) {

  // Frases que indican que el usuario quiere
  // elegir o recibir una recomendación.
  const patterns = [

    "cual recomiendas",

    "cual recomendarias",

    "cual es mejor",

    "con cual te quedas",

    "cual mostrarias",

    "elige uno"

  ];

  // Comprueba si el mensaje coincide con
  // alguno de los patrones de recomendación.
  return matchesAnyPattern(

    message,

    patterns

  );

}