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

/* Referencia a la ventana principal del chatbot. */
const chatbotWindow =
  document.getElementById("chatbotWindow");

/* Referencia al botón utilizado para cerrar el chatbot. */
const chatbotClose =
  document.getElementById("chatbotClose");

/* Contenedor donde se muestran los mensajes de la conversación. */
const chatbotMessages =
  document.getElementById(
    "chatbotMessages"
  );

/* Referencia al formulario utilizado para enviar mensajes. */
const chatbotForm =
  document.getElementById("chatbotForm");

/* Campo de entrada donde el usuario escribe sus mensajes. */
const chatbotInput =
  document.getElementById("chatbotInput");

/* Botones de acciones rápidas disponibles dentro del chatbot. */
const quickActions =
  document.querySelectorAll(
    ".chatbot-quick-actions button"
  );

/* ==============================
   STATE
============================== */

/* Indica si el chatbot ya mostró su mensaje inicial. */
let chatbotStarted = false;

/* Guarda una acción pendiente que requiere confirmación del usuario. */
let pendingAction = null;

/* Evita procesar varios mensajes simultáneamente. */
let isProcessingMessage = false;

/* ==============================
   CHAT CONTROLLER 
============================== */

/* Abre o cierra la ventana del chatbot y muestra el mensaje inicial. */
async function toggleChatbot() {
  /* Verifica que la ventana del chatbot exista en el DOM. */
  if (!chatbotWindow) return;

  /* Alterna la visibilidad de la ventana. */
  chatbotWindow.classList.toggle("hidden");

  /* Comprueba si la ventana quedó abierta. */
  const isOpen =
    !chatbotWindow.classList.contains("hidden");

  /* No continúa si la ventana está cerrada o ya fue iniciada. */
  if (!isOpen || chatbotStarted) return;

  /* Marca el chatbot como iniciado. */
  chatbotStarted = true;

  /* Desactiva temporalmente el campo de entrada mientras carga el saludo. */
  chatbotInput.disabled = true;

  try {
    /* Muestra el mensaje inicial del chatbot con efecto de escritura. */
    await typeBotMessage(
      getRandomWelcomeMessage(),
      14
    );

    /* Muestra las primeras sugerencias para orientar al usuario. */
    addSuggestions([
      "Soy reclutador",
      "proyectos",
      "contacto"
    ]);
  } finally {
    /* Reactiva el campo de entrada después del mensaje inicial. */
    chatbotInput.disabled = false;

    /* Coloca el cursor nuevamente en el campo de entrada. */
    chatbotInput.focus();
  }
}

/* Cierra y reinicia el estado interno del chatbot. */
function closeChatbot() {
  /* Verifica que la ventana del chatbot exista. */
  if (!chatbotWindow) return;

  /* Oculta la ventana del chatbot. */
  chatbotWindow.classList.add(
    "hidden"
  );

  /* Elimina todos los mensajes visibles de la conversación. */
  chatbotMessages.innerHTML = "";

  /* Limpia el contenido del campo de entrada. */
  chatbotInput.value = "";

  /* Restablece el estado de inicio del chatbot. */
  chatbotStarted = false;

  /* Elimina cualquier acción pendiente. */
  pendingAction = null;

  /* Permite volver a procesar mensajes. */
  isProcessingMessage = false;

  /* Mantiene habilitado el campo de entrada. */
  chatbotInput.disabled = false;

  /* Restablece el contexto almacenado de la conversación. */
  resetChatbotContext();
}

/* ==============================
   MESSAGE PROCESSING
============================== */

/* Procesa un mensaje enviado por el usuario. */
async function processMessage(message) {
  /* Evita procesar mensajes vacíos o varios mensajes al mismo tiempo. */
  if (
    !message ||
    isProcessingMessage
  ) {
    return;
  }

  /* Convierte el mensaje a texto y elimina espacios externos. */
  const cleanMessage =
    String(message).trim();

  /* Ignora el mensaje si después de limpiarlo quedó vacío. */
  if (!cleanMessage) return;

  /* Controla si el campo de entrada debe recuperar el foco al finalizar. */
  let shouldRefocusInput = true;

  /* Marca que actualmente se está procesando un mensaje. */
  isProcessingMessage = true;

  /* Desactiva el campo mientras se procesa la respuesta. */
  chatbotInput.disabled = true;

  try {
    /* Agrega el mensaje del usuario a la conversación. */
    addUserMessage(cleanMessage);

    /* ==============================
       CONFIRMACIÓN DE ACCIÓN
    ============================== */

    /* Comprueba si existe una acción pendiente y el usuario respondió afirmativamente. */
    if (
      pendingAction &&
      isAffirmative(cleanMessage)
    ) {
      /* Guarda temporalmente la acción pendiente. */
      const action =
        pendingAction;

      /* Elimina la acción pendiente antes de ejecutarla. */
      pendingAction = null;

      /* Muestra el indicador de escritura. */
      addTypingMessage();

      /* Espera brevemente antes de responder. */
      await wait(500);

      /* Elimina el indicador de escritura. */
      removeTypingMessage();

      /* Confirma al usuario que se ejecutará la acción. */
      await typeBotMessage(
        "Perfecto 🚀 Te llevo ahí."
      );

      /* Si la acción navega a una sección, evita devolver el foco al input. */
      if (
        action.type === "section"
      ) {
        shouldRefocusInput = false;
        chatbotInput.blur();
      }

      /* Ejecuta la acción confirmada. */
      await executeAction(action);

      return;
    }

    /* Cancela cualquier acción pendiente si el mensaje no fue una confirmación. */
    pendingAction = null;

    /* Muestra el indicador de escritura mientras se genera la respuesta. */
    addTypingMessage();

    /* Simula un pequeño tiempo de procesamiento antes de responder. */
    await wait(700);

    /* Elimina el indicador de escritura. */
    removeTypingMessage();

    /* Obtiene la respuesta correspondiente al mensaje del usuario. */
    const response =
      getBotResponse(cleanMessage);

    /* Detiene el procesamiento si no existe una respuesta. */
    if (!response) return;

    /* Muestra la respuesta del chatbot con efecto de escritura. */
    await typeBotMessage(
      response.answer
    );

    /* ==============================
       TARJETAS
    ============================== */

    /* Comprueba si la respuesta contiene proyectos para mostrar. */
    if (
      Array.isArray(response.projects) &&
      response.projects.length
    ) {
      /* Guarda los últimos proyectos mostrados en el contexto. */
      chatbotContext.lastProjectsShown =
        response.projects;

      /* Genera las tarjetas visuales de los proyectos. */
      addProjectCards(
        response.projects
      );
    }

    /* ==============================
       SUGERENCIAS
    ============================== */

    /* Comprueba si la respuesta contiene sugerencias para mostrar. */
    if (
      Array.isArray(response.suggestions) &&
      response.suggestions.length
    ) {
      /* Muestra las sugerencias debajo de la respuesta. */
      addSuggestions(
        response.suggestions
      );
    }

    /* ==============================
       ACCIONES
    ============================== */

    /* Comprueba si existe una acción que debe ejecutarse directamente. */
    if (
      response.action &&
      response.direct
    ) {
      /* Espera brevemente antes de ejecutar la acción. */
      await wait(350);

      /* Si la acción navega a una sección, evita devolver el foco al input. */
      if (
        response.action.type ===
        "section"
      ) {
        shouldRefocusInput = false;
        chatbotInput.blur();
      }

      /* Ejecuta directamente la acción indicada por la respuesta. */
      await executeAction(
        response.action
      );
    } else if (response.action) {
      /* Guarda la acción para solicitar confirmación posteriormente. */
      pendingAction =
        response.action;
    }
  } catch (error) {
    /* Registra en consola cualquier error durante el procesamiento. */
    console.error(
      "Error procesando mensaje:",
      error
    );

    /* Elimina cualquier indicador de escritura activo. */
    removeTypingMessage();

    /* Muestra un mensaje de error al usuario. */
    await typeBotMessage(
      "Ocurrió un problema al procesar el mensaje 😅. Inténtalo nuevamente."
    );
  } finally {
    /* Garantiza que el indicador de escritura sea eliminado. */
    removeTypingMessage();

    /* Permite procesar nuevos mensajes. */
    isProcessingMessage = false;

    /* Reactiva el campo de entrada. */
    chatbotInput.disabled = false;

    /* Devuelve el foco al campo cuando corresponde. */
    if (shouldRefocusInput) {
      chatbotInput.focus();
    }
  }
}

/* Procesa el envío del formulario del chatbot. */
async function handleSubmit(event) {
  /* Evita que el formulario recargue la página. */
  event.preventDefault();

  /* Obtiene el mensaje escrito y elimina espacios externos. */
  const message =
    chatbotInput.value.trim();

  /* Ignora el envío si el campo está vacío. */
  if (!message) return;

  /* Limpia el campo después de obtener el mensaje. */
  chatbotInput.value = "";

  /* Procesa el mensaje enviado. */
  processMessage(message);
}

/* Procesa una acción rápida seleccionada por el usuario. */
async function handleQuickAction(event) {
  /* Obtiene la pregunta asociada al botón mediante data-question. */
  const question =
    event.target.dataset.question;

  /* Ignora el evento si el botón no tiene una pregunta definida. */
  if (!question) return;

  /* Procesa la pregunta como si hubiera sido escrita por el usuario. */
  processMessage(question);
}

/* ==============================
   EVENTS
============================== */

/* Maneja el evento generado cuando se cierra el modal de un proyecto. */
async function handleModalClose() {
  /* No muestra el mensaje si el chatbot no estaba iniciado. */
  if (!chatbotStarted) return;

  /* Informa al usuario que el proyecto fue cerrado. */
  await typeBotMessage(
    "✅ Proyecto cerrado. ¿Quieres explorar otro proyecto o revisar las herramientas utilizadas?"
  );

  /* Muestra nuevas opciones relacionadas con proyectos y herramientas. */
  addSuggestions([
    "proyectos",
    "herramientas",
    "contacto"
  ]);
}

/* ==============================
   INIT
============================== */

/* Inicializa todos los componentes y eventos principales del chatbot. */
export function initChatbot({
  openOnInit = false
} = {}) {
  /* Comprueba que los elementos esenciales del chatbot existan. */
  if (
    !chatbotToggle ||
    !chatbotWindow ||
    !chatbotMessages ||
    !chatbotInput
  ) {
    /* Informa en consola si falta algún elemento necesario. */
    console.warn(
      "No se pudo inicializar el chatbot: faltan elementos del DOM."
    );

    return;
  }

  /* Inicializa la interfaz visual del chatbot. */
  initChatbotUI({
    messagesContainer:
      chatbotMessages,

    /* Conecta las sugerencias de la interfaz con el procesamiento de mensajes. */
    suggestionHandler:
      suggestion => {
        processMessage(suggestion);
      },

    /* Conecta la selección de proyectos con el módulo de proyectos. */
    projectHandler:
      projectId => {
        processProjectSelection(
          projectId
        );
      }
  });

  /* Inicializa el módulo encargado de gestionar los proyectos del chatbot. */
  initChatbotProjects({
    ui: {
      /* Función utilizada para mostrar mensajes del bot. */
      botMessage:
        typeBotMessage,

      /* Función utilizada para mostrar mensajes del usuario. */
      userMessage:
        addUserMessage,

      /* Función utilizada para iniciar el indicador de escritura. */
      typingStart:
        addTypingMessage,

      /* Función utilizada para finalizar el indicador de escritura. */
      typingEnd:
        removeTypingMessage,

      /* Función utilizada para mostrar sugerencias. */
      suggestions:
        addSuggestions,

      /* Función utilizada para mostrar tarjetas de proyectos. */
      projectCards:
        addProjectCards
    }
  });



  /* Evento para abrir o cerrar el chatbot mediante el botón principal. */
  chatbotToggle.addEventListener(
    "click",
    toggleChatbot
  );

  /* Evento que detecta cuando se cierra el modal de un proyecto. */
  window.addEventListener(
    "projectModalClosed",
    handleModalClose
  );

  /* Evento opcional para cerrar el chatbot. */
  chatbotClose?.addEventListener(
    "click",
    closeChatbot
  );

  /* Evento opcional para procesar el formulario de mensajes. */
  chatbotForm?.addEventListener(
    "submit",
    handleSubmit
  );

  /* Agrega el evento de clic a cada botón de acción rápida. */
  quickActions.forEach(button => {
    button.addEventListener(
      "click",
      handleQuickAction
    );
  });

  /* Abre automáticamente el chatbot cuando la opción está habilitada. */
  if (openOnInit) {
    toggleChatbot();
  }
}