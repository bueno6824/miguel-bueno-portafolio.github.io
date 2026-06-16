import { getProjectsData } from "../modals/modal.js";

const chatbotToggle =
  document.getElementById("chatbotToggle");

const chatbotWindow =
  document.getElementById("chatbotWindow");

const chatbotClose =
  document.getElementById("chatbotClose");

const chatbotMessages =
  document.getElementById("chatbotMessages");

const chatbotForm =
  document.getElementById("chatbotForm");

const chatbotInput =
  document.getElementById("chatbotInput");

const quickActions =
  document.querySelectorAll(
    ".chatbot-quick-actions button"
  );

let chatbotStarted = false;

const responses = [
  {
    intent: "saludo",
    keywords: [
      "hola",
      "hey",
      "buenas",
      "que onda",
      "qué onda",
      "buen dia",
      "buen día",
      "buenas tardes",
      "buenas noches",
      "saludos",
      "hello",
      "hi"
    ],
    answer: [
      "¡Hola! 👋 Soy el asistente de Miguel ⚡ Puedo contarte sobre sus proyectos, habilidades, ubicación o formas de contacto. ¿Qué quieres revisar primero?",
      "¡Qué onda! 🚀 Estoy aquí para ayudarte a explorar el portafolio de Miguel. ¿Quieres ver proyectos, tecnologías o contacto?",
      "¡Hey! 😄 Puedes preguntarme por proyectos, tecnologías, Arduino, ubicación o contacto."
    ],
    suggestions: [
      "proyectos",
      "habilidades",
      "contacto"
    ]
  },
  {
    intent: "proyectos",
    keywords: [
      "proyecto",
      "proyectos",
      "trabajos",
      "portfolio",
      "portafolio",
      "web",
      "sitios",
      "paginas",
      "páginas",
      "aplicaciones",
      "apps",
      "demo",
      "repositorio",
      "github",
      "codigo",
      "código"
    ],
    answer: [
      "Miguel tiene proyectos enfocados en desarrollo web, frontend, diseño responsive, JavaScript, arquitectura modular e IoT con Arduino 🚀. ¿Quieres saber qué tecnologías usa?",
      "Sus proyectos combinan interfaces modernas, estructura modular, rendimiento y diseño tipo SaaS. ¿Quieres ir a la sección de proyectos?",
      "Puedes revisar la sección Projects para ver demos, código y tecnologías usadas. ¿Quieres que te hable de su stack?"
    ],
    suggestions: [
      "habilidades",
      "github",
      "contacto"
    ]
  },
  {
    intent: "habilidades",
    keywords: [
      "habilidades",
      "skills",
      "tecnologias",
      "tecnologías",
      "stack",
      "herramientas",
      "lenguajes",
      "programacion",
      "programación",
      "frontend",
      "backend",
      "full stack",
      "html",
      "css",
      "javascript",
      "bootstrap",
      "git",
      "github",
      "mysql",
      "node",
      "express"
    ],
    answer: [
      "Su stack principal incluye HTML, CSS, JavaScript, Bootstrap, Git, GitHub, Arduino y bases de desarrollo full stack. ¿Quieres conocer sus proyectos?",
      "Miguel trabaja principalmente con frontend moderno, diseño responsive, componentes reutilizables y arquitectura modular. ¿Quieres ver su GitHub?",
      "También está avanzando hacia full stack con Node.js, Express y MySQL. ¿Quieres saber más sobre sus herramientas?"
    ],
    suggestions: [
      "proyectos",
      "arduino",
      "github"
    ]
  },
  {
    intent: "iot",
    keywords: [
      "arduino",
      "iot",
      "hardware",
      "sensores",
      "electronica",
      "electrónica",
      "automatizacion",
      "automatización",
      "esp32",
      "temperatura",
      "humedad",
      "circuitos"
    ],
    answer: [
      "También trabaja con proyectos IoT usando Arduino, sensores, automatización y lógica aplicada a hardware 🔌. ¿Quieres ver proyectos relacionados?",
      "En la parte IoT, Miguel explora Arduino, sensores, electrónica básica y automatización. ¿Quieres conocer su stack?",
      "Sus proyectos con Arduino conectan programación con hardware real, ideal para soluciones prácticas. ¿Quieres contactarlo?"
    ],
    suggestions: [
      "proyectos",
      "habilidades",
      "contacto"
    ]
  },
  {
    intent: "ubicacion",
    keywords: [
      "ubicacion",
      "ubicación",
      "donde esta",
      "dónde está",
      "de donde es",
      "de dónde es",
      "ciudad",
      "pais",
      "país",
      "mexico",
      "méxico",
      "leon",
      "león",
      "guanajuato",
      "remoto",
      "presencial"
    ],
    answer: [
      "Miguel está ubicado en León, Guanajuato, México 📍 y está abierto a colaboración remota. ¿Quieres contactarlo?",
      "Actualmente trabaja desde León, Guanajuato, con disponibilidad para proyectos frontend, full stack junior y freelance.",
      "Está en México y puede colaborar en proyectos remotos o freelance. ¿Quieres revisar sus proyectos primero?"
    ],
    suggestions: [
      "contacto",
      "proyectos",
      "habilidades"
    ]
  },
  {
    intent: "contacto",
    keywords: [
      "contacto",
      "contactar",
      "correo",
      "email",
      "mail",
      "mensaje",
      "contratar",
      "contratacion",
      "contratación",
      "trabajo",
      "empleo",
      "colaborar",
      "freelance",
      "linkedin",
      "whatsapp"
    ],
    answer: [
      "Puedes contactarlo desde la sección de contacto del portafolio o revisar sus proyectos en GitHub.",
      "Si quieres colaborar con Miguel, puedes usar la sección de contacto o visitar su GitHub.",
      "Para propuestas, freelance o colaboración, la mejor ruta es la sección de contacto del sitio."
    ],
    suggestions: [
      "proyectos",
      "github",
      "ubicación"
    ]
  }
];

function toggleChatbot() {
  chatbotWindow.classList.toggle("hidden");

  if (!chatbotStarted) {
    addBotMessage(
      "¡Qué onda! 👋 Soy el asistente de Miguel. Pregúntame sobre proyectos, habilidades, ubicación o contacto."
    );

    addSuggestions([
      "proyectos",
      "habilidades",
      "contacto"
    ]);

    chatbotStarted = true;
  }
}

function closeChatbot() {
  chatbotWindow.classList.add("hidden");

  chatbotMessages.innerHTML = "";

  chatbotInput.value = "";

  chatbotStarted = false;
}

function addUserMessage(message) {
  chatbotMessages.innerHTML += `
    <div class="chatbot-message user">
      ${message}
    </div>
  `;

  scrollToBottom();
}

function addBotMessage(message) {
  chatbotMessages.innerHTML += `
    <div class="chatbot-message bot">
      ${message}
    </div>
  `;

  scrollToBottom();
}

function addTypingMessage() {
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

function removeTypingMessage() {
  const typingMessage =
    document.getElementById("typingMessage");

  if (typingMessage) {
    typingMessage.remove();
  }
}

function addSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) return;

  const buttons = suggestions
    .map(item => {
      if (typeof item === "string") {
        return `
          <button
            class="chatbot-suggestion"
            data-suggestion="${item}"
            data-type="text"
          >
            ${item}
          </button>
        `;
      }

      return `
        <button
          class="chatbot-suggestion"
          data-suggestion="${item.value}"
          data-type="${item.type}"
        >
          ${item.label}
        </button>
      `;
    })
    .join("");

  chatbotMessages.innerHTML += `
    <div class="chatbot-suggestions">
      ${buttons}
    </div>
  `;

  const suggestionButtons =
    chatbotMessages.querySelectorAll(
      ".chatbot-suggestion"
    );

  suggestionButtons.forEach(button => {
    button.addEventListener("click", () => {
      const value =
        button.dataset.suggestion;

      const type =
        button.dataset.type;

      if (type === "project") {
        processProjectSelection(value);
        return;
      }

      processMessage(value);
    });
  });

  scrollToBottom();
}

function getProjectsList() {
  const projects = getProjectsData();

  if (!projects || projects.length === 0) {
    return {
      answer:
        "Todavía no tengo proyectos cargados 😅. Intenta revisar la sección Projects directamente.",
      suggestions: [
        "herramientas",
        "contacto"
      ]
    };
  }

  return {
    answer:
      "🚀 Estos son los proyectos disponibles. Toca uno para ver más detalles:",
    suggestions: projects.map(project => ({
      label: project.titulo,
      value: project.id,
      type: "project"
    }))
  };
}

function getToolsList() {
  return {
    answer:
      "🛠 Estas son las principales herramientas y tecnologías que usa Miguel:",
    suggestions: [
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "Git",
      "GitHub",
      "Node.js",
      "Express",
      "MySQL",
      "Arduino",
      "ESP32",
      "IoT"
    ]
  };
}

function getProjectDetail(projectId) {
  const projects = getProjectsData();

  const project = projects.find(
    item => item.id === projectId
  );

  if (!project) {
    return {
      answer:
        "No encontré ese proyecto 😅. Intenta revisar la lista de proyectos otra vez.",
      suggestions: [
        "proyectos",
        "herramientas",
        "contacto"
      ]
    };
  }

  return {
    answer: `
      <strong>${project.titulo}</strong><br><br>

      ${project.descripcionLarga}<br><br>

      <strong>Categoría:</strong> ${project.categoria}<br>
      <strong>Nivel:</strong> ${project.nivel}<br>
      <strong>Año:</strong> ${project.año}<br><br>

      <strong>Tecnologías:</strong><br>
      ${(project.stack || []).join(", ")}<br><br>

      <a href="${project.demo}" target="_blank">
        Ver demo
      </a>
      |
      <a href="${project.codigo}" target="_blank">
        Ver código
      </a>
    `,
    suggestions: [
      "proyectos",
      "herramientas",
      "contacto"
    ]
  };
}

function processProjectSelection(projectId) {
  const projects = getProjectsData();

  const project = projects.find(
    item => item.id === projectId
  );

  if (!project) return;

  addUserMessage(project.titulo);

  addTypingMessage();

  setTimeout(() => {
    removeTypingMessage();

    const response =
      getProjectDetail(projectId);

    addBotMessage(response.answer);

    addSuggestions(response.suggestions);
  }, 700);
}

function getBotResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  if (
    normalizedMessage.includes("proyecto") ||
    normalizedMessage.includes("proyectos") ||
    normalizedMessage.includes("portfolio") ||
    normalizedMessage.includes("portafolio")
  ) {
    return getProjectsList();
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

  const foundResponse = responses.find(item =>
    item.keywords.some(keyword =>
      normalizedMessage.includes(
        normalizeText(keyword)
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
      suggestions: foundResponse.suggestions
    };
  }

  return {
    answer: getFallbackResponse(),
    suggestions: [
      "proyectos",
      "herramientas",
      "contacto"
    ]
  };
}

function getFallbackResponse() {
  const fallbackResponses = [
    "No entendí completamente 😅, pero puedes preguntarme por proyectos, habilidades, Arduino, ubicación o contacto.",
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

function processMessage(message) {
  if (!message) return;

  addUserMessage(message);

  addTypingMessage();

  setTimeout(() => {
    removeTypingMessage();

    const response =
      getBotResponse(message);

    addBotMessage(response.answer);

    addSuggestions(response.suggestions);
  }, 700);
}

function handleSubmit(event) {
  event.preventDefault();

  const message =
    chatbotInput.value.trim();

  if (!message) return;

  chatbotInput.value = "";

  processMessage(message);
}

function handleQuickAction(event) {
  const question =
    event.target.dataset.question;

  if (!question) return;

  processMessage(question);
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scrollToBottom() {
  chatbotMessages.scrollTop =
    chatbotMessages.scrollHeight;
}

export function initChatbot() {
  if (!chatbotToggle || !chatbotWindow) return;

  chatbotToggle.addEventListener(
    "click",
    toggleChatbot
  );

  if (chatbotClose) {
    chatbotClose.addEventListener(
      "click",
      closeChatbot
    );
  }

  if (chatbotForm) {
    chatbotForm.addEventListener(
      "submit",
      handleSubmit
    );
  }

  quickActions.forEach(button => {
    button.addEventListener(
      "click",
      handleQuickAction
    );
  });
}