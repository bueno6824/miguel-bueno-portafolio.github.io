import { wait } from "./chatbotUtils.js";

/* ==============================
   MODULE STATE
============================== */

// Contenedor donde se muestran los mensajes del chatbot.
let chatbotMessages = null;

// Función que se ejecuta cuando el usuario selecciona una sugerencia.
let onSuggestionSelected = null;

// Función que se ejecuta cuando el usuario selecciona un proyecto.
let onProjectSelected = null;


/* ==============================
   INITIALIZATION
============================== */

// Inicializa las referencias necesarias para interactuar con la interfaz del chatbot.
export function initChatbotUI({ messagesContainer, suggestionHandler, projectHandler }) {
  // Guarda el contenedor de mensajes.
  chatbotMessages = messagesContainer;

  // Guarda el manejador de selección de sugerencias.
  onSuggestionSelected =
    suggestionHandler;

  // Guarda el manejador de selección de proyectos.
  onProjectSelected =
    projectHandler;
}


/* ==============================
   VALIDATION
============================== */

// Verifica que el contenedor de mensajes haya sido inicializado correctamente.
function validateMessagesContainer() {
  // Comprueba si existe el contenedor del chatbot.
  if (chatbotMessages) {
    return true;
  }

  // Muestra un error cuando el contenedor no está disponible.
  console.error(
    "Chatbot UI: messagesContainer no fue inicializado."
  );

  return false;
}


/* ==============================
   HTML ESCAPE
============================== */

// Escapa caracteres especiales para evitar interpretar texto del usuario como HTML.
export function escapeHTML(text = "") {
  return String(text).replace(
    /[&<>"']/g,
    character => {
      // Mapa de entidades HTML utilizadas para convertir caracteres especiales.
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      // Devuelve la entidad HTML correspondiente al carácter encontrado.
      return entities[character];
    }
  );
}


/* ==============================
   SCROLL
============================== */

// Desplaza el contenedor del chatbot hasta el último contenido disponible.
export function scrollToBottom() {
  chatbotMessages.scrollTop =
    chatbotMessages.scrollHeight;
}

/* ==============================
   USER MESSAGE
============================== */

// Agrega un mensaje enviado por el usuario al historial visual del chatbot.
export function addUserMessage(message) {
  // Inserta el mensaje dentro del contenedor de mensajes.
  chatbotMessages.innerHTML += `
    <div class="chatbot-message user">
      ${escapeHTML(message)}
    </div>
  `;

  // Mantiene visible el mensaje más reciente.
  scrollToBottom();
}

/* ==============================
   BOT MESSAGE
============================== */

// Agrega un mensaje del chatbot al historial visual.
export function addBotMessage(message) {
  // Inserta la respuesta del chatbot como un mensaje de tipo bot.
  chatbotMessages.innerHTML += `
    <div class="chatbot-message bot">
      ${message}
    </div>
  `;

  // Desplaza la vista hacia el último mensaje.
  scrollToBottom();
}

/* ==============================
   TYPING INDICATOR
============================== */

// Muestra temporalmente el indicador de que el chatbot está escribiendo.
export function addTypingMessage() {
  // Agrega el elemento visual utilizado como indicador.
  chatbotMessages.innerHTML += `
    <div
      class="chatbot-message bot typing"
      id="typingMessage"
    >
      Escribiendo...
    </div>
  `;

  // Mantiene visible el indicador.
  scrollToBottom();
}

// Escribe progresivamente un mensaje del chatbot respetando su estructura HTML.
export async function typeBotMessage(message, speed = 14) {
  // Evita continuar si la interfaz no ha sido inicializada.
  if (!chatbotMessages) return;

  // Crea el elemento que contendrá el mensaje progresivo.
  const messageElement =
    document.createElement("div");

  // Asigna la clase visual correspondiente al mensaje del bot.
  messageElement.className =
    "chatbot-message bot";

  // Agrega el mensaje al contenedor del chatbot.
  chatbotMessages.appendChild(
    messageElement
  );

  // Crea una plantilla para interpretar correctamente el HTML del mensaje.
  const template =
    document.createElement("template");

  // Carga el contenido del mensaje dentro de la plantilla.
  template.innerHTML =
    String(message).trim();

  // Escribe recursivamente cada nodo del mensaje.
  async function typeNode(
    sourceNode,
    targetNode
  ) {
    // Obtiene los nodos hijos del elemento actual.
    const childNodes =
      Array.from(
        sourceNode.childNodes
      );

    // Recorre cada nodo para reproducirlo progresivamente.
    for (const child of childNodes) {
      /* NODO DE TEXTO */

      // Comprueba si el nodo actual contiene texto.
      if (
        child.nodeType ===
        Node.TEXT_NODE
      ) {
        // Crea un nodo de texto vacío que recibirá los caracteres progresivamente.
        const textNode =
          document.createTextNode("");

        // Agrega el nodo de texto al elemento destino.
        targetNode.appendChild(
          textNode
        );

        // Convierte el contenido del nodo en una lista de caracteres.
        const characters =
          Array.from(
            child.textContent || ""
          );

        // Escribe cada carácter respetando la velocidad configurada.
        for (const character of characters) {
          // Agrega el carácter actual al texto visible.
          textNode.textContent +=
            character;

          // Mantiene visible la parte más reciente del mensaje.
          scrollToBottom();

          // Reduce el tiempo de espera cuando el carácter es un espacio.
          const characterDelay =
            character === " "
              ? Math.max(speed / 3, 2)
              : speed;

          // Espera antes de mostrar el siguiente carácter.
          await wait(
            characterDelay
          );
        }

        // Continúa con el siguiente nodo.
        continue;
      }

      /* ELEMENTO HTML */

      // Comprueba si el nodo actual es un elemento HTML.
      if (
        child.nodeType ===
        Node.ELEMENT_NODE
      ) {
        // Clona solamente la estructura del elemento sin sus hijos.
        const clonedElement =
          child.cloneNode(false);

        // Agrega el elemento clonado al destino.
        targetNode.appendChild(
          clonedElement
        );

        /*
         * Elementos que no necesitan
         * escritura interna.
         */

        // Lista de elementos que no requieren procesamiento de contenido interno.
        const selfClosingTags = [
          "BR",
          "HR",
          "IMG",
          "INPUT"
        ];

        // Comprueba si el elemento pertenece a la lista anterior.
        if (
          selfClosingTags.includes(
            child.tagName
          )
        ) {
          // Actualiza el desplazamiento después de agregar el elemento.
          scrollToBottom();
          continue;
        }

        // Procesa recursivamente los elementos HTML que contienen otros nodos.
        await typeNode(
          child,
          clonedElement
        );
      }
    }
  }

  // Inicia la escritura progresiva desde el contenido de la plantilla.
  await typeNode(
    template.content,
    messageElement
  );

  // Asegura que el mensaje completo permanezca visible.
  scrollToBottom();

  // Devuelve el elemento generado para permitir su uso posterior.
  return messageElement;
}

// Elimina el indicador de escritura del chatbot.
export function removeTypingMessage() {
  // Busca el elemento que representa el indicador.
  const typingMessage =
    document.getElementById("typingMessage");

  // Elimina el indicador si existe.
  if (typingMessage) {
    typingMessage.remove();
  }
}

/* ==============================
   SUGGESTIONS
============================== */

// Normaliza una sugerencia para convertir diferentes formatos en una estructura común.
function normalizeSuggestion(suggestion) {
  /*
   * Formato simple:
   * "proyectos"
   */

  // Comprueba si la sugerencia se recibió como texto.
  if (typeof suggestion === "string") {
    // Elimina espacios innecesarios del texto.
    const value = suggestion.trim();

    // Ignora sugerencias vacías.
    if (!value) {
      return null;
    }

    // Devuelve la estructura normalizada para una sugerencia de texto.
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

  // Comprueba si la sugerencia se recibió como objeto.
  if (
    suggestion &&
    typeof suggestion === "object"
  ) {
    // Busca el texto que se mostrará como etiqueta.
    const label =
      suggestion.label ??
      suggestion.text ??
      suggestion.title ??
      suggestion.name ??
      suggestion.message ??
      suggestion.value;

    // Busca el valor que se utilizará al seleccionar la sugerencia.
    const value =
      suggestion.message ??
      suggestion.value ??
      suggestion.query ??
      suggestion.text ??
      suggestion.label;

    // Verifica que tanto la etiqueta como el valor sean cadenas válidas.
    if (
      typeof label !== "string" ||
      typeof value !== "string"
    ) {
      // Informa sobre una sugerencia con formato incorrecto.
      console.warn(
        "Sugerencia inválida:",
        suggestion
      );

      return null;
    }

    // Devuelve la sugerencia con su formato normalizado.
    return {
      label: label.trim(),
      value: value.trim()
    };
  }

  // Informa cuando se recibe un formato de sugerencia desconocido.
  console.warn(
    "Formato de sugerencia no reconocido:",
    suggestion
  );

  return null;
}

// Agrega botones de sugerencias al chatbot.
export function addSuggestions(
  suggestions = []
) {
  // Comprueba que el contenedor de mensajes esté disponible.
  if (!validateMessagesContainer()) {
    return;
  }

  // Evita crear un contenedor cuando no existen sugerencias válidas.
  if (
    !Array.isArray(suggestions) ||
    !suggestions.length
  ) {
    return;
  }

  // Elimina las sugerencias anteriores antes de mostrar las nuevas.
  removeSuggestions();

  // Crea el contenedor visual de las sugerencias.
  const suggestionsContainer =
    document.createElement("div");

  // Asigna la clase correspondiente al contenedor.
  suggestionsContainer.className =
    "chatbot-suggestions";

  // Crea un botón para cada sugerencia.
  suggestions.forEach(suggestion => {
    // Crea el elemento botón.
    const button =
      document.createElement("button");

    // Define el tipo del botón para evitar comportamientos de formulario.
    button.type = "button";

    // Asigna la clase visual de las sugerencias.
    button.className =
      "chatbot-suggestion";

    // Determina si la sugerencia utiliza el formato de objeto.
    const isObjectSuggestion =
      suggestion &&
      typeof suggestion === "object";

    // Obtiene la etiqueta que se mostrará en el botón.
    const label =
      isObjectSuggestion
        ? suggestion.label
        : suggestion;

    // Define el texto visible del botón.
    button.textContent =
      label || "Opción";

    // Ejecuta la acción correspondiente cuando el usuario selecciona la sugerencia.
    button.addEventListener(
      "click",
      () => {
        // Elimina las sugerencias después de seleccionar una opción.
        suggestionsContainer.remove();

        // Comprueba si la sugerencia representa un proyecto.
        if (
          isObjectSuggestion &&
          suggestion.type === "project"
        ) {
          // Envía el identificador del proyecto al manejador correspondiente.
          onProjectSelected?.(
            suggestion.value
          );

          return;
        }

        // Comprueba si la sugerencia representa un enlace.
        if (
          isObjectSuggestion &&
          suggestion.type === "link"
        ) {
          // Abre el enlace en una nueva pestaña con protección contra acceso al opener.
          window.open(
            suggestion.value,
            "_blank",
            "noopener,noreferrer"
          );

          return;
        }

        // Obtiene el valor de la sugerencia según su formato.
        const value =
          isObjectSuggestion
            ? suggestion.value
            : suggestion;

        // Envía el valor al manejador de selección de sugerencias.
        onSuggestionSelected?.(
          value
        );
      }
    );

    // Agrega el botón al contenedor de sugerencias.
    suggestionsContainer.appendChild(
      button
    );
  });

  // Agrega las sugerencias al contenedor principal del chatbot.
  chatbotMessages.appendChild(
    suggestionsContainer
  );

  // Desplaza la vista hasta las nuevas sugerencias.
  scrollToBottom();
}

// Elimina todos los contenedores de sugerencias actualmente visibles.
export function removeSuggestions() {
  // Busca todos los elementos de sugerencias existentes.
  document
    .querySelectorAll(
      ".chatbot-suggestions"
    )
    .forEach(container => {
      // Elimina cada contenedor encontrado.
      container.remove();
    });
}

// Genera y muestra tarjetas visuales para los proyectos.
export function addProjectCards(projects) {
  // Evita crear tarjetas cuando no existen proyectos.
  if (!projects?.length) return;

  // Crea el contenedor que almacenará las tarjetas.
  const cardsContainer =
    document.createElement("div");

  // Asigna la clase visual para las tarjetas de proyectos.
  cardsContainer.className =
    "chatbot-projects";

  // Genera una tarjeta por cada proyecto recibido.
  projects.forEach(project => {
    // Crea el elemento que representa la tarjeta.
    const card =
      document.createElement("article");

    // Asigna la clase visual de la tarjeta.
    card.className =
      "chatbot-project-card";

    // Obtiene hasta cuatro tecnologías principales del proyecto.
    const stack =
      (project.stack || [])
        .slice(0, 4)
        .map(technology => `
          <span>
            ${escapeHTML(technology)}
          </span>
        `)
        .join("");

    // Genera la sección de imagen cuando el proyecto tiene una portada.
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

    // Construye el contenido HTML completo de la tarjeta.
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

    // Busca el botón utilizado para abrir el proyecto.
    const openButton =
      card.querySelector(
        ".chatbot-project-open"
      );

    // Configura el evento de selección del proyecto.
    openButton.addEventListener(
      "click",
      () => {
        // Envía el identificador del proyecto al manejador correspondiente.
        onProjectSelected?.(
          project.id
        );
      }
    );

    // Agrega la tarjeta al contenedor de proyectos.
    cardsContainer.appendChild(card);
  });

  // Agrega todas las tarjetas al contenedor de mensajes.
  chatbotMessages.appendChild(
    cardsContainer
  );

  // Desplaza la vista hasta las tarjetas recién agregadas.
  scrollToBottom();
}