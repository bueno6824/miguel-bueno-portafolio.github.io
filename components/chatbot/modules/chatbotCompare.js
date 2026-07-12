import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText
} from "./chatbotUtils.js";

import {
  isComparisonRequest
} from "./compare/comparisonDetector.js";

import {
  getProjectsForComparison
} from "./compare/comparisonProjects.js";

import {
  getComparisonFollowUpResponse
} from "./compare/comparisonFollowUp.js";

import {
  buildComparisonResponse
} from "./compare/comparisonResponses.js";


/* ==============================
   COMPARISON RESPONSE
============================== */

export function getComparisonResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  /* ==============================
     NUEVA COMPARACIÓN EXPLÍCITA
  ============================== */

  if (
    isComparisonRequest(
      normalizedMessage
    )
  ) {
    const projects =
      getProjectsForComparison(
        normalizedMessage
      );

    if (projects.length < 2) {
      return {
        answer:
          "Necesito identificar dos proyectos para compararlos 😅. Puedes decir, por ejemplo: <strong>“Compara el proyecto 1 con el 2”</strong>.",

        suggestions: [
          "ver proyectos",
          "compara el proyecto 1 con el 2",
          "proyecto más complejo"
        ]
      };
    }

    const [
      firstProject,
      secondProject
    ] = projects;

    chatbotContext.lastTopic =
      "project-comparison";

    chatbotContext.lastProjects = [
      firstProject,
      secondProject
    ];
    
    chatbotContext.comparisonProjects = [
  firstProject,
  secondProject
];

chatbotContext.lastMentionedProject =
  firstProject;
  
  

    return buildComparisonResponse(
      firstProject,
      secondProject
    );
  }

  /* ==============================
     SEGUIMIENTO CONTEXTUAL
  ============================== */

  const contextualResponse =
    getComparisonFollowUpResponse(
      normalizedMessage
    );

  if (contextualResponse) {
    return contextualResponse;
  }

  return null;
}