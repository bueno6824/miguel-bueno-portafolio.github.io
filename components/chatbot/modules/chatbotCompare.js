// Importa el objeto que mantiene el estado
// y contexto actual de la conversación.
import {

  chatbotContext

} from "./chatbotState.js";


// Importa la función que normaliza el mensaje
// antes de analizarlo.
import {

  normalizeText

} from "./chatbotUtils.js";


// Importa el detector que determina si el usuario
// está solicitando una comparación de proyectos.
import {

  isComparisonRequest

} from "./compare/comparisonDetector.js";


// Importa la función encargada de identificar
// los proyectos mencionados en la comparación.
import {

  getProjectsForComparison

} from "./compare/comparisonProjects.js";


// Importa el sistema que procesa preguntas
// posteriores relacionadas con una comparación.
import {

  getComparisonFollowUpResponse

} from "./compare/comparisonFollowUp.js";


// Importa la función que construye
// la respuesta principal de comparación.
import {

  buildComparisonResponse

} from "./compare/comparisonResponses.js";


/* ==============================
   COMPARISON RESPONSE
============================== */

// Procesa las solicitudes del usuario relacionadas
// con la comparación de proyectos.
export function getComparisonResponse(message) {

  // Normaliza el mensaje para facilitar
  // las comprobaciones posteriores.
  const normalizedMessage =

    normalizeText(message);


  // Si el mensaje está vacío después
  // de normalizarlo, no se procesa.
  if (!normalizedMessage) {

    return null;

  }


  /* ==============================
     NUEVA COMPARACIÓN EXPLÍCITA
  ============================== */

  // Comprueba si el mensaje representa
  // una nueva solicitud de comparación.
  if (

    isComparisonRequest(

      normalizedMessage

    )

  ) {

    // Obtiene los proyectos mencionados
    // en la solicitud de comparación.
    const projects =

      getProjectsForComparison(

        normalizedMessage

      );


    // Si no se pudieron identificar al menos
    // dos proyectos, solicita información adicional.
    if (projects.length < 2) {

      return {

        // Explica al usuario que hacen falta
        // dos proyectos para realizar la comparación.
        answer:

          "Necesito identificar dos proyectos para compararlos 😅. Puedes decir, por ejemplo: <strong>“Compara el proyecto 1 con el 2”</strong>.",

        // Proporciona ejemplos de consultas
        // que el usuario puede realizar.
        suggestions: [

          "ver proyectos",

          "compara el proyecto 1 con el 2",

          "proyecto más complejo"

        ]

      };

    }


    // Separa los dos proyectos identificados
    // para utilizarlos individualmente.
    const [

      firstProject,

      secondProject

    ] = projects;


    // Guarda en el contexto que el último tema
    // tratado corresponde a una comparación.
    chatbotContext.lastTopic =

      "project-comparison";


    // Guarda los dos proyectos comparados
    // como los últimos proyectos utilizados.
    chatbotContext.lastProjects = [

      firstProject,

      secondProject

    ];


    // Guarda los proyectos de comparación
    // específicamente en el contexto correspondiente.
    chatbotContext.comparisonProjects = [

      firstProject,

      secondProject

    ];


    // Guarda el primer proyecto como el último
    // proyecto mencionado en la conversación.
    chatbotContext.lastMentionedProject =

      firstProject;


    // Construye y devuelve la respuesta completa
    // utilizando los dos proyectos identificados.
    return buildComparisonResponse(

      firstProject,

      secondProject

    );

  }


  /* ==============================
     SEGUIMIENTO CONTEXTUAL
  ============================== */

  // Comprueba si el mensaje corresponde
  // a una pregunta relacionada con una comparación
  // realizada anteriormente.
  const contextualResponse =

    getComparisonFollowUpResponse(

      normalizedMessage

    );


  // Si existe una respuesta contextual válida,
  // la devuelve directamente.
  if (contextualResponse) {

    return contextualResponse;

  }


  // Si el mensaje no corresponde a una nueva
  // comparación ni a un seguimiento contextual,
  // devuelve null para permitir que otros módulos
  // del chatbot procesen la consulta.
  return null;

}