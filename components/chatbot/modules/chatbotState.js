/* ==============================
   CHATBOT CONTEXT
============================== */

export const chatbotContext = {
  lastTopic: null,
  lastProjects: [],
  lastProject: null
};


/* ==============================
   CONTEXT HELPERS
============================== */

export function resetChatbotContext() {
  chatbotContext.lastTopic = null;
  chatbotContext.lastProjects = [];
  chatbotContext.lastProject = null;
}