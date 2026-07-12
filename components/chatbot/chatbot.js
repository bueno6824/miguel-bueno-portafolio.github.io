import {
  resetChatbotContext,
  chatbotContext
} from "./modules/chatbotState.js";

import {
  isAffirmative,
  wait
} from "./modules/chatbotUtils.js";

import {
  getRandomWelcomeMessage
} from "./data/chatbotResponses.js";

import {
  initChatbotUI,
  addUserMessage,
  addProjectCards,
  addTypingMessage,
  removeTypingMessage,
  typeBotMessage,
  addSuggestions
} from "./modules/chatbotUI.js";

import {
  initChatbotProjects,
  processProjectSelection
} from "./modules/chatbotProjects.js";

import {
  executeAction
} from "./modules/chatbotActions.js";

import {
  getBotResponse
} from "./modules/chatbotEngine.js";

/* ==============================
   DOM ELEMENTS
============================== */

const chatbotToggle =
  document.getElementById("chatbotToggle");

const chatbotWindow =
  document.getElementById("chatbotWindow");

const chatbotClose =
  document.getElementById("chatbotClose");

const chatbotMessages =
  document.getElementById(
    "chatbotMessages"
  );

const chatbotForm =
  document.getElementById("chatbotForm");

const chatbotInput =
  document.getElementById("chatbotInput");

const quickActions =
  document.querySelectorAll(
    ".chatbot-quick-actions button"
  );

/* ==============================
   STATE
============================== */

let chatbotStarted = false;
let pendingAction = null;
let isProcessingMessage = false;

/* ==============================
   CHAT CONTROLLER 
============================== */

async function toggleChatbot() {
  if (!chatbotWindow) return;

  chatbotWindow.classList.toggle("hidden");

  const isOpen =
    !chatbotWindow.classList.contains("hidden");

  if (!isOpen || chatbotStarted) return;

  chatbotStarted = true;

  chatbotInput.disabled = true;

  try {
    await typeBotMessage(
      getRandomWelcomeMessage(),
      14
    );

    addSuggestions([
      "proyectos",
      "herramientas",
      "contacto"
    ]);
  } finally {
    chatbotInput.disabled = false;
    chatbotInput.focus();
  }
}

function closeChatbot() {
  if (!chatbotWindow) return;

  chatbotWindow.classList.add(
    "hidden"
  );

  chatbotMessages.innerHTML = "";
  chatbotInput.value = "";

  chatbotStarted = false;
  pendingAction = null;
  isProcessingMessage = false;

  chatbotInput.disabled = false;

  resetChatbotContext();
}

/* ==============================
   MESSAGE PROCESSING
============================== */

async function processMessage(message) {
  if (
    !message ||
    isProcessingMessage
  ) {
    return;
  }

  const cleanMessage =
    String(message).trim();

  if (!cleanMessage) return;

  let shouldRefocusInput = true;

  isProcessingMessage = true;
  chatbotInput.disabled = true;

  try {
    addUserMessage(cleanMessage);

    /* ==============================
       CONFIRMACIÓN DE ACCIÓN
    ============================== */

    if (
      pendingAction &&
      isAffirmative(cleanMessage)
    ) {
      const action =
        pendingAction;

      pendingAction = null;

      addTypingMessage();

      await wait(500);

      removeTypingMessage();

      await typeBotMessage(
        "Perfecto 🚀 Te llevo ahí."
      );

      if (
        action.type === "section"
      ) {
        shouldRefocusInput = false;
        chatbotInput.blur();
      }

      await executeAction(action);

      return;
    }

    pendingAction = null;

    addTypingMessage();

    await wait(700);

    removeTypingMessage();

    const response =
      getBotResponse(cleanMessage);

    if (!response) return;

    await typeBotMessage(
      response.answer
    );

    /* ==============================
       TARJETAS
    ============================== */

    if (
      Array.isArray(response.projects) &&
      response.projects.length
    ) {
      chatbotContext.lastProjectsShown =
        response.projects;

      addProjectCards(
        response.projects
      );
    }

    /* ==============================
       SUGERENCIAS
    ============================== */

    if (
      Array.isArray(response.suggestions) &&
      response.suggestions.length
    ) {
      addSuggestions(
        response.suggestions
      );
    }

    /* ==============================
       ACCIONES
    ============================== */

    if (
      response.action &&
      response.direct
    ) {
      await wait(350);

      if (
        response.action.type ===
        "section"
      ) {
        shouldRefocusInput = false;
        chatbotInput.blur();
      }

      await executeAction(
        response.action
      );
    } else if (response.action) {
      pendingAction =
        response.action;
    }
  } catch (error) {
    console.error(
      "Error procesando mensaje:",
      error
    );

    removeTypingMessage();

    await typeBotMessage(
      "Ocurrió un problema al procesar el mensaje 😅. Inténtalo nuevamente."
    );
  } finally {
    removeTypingMessage();

    isProcessingMessage = false;
    chatbotInput.disabled = false;

    if (shouldRefocusInput) {
      chatbotInput.focus();
    }
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const message =
    chatbotInput.value.trim();

  if (!message) return;

  chatbotInput.value = "";

  processMessage(message);
}

async function handleQuickAction(event) {
  const question =
    event.target.dataset.question;

  if (!question) return;

  processMessage(question);
}

/* ==============================
   EVENTS
============================== */

async function handleModalClose() {
  if (!chatbotStarted) return;

  await typeBotMessage(
    "✅ Proyecto cerrado. ¿Quieres explorar otro proyecto o revisar las herramientas utilizadas?"
  );

  addSuggestions([
    "proyectos",
    "herramientas",
    "contacto"
  ]);
}

/* ==============================
   INIT
============================== */

export function initChatbot() {
  if (
    !chatbotToggle ||
    !chatbotWindow ||
    !chatbotMessages ||
    !chatbotInput
  ) {
    console.warn(
      "No se pudo inicializar el chatbot: faltan elementos del DOM."
    );

    return;
  }

  initChatbotUI({
    messagesContainer:
      chatbotMessages,

    suggestionHandler:
      suggestion => {
        processMessage(suggestion);
      },

    projectHandler:
      projectId => {
        processProjectSelection(
          projectId
        );
      }
  });

  initChatbotProjects({
    ui: {
      botMessage:
        typeBotMessage,

      userMessage:
        addUserMessage,

      typingStart:
        addTypingMessage,

      typingEnd:
        removeTypingMessage,

      suggestions:
        addSuggestions,

      projectCards:
        addProjectCards
    }
  });
  
  

  chatbotToggle.addEventListener(
    "click",
    toggleChatbot
  );

  window.addEventListener(
    "projectModalClosed",
    handleModalClose
  );

  chatbotClose?.addEventListener(
    "click",
    closeChatbot
  );

  chatbotForm?.addEventListener(
    "submit",
    handleSubmit
  );

  quickActions.forEach(button => {
    button.addEventListener(
      "click",
      handleQuickAction
    );
  });
}