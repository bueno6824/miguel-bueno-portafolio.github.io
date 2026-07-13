import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText,
  matchesKeyword
} from "./chatbotUtils.js";

import {
  responses
} from "../data/chatbotResponses.js";

import {
  getProjectsList,
  getProjectFromMessage,
  searchProjects,
  getProjectSearchResponse,
  getSpecialProjectResponse
} from "./chatbotProjects.js";

import {
  getToolsList,
  getRecruiterResponse
} from "./chatbotRecruiter.js";

import {
  getSmartSuggestions
} from "./chatbotSuggestions.js";

import {
  getDirectSectionAction
} from "./chatbotActions.js";

import {
  getStatisticsResponse
} from "./chatbotStatistics.js";

import {
  getComparisonResponse
} from "./chatbotCompare.js";

import {
  resolveProjectReference
} from "./chatbotMemory.js";

import {
  getProjectMemoryResponse
} from "./chatbotProjectMemory.js";

import {
  getAdvancedRecruiterResponse
} from "./chatbotRecruiterAdvanced.js";

import {
  getGuideResponse
} from "./chatbotGuide.js";

import {
  getProjectIntroPhrase
} from "./chatbotPhrases.js";

import {
  getNavigationIntent
} from "./chatbotNavigationIntent.js";

import {
  getShortQuestionResponse
} from "./chatbotShortQuestions.js";

import {
  getProjectFilterResponse
} from "./chatbotProjectFilters.js";

import {
  getProjectRankingResponse
} from "./chatbotProjectRanking.js";

import {
  getRecommendationResponse
} from "./chatbotRecommendations.js";

export function getContextualResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  const wantsFirst =
    normalizedMessage.includes("abre el primero") ||
    normalizedMessage.includes("abrir el primero") ||
    normalizedMessage.includes("el primero");

  const wantsSecond =
    normalizedMessage.includes("abre el segundo") ||
    normalizedMessage.includes("abrir el segundo") ||
    normalizedMessage.includes("el segundo");

  const wantsThird =
    normalizedMessage.includes("abre el tercero") ||
    normalizedMessage.includes("abrir el tercero") ||
    normalizedMessage.includes("el tercero");

  const wantsThat =
    normalizedMessage === "abre ese" ||
    normalizedMessage === "abrir ese" ||
    normalizedMessage.includes("abre ese proyecto") ||
    normalizedMessage.includes("quiero ver ese");

  const wantsBest =
    normalizedMessage.includes("cual recomiendas") ||
    normalizedMessage.includes("cuál recomiendas") ||
    normalizedMessage.includes("cual es mejor") ||
    normalizedMessage.includes("cuál es mejor");

  if (
    wantsFirst &&
    chatbotContext.lastProjects.length >= 1
  ) {
    const project =
      chatbotContext.lastProjects[0];

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

  if (
    wantsSecond &&
    chatbotContext.lastProjects.length >= 2
  ) {
    const project =
      chatbotContext.lastProjects[1];

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

  if (
    wantsThird &&
    chatbotContext.lastProjects.length >= 3
  ) {
    const project =
      chatbotContext.lastProjects[2];

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

  if (
    wantsThat &&
    chatbotContext.lastProject
  ) {
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

  if (
    wantsBest &&
    chatbotContext.lastProjects.length
  ) {
    const project =
      chatbotContext.lastProjects[0];

    chatbotContext.lastProject = project;

    return {
      answer: `
        🔥 De los proyectos que acabamos de revisar, te recomiendo
        <strong>${project.titulo}</strong>.<br><br>
        ¿Quieres que lo abra?
      `,
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


const asksForPosition =
  normalizedMessage.includes("primero") ||
  normalizedMessage.includes("segundo") ||
  normalizedMessage.includes("tercero");

if (
  asksForPosition &&
  !chatbotContext.lastProjects.length
) {
  return {
    answer:
      "Primero necesito mostrarte una lista de proyectos 😄.",
    suggestions: [
      "proyectos",
      "proyectos frontend",
      "proyectos IoT"
    ]
  };
}
  return null;
}

export function getFallbackResponse() {
  const fallbackResponses = [
    "No entendí completamente 😅, pero puedes preguntarme por proyectos, herramientas, Arduino, ubicación o contacto.",
    "Mmm, creo que no tengo esa información todavía 🤔. Intenta preguntarme por tecnologías, proyectos o contacto.",
    "Todavía estoy aprendiendo 😄. Puedo ayudarte con información sobre el portafolio de Miguel.",
    "No tengo una respuesta exacta para eso, pero puedo guiarte por proyectos, stack, ubicación o GitHub."
  ];

  const randomIndex =
    Math.floor(
      Math.random() *
      fallbackResponses.length
    );

  return fallbackResponses[randomIndex];
}

export function getBotResponse(message) {
const normalizedMessage =
  normalizeText(message);

const comparisonResponse =
  getComparisonResponse(message);
if (comparisonResponse) {
  return comparisonResponse;
}

const memoryProjectResponse =
  getMemoryProjectResponse(message);
if (memoryProjectResponse) {
  return memoryProjectResponse;
}

const projectMemoryResponse =
  getProjectMemoryResponse(message);
if (projectMemoryResponse) {
  return projectMemoryResponse;
}

const shortQuestionResponse =
  getShortQuestionResponse(message);
if (shortQuestionResponse) {
  return shortQuestionResponse;
}

const contextualResponse =
  getContextualResponse(message);
if (contextualResponse) {
  return contextualResponse;
}

const statisticsResponse =
  getStatisticsResponse(message);
if (statisticsResponse) {
  return statisticsResponse;
}

const rankingResponse =
  getProjectRankingResponse(message);
if (rankingResponse) {
  return rankingResponse;
}

const recommendationResponse =
  getRecommendationResponse(message);
if (recommendationResponse) {
  return recommendationResponse;
}

const specialProjectResponse =
  getSpecialProjectResponse(message);
if (specialProjectResponse) {
  return specialProjectResponse;
}

const guideResponse =
  getGuideResponse(message);
if (guideResponse) {
  return guideResponse;
}

const advancedRecruiterResponse =
getAdvancedRecruiterResponse(message);
if (advancedRecruiterResponse) {
  return advancedRecruiterResponse;
}

const recruiterResponse =
  getRecruiterResponse(message);
if (recruiterResponse) {
  return recruiterResponse;
}

const naturalNavigationResponse =
  getNavigationIntent(message);
if (naturalNavigationResponse) {
  return naturalNavigationResponse;
}

const directSectionAction =
  getDirectSectionAction(message);
if (directSectionAction) {
  return directSectionAction;
}

  if (
    normalizedMessage === "proyectos" ||
    normalizedMessage === "proyecto" ||
    normalizedMessage === "projects" ||
    normalizedMessage === "portfolio" ||
    normalizedMessage === "portafolio"
  ) {
    return getProjectsList();
  }

  const matchedProject =
  getProjectFromMessage(message);

if (matchedProject) {
  chatbotContext.lastTopic =
    "project";

  chatbotContext.lastProject =
    matchedProject;

  chatbotContext.lastMentionedProject =
    matchedProject;

  chatbotContext.lastSelectedProject =
    matchedProject;

  chatbotContext.lastProjects = [
    matchedProject
  ];

  chatbotContext.lastProjectsShown = [
    matchedProject
  ];

  return {
    answer: `
      ${getProjectIntroPhrase()}

      <br><br>

      <strong>${matchedProject.titulo}</strong>

      <br><br>

      ¿Quieres que lo abra?
    `,

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

const projectFilterResponse =
  getProjectFilterResponse(message);
if (projectFilterResponse) {
  return projectFilterResponse;
}

  const projectSearchResponse =
    getProjectSearchResponse(message);
  if (projectSearchResponse) {
    return projectSearchResponse;
  }


  if (
    normalizedMessage.includes("herramienta") ||
    normalizedMessage.includes("herramientas") ||
    normalizedMessage.includes("tecnologia") ||
    normalizedMessage.includes("tecnologias") ||
    normalizedMessage.includes("stack")
  ) {
    return getToolsList();
  }

  const foundResponse =
  responses.find(item =>
    item.keywords.some(keyword =>
      matchesKeyword(
        message,
        keyword
      )
    )
  );

  if (foundResponse) {
    const randomIndex =
      Math.floor(
        Math.random() *
        foundResponse.answer.length
      );

    return {
      answer: foundResponse.answer[randomIndex],
      suggestions:
        foundResponse.suggestions ||
        getSmartSuggestions(message),
      action: foundResponse.action || null,
      direct: foundResponse.direct || false
    };
  }

  return {
    answer: getFallbackResponse(),
    suggestions: getSmartSuggestions(message)
  };
}

function getMemoryProjectResponse(message) {
  const project =
    resolveProjectReference(message);

  if (!project) {
    return null;
  }

  chatbotContext.lastProject =
  project;

chatbotContext.lastMentionedProject =
  project;

chatbotContext.lastSelectedProject =
  project;

const referenceProjects =
  Array.isArray(
    chatbotContext.lastProjectsShown
  )
    ? chatbotContext.lastProjectsShown
    : [];

chatbotContext.lastSelectedIndex =
  referenceProjects.findIndex(item =>
    item.id === project.id
  );

  return {
  answer:
    `Claro 🚀 Voy a abrir <strong>${project.titulo}</strong>.`,

  action: {
    type: "project",
    projectId: project.id
  },

  direct: true,

  suggestions: [
    "qué tecnologías usa",
    "tiene demo",
    "abre el código"
  ]
};


}