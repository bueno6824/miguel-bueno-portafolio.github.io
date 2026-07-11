import { wait } from "./chatbotUtils.js";

/* ==============================
   MODULE STATE
============================== */

let chatbotMessages = null;
let onSuggestionSelected = null;
let onProjectSelected = null;


/* ==============================
   INITIALIZATION
============================== */

export function initChatbotUI({ messagesContainer,suggestionHandler, projectHandler}) {
  chatbotMessages = messagesContainer;

  onSuggestionSelected =
    suggestionHandler;

  onProjectSelected =
    projectHandler;
}


/* ==============================
   VALIDATION
============================== */

function validateMessagesContainer() {
  if (chatbotMessages) {
    return true;
  }

  console.error(
    "Chatbot UI: messagesContainer no fue inicializado."
  );

  return false;
}


/* ==============================
   HTML ESCAPE
============================== */

export function escapeHTML(text = "") {
  return String(text).replace(
    /[&<>"']/g,
    character => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    }
  );
}


/* ==============================
   SCROLL
============================== */

export function scrollToBottom() {
  chatbotMessages.scrollTop =
    chatbotMessages.scrollHeight;
}

/* ==============================
   USER MESSAGE
============================== */

export function addUserMessage(message) {
  chatbotMessages.innerHTML += `
    <div class="chatbot-message user">
      ${escapeHTML(message)}
    </div>
  `;

  scrollToBottom();
}

/* ==============================
   BOT MESSAGE
============================== */

export function addBotMessage(message) {
  chatbotMessages.innerHTML += `
    <div class="chatbot-message bot">
      ${message}
    </div>
  `;

  scrollToBottom();
}

/* ==============================
   TYPING INDICATOR
============================== */

export function addTypingMessage() {
  chatbotMessages.innerHTML += `
    <div
      class="chatbot-message bot typing"
      id="typingMessage"
    >
      Escribiendo...
    </div>
  `;

  scrollToBottom();
}

export async function typeBotMessage(message, speed = 14) {
  if (!chatbotMessages) return;

  const messageElement =
    document.createElement("div");

  messageElement.className =
    "chatbot-message bot";

  chatbotMessages.appendChild(
    messageElement
  );

  const template =
    document.createElement("template");

  template.innerHTML =
    String(message).trim();

  async function typeNode(
    sourceNode,
    targetNode
  ) {
    const childNodes =
      Array.from(
        sourceNode.childNodes
      );

    for (const child of childNodes) {
      /* NODO DE TEXTO */
      if (
        child.nodeType ===
        Node.TEXT_NODE
      ) {
        const textNode =
          document.createTextNode("");

        targetNode.appendChild(
          textNode
        );

        const characters =
          Array.from(
            child.textContent || ""
          );

        for (const character of characters) {
          textNode.textContent +=
            character;

          scrollToBottom();

          const characterDelay =
            character === " "
              ? Math.max(speed / 3, 2)
              : speed;

          await wait(
            characterDelay
          );
        }

        continue;
      }

      /* ELEMENTO HTML */
      if (
        child.nodeType ===
        Node.ELEMENT_NODE
      ) {
        const clonedElement =
          child.cloneNode(false);

        targetNode.appendChild(
          clonedElement
        );

        /*
         * Elementos que no necesitan
         * escritura interna.
         */
        const selfClosingTags = [
          "BR",
          "HR",
          "IMG",
          "INPUT"
        ];

        if (
          selfClosingTags.includes(
            child.tagName
          )
        ) {
          scrollToBottom();
          continue;
        }

        await typeNode(
          child,
          clonedElement
        );
      }
    }
  }

  await typeNode(
    template.content,
    messageElement
  );

  scrollToBottom();

  return messageElement;
}

export function removeTypingMessage() {
  const typingMessage =
    document.getElementById("typingMessage");

  if (typingMessage) {
    typingMessage.remove();
  }
}

/* ==============================
   SUGGESTIONS
============================== */

function normalizeSuggestion(suggestion) {
  /*
   * Formato simple:
   * "proyectos"
   */

  if (typeof suggestion === "string") {
    const value = suggestion.trim();

    if (!value) {
      return null;
    }

    return {
      label: value,
      value
    };
  }

  /*
   * Formato objeto:
   * {
   *   label: "Ver proyectos",
   *   message: "proyectos"
   * }
   */

  if (
    suggestion &&
    typeof suggestion === "object"
  ) {
    const label =
      suggestion.label ??
      suggestion.text ??
      suggestion.title ??
      suggestion.name ??
      suggestion.message ??
      suggestion.value;

    const value =
      suggestion.message ??
      suggestion.value ??
      suggestion.query ??
      suggestion.text ??
      suggestion.label;

    if (
      typeof label !== "string" ||
      typeof value !== "string"
    ) {
      console.warn(
        "Sugerencia inválida:",
        suggestion
      );

      return null;
    }

    return {
      label: label.trim(),
      value: value.trim()
    };
  }

  console.warn(
    "Formato de sugerencia no reconocido:",
    suggestion
  );

  return null;
}

export function addSuggestions(suggestions = []) {
  if (!validateMessagesContainer()) {
    return;
  }

  if (!Array.isArray(suggestions) || !suggestions.length) {
    return;
  }

  removeSuggestions();

  const suggestionsContainer =
    document.createElement("div");

  suggestionsContainer.className =
    "chatbot-suggestions";

  suggestions.forEach(suggestion => {
    const normalizedSuggestion =
      normalizeSuggestion(suggestion);

    if (!normalizedSuggestion) {
      return;
    }

    const button =
      document.createElement("button");

    button.type = "button";
    button.className =
      "chatbot-suggestion";

    button.textContent =
      normalizedSuggestion.label;

    button.addEventListener(
      "click",
      () => {
        suggestionsContainer.remove();

        onSuggestionSelected?.(
          normalizedSuggestion.value
        );
      }
    );

    suggestionsContainer.appendChild(
      button
    );
  });

  if (!suggestionsContainer.children.length) {
    return;
  }

  chatbotMessages.appendChild(
    suggestionsContainer
  );

  scrollToBottom();
}

export function removeSuggestions() {
  document
    .querySelectorAll(
      ".chatbot-suggestions"
    )
    .forEach(container => {
      container.remove();
    });
}

export function addProjectCards(projects) {
  if (!projects?.length) return;

  const cardsContainer =
    document.createElement("div");

  cardsContainer.className =
    "chatbot-projects";

  projects.forEach(project => {
    const card =
      document.createElement("article");

    card.className =
      "chatbot-project-card";

    const stack =
      (project.stack || [])
        .slice(0, 4)
        .map(technology => `
          <span>
            ${escapeHTML(technology)}
          </span>
        `)
        .join("");

    const image =
      project.imagenPortada
        ? `
          <div class="chatbot-project-image">
            <img
              src="${project.imagenPortada}"
              alt="${escapeHTML(project.titulo)}"
              loading="lazy"
            >
          </div>
        `
        : "";

    card.innerHTML = `
      ${image}

      <div class="chatbot-project-content">

        <div class="chatbot-project-meta">
          <span>
            ${escapeHTML(
              project.categoria ||
              "Proyecto"
            )}
          </span>

          <span>
            ${escapeHTML(
              String(
                project.año ||
                "Sin fecha"
              )
            )}
          </span>
        </div>

        <h4>
          ${escapeHTML(project.titulo)}
        </h4>

        <p>
          ${escapeHTML(
            project.descripcionCorta ||
            project.descripcionLarga ||
            "Proyecto desarrollado por Miguel."
          )}
        </p>

        <div class="chatbot-project-stack">
          ${stack}
        </div>

        <button
          type="button"
          class="chatbot-project-open"
          data-project-id="${project.id}"
        >
          Ver proyecto 🚀
        </button>

      </div>
    `;

    const openButton =
      card.querySelector(
        ".chatbot-project-open"
      );

    openButton.addEventListener(
  "click",
  () => {
    onProjectSelected?.(
      project.id
    );
  }
);

    cardsContainer.appendChild(card);
  });

  chatbotMessages.appendChild(
    cardsContainer
  );

  scrollToBottom();
}