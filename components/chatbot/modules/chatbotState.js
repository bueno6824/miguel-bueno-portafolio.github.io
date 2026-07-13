/* ==============================
   CHATBOT CONTEXT
============================== */

export const chatbotContext = {
  lastTopic: null,

  lastProjects: [],
  lastProject: null,

  lastMentionedProject: null,
  lastRecommendedProject: null,
  lastOpenedProject: null,

  lastTechnology: null,
  lastCategory: null,

  comparisonProjects: [],
  comparisonWinner: null,
  
  lastProjectsShown: [],
  lastSelectedProject: null,
  lastSelectedIndex: -1,
  
  guideMode: {
  active: false,
  audience: null,
  profile: null,
  currentStep: 0,
  recommendedProjects: [],
  completedSteps: []
}
};

recommendationContext: null

/* ==============================
   CONTEXT HELPERS
============================== */

export function resetChatbotContext() {
  chatbotContext.lastTopic = null;

  chatbotContext.lastProjects = [];
  chatbotContext.lastProject = null;

  chatbotContext.lastMentionedProject = null;
  chatbotContext.lastRecommendedProject = null;
  chatbotContext.lastOpenedProject = null;

  chatbotContext.lastTechnology = null;
  chatbotContext.lastCategory = null;

  chatbotContext.comparisonProjects = [];
  chatbotContext.comparisonWinner = null;
  
  chatbotContext.lastProjectsShown = [];
chatbotContext.lastSelectedProject = null;
chatbotContext.lastSelectedIndex = -1;

chatbotContext.guideMode = {
  active: false,
  audience: null,
  profile: null,
  currentStep: 0,
  recommendedProjects: [],
  completedSteps: []
};

chatbotContext.recommendationContext =
  null;

}

