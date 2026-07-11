import {
  getProjectsData,
  openProjectModal
} from "../modals/modal.js";

import {
  chatbotContext,
  resetChatbotContext
} from "./modules/chatbotState.js";

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
  document.getElementById("chatbotMessages");

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


const welcomeMessages = [
  "¡Hola! 👋 Soy el asistente de Miguel. ¿Qué te gustaría conocer hoy?",

  "¡Bienvenido! 🚀 Estoy listo para mostrarte los proyectos, tecnologías y experiencia de Miguel.",

  "¡Qué gusto verte! 😄 Puedes preguntarme por proyectos, herramientas, Arduino, contacto o ubicación.",

  "👋 Hola, soy el asistente virtual de Miguel. Haré que recorrer este portafolio sea mucho más fácil.",

  "🚀 Bienvenido al portafolio de Miguel. Pregúntame lo que quieras sobre sus proyectos o experiencia.",

  "¡Hola! 💻 Si eres reclutador o desarrollador, puedo ayudarte a encontrar rápidamente la información que buscas.",

  "⚡ Estoy listo para ayudarte. Puedes descubrir proyectos, tecnologías o incluso abrir el portafolio desde aquí.",

  "¡Hey! 😎 Pregúntame sobre Frontend, Backend, IoT, GitHub o cualquier proyecto del portafolio."
];

/* ==============================
   BASE RESPONSES
============================== */

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
      "herramientas",
      "contacto"
    ]
  },

  {
    intent: "github",
    keywords: [
      "github",
      "git hub",
      "repositorio",
      "repo",
      "codigo",
      "código"
    ],
    answer: [
      "Miguel tiene su código y proyectos publicados en GitHub. ¿Quieres que te lleve a su perfil?"
    ],
    suggestions: [
      "sí",
      "proyectos",
      "contacto"
    ],
    action: {
      type: "link",
      url: "https://github.com/bueno6824"
    }
  },

  {
    intent: "habilidades",
    keywords: [
      "habilidades",
      "skills",
      "tecnologias",
      "tecnologías",
      "stack",
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
      "proyectos IoT",
      "Arduino",
      "ESP32",
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
      "Miguel está ubicado en León, Guanajuato, México 📍 y está abierto a colaboración remota. Te llevo a ubicación."
    ],
    suggestions: [
      "contacto",
      "proyectos",
      "herramientas"
    ],
    action: {
      type: "section",
      target: "#location"
    },
    direct: true
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
      "Puedes contactarlo desde la sección de contacto del portafolio. Te llevo ahí."
    ],
    suggestions: [
      "proyectos",
      "github",
      "herramientas"
    ],
    action: {
      type: "section",
      target: "#contact"
    },
    direct: true
  },
  {
  intent: "agradecimiento",

  keywords: [
    "gracias",
    "muchas gracias",
    "te agradezco",
    "genial",
    "excelente",
    "perfecto",
    "muy bien",
    "buena ayuda",
    "me ayudaste"
  ],

  answer: [
    "¡De nada! 😄 ¿Quieres seguir explorando los proyectos de Miguel?",

    "¡Con gusto! 🚀 Puedo mostrarte proyectos, herramientas o formas de contacto.",

    "¡Excelente! ⚡ Me alegra que te haya servido. ¿Qué más quieres revisar?",

    "¡Para eso estoy! 😎 ¿Seguimos con proyectos, tecnologías o contacto?"
  ],

  suggestions: [
    "proyectos",
    "herramientas",
    "contacto"
  ]
},{
  intent: "despedida",

  keywords: [
    "adios",
    "adiós",
    "hasta luego",
    "nos vemos",
    "bye",
    "chao",
    "hasta pronto",
    "me voy",
    "eso es todo"
  ],

  answer: [
    "¡Hasta luego! 👋 Gracias por visitar el portafolio de Miguel.",

    "¡Nos vemos! 🚀 Puedes volver cuando quieras para revisar más proyectos.",

    "¡Gracias por pasar por aquí! 😄 Que tengas un excelente día.",

    "¡Hasta pronto! ⚡ No olvides revisar GitHub o dejar un mensaje en contacto."
  ],

  suggestions: [
    "inicio",
    "github",
    "contacto"
  ]
},
{
  intent: "elogio",

  keywords: [
    "buen trabajo",
    "esta genial",
    "está genial",
    "me gusta",
    "muy bonito",
    "se ve bien",
    "buen portafolio",
    "esta increíble",
    "está increíble",
    "muy profesional",
    "excelente portafolio"
  ],

  answer: [
    "¡Qué bueno que te gustó! 😄 Miguel ha trabajado bastante en mejorar la experiencia del portafolio.",

    "¡Gracias! 🚀 El objetivo es mostrar proyectos reales con una presentación moderna y profesional.",

    "¡Se aprecia mucho! ⚡ Todavía hay más proyectos y mejoras por venir.",

    "¡Gracias por decirlo! 😎 ¿Quieres que te recomiende uno de los proyectos?"
  ],

  suggestions: [
    "recomiéndame un proyecto",
    "proyectos",
    "contacto"
  ]
},

];

/* ==============================
   CHATBOT UI
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
  chatbotWindow.classList.add("hidden");

  chatbotMessages.innerHTML = "";
  chatbotInput.value = "";

  chatbotStarted = false;
  pendingAction = null;

  resetChatbotContext();
}

function escapeHTML(text) {
    return text.replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}
  
function addUserMessage(message) {
  chatbotMessages.innerHTML += `
    <div class="chatbot-message user">
      ${escapeHTML(message)}
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

function addProjectCards(projects) {
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
        processProjectSelection(
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

/* ==============================
   HTML TYPEWRITER
============================== */

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function typeBotMessage(message, speed = 14) {
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
}function removeTypingMessage() {
  const typingMessage =
    document.getElementById("typingMessage");

  if (typingMessage) {
    typingMessage.remove();
  }
}

function addSuggestions(suggestions) {
  if (!suggestions?.length) return;

  const buttons = suggestions
    .map(item => {
      if (typeof item === "string") {
        return `
          <button
            class="chatbot-suggestion"
            data-suggestion="${item}"
            data-type="text"
            type="button"
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
          type="button"
        >
          ${item.label}
        </button>
      `;
    })
    .join("");

  const suggestionsContainer =
    document.createElement("div");

  suggestionsContainer.className =
    "chatbot-suggestions";

  suggestionsContainer.innerHTML =
    buttons;

  suggestionsContainer
    .querySelectorAll(".chatbot-suggestion")
    .forEach(button => {
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

  chatbotMessages.appendChild(
    suggestionsContainer
  );

  scrollToBottom();
}

/* ==============================
   PROJECT HELPERS
============================== */

function getProjects() {
  return getProjectsData() || [];
}

function getProjectById(projectId) {
  return getProjects().find(
    project => project.id === projectId
  );
}

function getProjectsList() {
  const projects =
    getProjects();

  if (!projects.length) {
    return {
      answer:
        "Todavía no tengo proyectos cargados 😅.",
      suggestions: [
        "herramientas",
        "contacto"
      ]
    };
  }

  chatbotContext.lastTopic =
    "projects";

  chatbotContext.lastProjects =
    projects;

  chatbotContext.lastProject =
    null;

  return {
    answer:
      "🚀 Estos son los proyectos disponibles:",
    projects,
    suggestions: [
      "proyectos frontend",
      "proyectos IoT",
      "recomiéndame uno"
    ]
  };
}

function getProjectFromMessage(message) {
  const normalizedMessage =
    normalizeText(message);

  return getProjects().find(project => {
    const title =
      normalizeText(project.titulo || "");

    const category =
      normalizeText(project.categoria || "");

    const stack =
      (project.stack || [])
        .map(item => normalizeText(item))
        .join(" ");

    return (
      title.includes(normalizedMessage) ||
      normalizedMessage.includes(title) ||
      category.includes(normalizedMessage) ||
      stack.includes(normalizedMessage)
    );
  });
}

function searchProjects(message) {
  const normalizedMessage =
    normalizeText(message);

  const ignoreWords = [
    "proyecto",
    "proyectos",
    "con",
    "de",
    "del",
    "la",
    "el",
    "los",
    "las",
    "quiero",
    "ver",
    "mostrar",
    "muestrame",
    "muéstrame"
  ];

  const searchWords =
    normalizedMessage
      .split(" ")
      .filter(word =>
        word.length > 2 &&
        !ignoreWords.includes(word)
      );

  if (!searchWords.length) return [];

  return getProjects().filter(project => {
    const projectText = [
      project.titulo,
      project.categoria,
      project.nivel,
      project.año,
      project.descripcionCorta,
      project.descripcionLarga,
      ...(project.stack || [])
    ]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return searchWords.some(word =>
      projectText.includes(word)
    );
  });
}

function getProjectSearchResponse(
  message
) {
  const results =
    searchProjects(message);

  if (!results.length) {
    return null;
  }

  chatbotContext.lastTopic =
    "project-search";

  chatbotContext.lastProjects =
    results;

  chatbotContext.lastProject =
    null;

  return {
    answer:
      `Encontré ${results.length} proyecto(s) relacionado(s) con tu búsqueda 🔎:`,
    projects: results,
    suggestions: [
      "abre el primero",
      "cuál recomiendas",
      "contacto"
    ]
  };
}

function getRecommendedProject() {
  const projects = getProjects();

  if (!projects.length) return null;

  const priorityProject =
    projects.find(project =>
      normalizeText(project.titulo || "")
        .includes("portafolio")
    );

  return priorityProject || projects[0];
}

function getLatestProject() {
  const projects = getProjects();

  if (!projects.length) return null;

  return [...projects].sort((a, b) => {
    const yearA = Number(a.año) || 0;
    const yearB = Number(b.año) || 0;

    return yearB - yearA;
  })[0];
}

function getSpecialProjectResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  const wantsRecommendation =
    normalizedMessage.includes("recomiend") ||
    normalizedMessage.includes("mejor proyecto") ||
    normalizedMessage.includes("proyecto recomendado");

  const wantsLatest =
    normalizedMessage.includes("ultimo proyecto") ||
    normalizedMessage.includes("último proyecto") ||
    normalizedMessage.includes("mas reciente") ||
    normalizedMessage.includes("más reciente") ||
    normalizedMessage.includes("reciente");

  if (wantsRecommendation) {
    const project =
      getRecommendedProject();

    if (!project) return null;
    
chatbotContext.lastTopic = "recommended-project";
chatbotContext.lastProject = project;
chatbotContext.lastProjects = [project];

    return {
      answer: `
        🔥 Te recomiendo revisar <strong>${project.titulo}</strong>.<br><br>
        Es buena opción porque representa muy bien el enfoque de Miguel:
        diseño, estructura, tecnologías y experiencia de usuario.<br><br>
        ¿Quieres abrirlo?
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

  if (wantsLatest) {
    const project =
      getLatestProject();

    if (!project) return null;

chatbotContext.lastTopic = "latest-project";
chatbotContext.lastProject = project;
chatbotContext.lastProjects = [project];

    return {
      answer: `
        🆕 El proyecto más reciente es <strong>${project.titulo}</strong>.<br><br>
        <strong>Año:</strong> ${project.año || "No especificado"}<br>
        <strong>Categoría:</strong> ${project.categoria || "Sin categoría"}<br>
        <strong>Stack:</strong> ${(project.stack || []).join(", ")}
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

  return null;
}

function processProjectSelection(projectId) {
  const project =
    getProjectById(projectId);

  if (!project) {
    typeBotMessage(
      "No pude encontrar ese proyecto 😅."
    );

    return;
  }

  chatbotContext.lastTopic =
    "opened-project";

  chatbotContext.lastProject =
    project;

  addUserMessage(
    project.titulo
  );

  addTypingMessage();

  setTimeout(async () => {
    removeTypingMessage();

    await typeBotMessage(
      `🚀 Abriendo <strong>${project.titulo}</strong> en el modal.`
    );

    openProjectModal(
      projectId
    );
  }, 500);
}

/* ==============================
   TOOLS / RECRUITER
============================== */

function getToolsList() {
  return {
    answer:
      "🛠 Estas son las principales herramientas y tecnologías que usa Miguel:",
    suggestions: getSmartSuggestions(
      "frontend backend arduino"
    )
  };
}

function getRecruiterResponse(message) {
  const normalizedMessage =
    normalizeText(message);

  const recruiterKeywords = [
    "contratar",
    "contratacion",
    "contratación",
    "reclutador",
    "recruiter",
    "empleo",
    "trabajo",
    "vacante",
    "desarrollador",
    "developer",
    "experiencia",
    "por que deberia contratarte",
    "por qué debería contratarte",
    "full stack",
    "frontend developer"
  ];

  const isRecruiterIntent =
    recruiterKeywords.some(keyword =>
      normalizedMessage.includes(
        normalizeText(keyword)
      )
    );

  if (!isRecruiterIntent) return null;

  return {
    answer: `
      🚀 <strong>Miguel Bueno</strong> es desarrollador Frontend con enfoque en interfaces modernas, arquitectura modular y experiencia de usuario.<br><br>

      <strong>Perfil:</strong><br>
      Frontend Developer / Full Stack Junior<br><br>

      <strong>Stack principal:</strong><br>
      HTML, CSS, JavaScript, Bootstrap, Git, GitHub, Node.js, Express, MySQL, Arduino e IoT.<br><br>

      <strong>Puede aportar en:</strong><br>
      • Desarrollo de interfaces responsive<br>
      • Portafolios y landing pages modernas<br>
      • Componentes UI reutilizables<br>
      • Integración con APIs<br>
      • Proyectos frontend con lógica dinámica<br>
      • Automatización e IoT con Arduino<br><br>

      Te llevo a contacto para que puedas escribirle.
    `,
    suggestions: getSmartSuggestions(message),
    action: {
      type: "section",
      target: "#contact"
    },
    direct: true
  };
}

/* ==============================
   SMART SUGGESTIONS
============================== */

function getSmartSuggestions(message) {
  const normalizedMessage =
    normalizeText(message);

  if (
    normalizedMessage.includes("arduino") ||
    normalizedMessage.includes("iot") ||
    normalizedMessage.includes("esp32") ||
    normalizedMessage.includes("sensores")
  ) {
    return [
      "proyectos IoT",
      "Arduino",
      "ESP32",
      "contacto"
    ];
  }

  if (
    normalizedMessage.includes("frontend") ||
    normalizedMessage.includes("html") ||
    normalizedMessage.includes("css") ||
    normalizedMessage.includes("javascript")
  ) {
    return [
      "proyectos frontend",
      "HTML",
      "CSS",
      "JavaScript"
    ];
  }

  if (
    normalizedMessage.includes("backend") ||
    normalizedMessage.includes("node") ||
    normalizedMessage.includes("express") ||
    normalizedMessage.includes("mysql")
  ) {
    return [
      "Node.js",
      "Express",
      "MySQL",
      "proyectos"
    ];
  }

  if (
    normalizedMessage.includes("contratar") ||
    normalizedMessage.includes("empleo") ||
    normalizedMessage.includes("trabajo") ||
    normalizedMessage.includes("reclutador")
  ) {
    return [
      "contacto",
      "proyectos",
      "github"
    ];
  }

  if (
    normalizedMessage.includes("ubicacion") ||
    normalizedMessage.includes("ubicación") ||
    normalizedMessage.includes("leon") ||
    normalizedMessage.includes("guanajuato")
  ) {
    return [
      "contacto",
      "ubicación",
      "proyectos"
    ];
  }

  return [
    "proyectos",
    "herramientas",
    "contacto"
  ];
}

/* ==============================
   SECTION ACTIONS
============================== */

function scrollToSection(selector) {
  const target =
    document.querySelector(selector);

  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function getDirectSectionAction(message) {
  const normalized =
    normalizeText(message);

  const sectionMap = [
    {
      keywords: [
        "inicio",
        "home",
        "hero"
      ],
      target: "#inicio",
      label: "inicio"
    },
    {
      keywords: [
        "sobre mi",
        "sobre mí",
        "about",
        "quien eres",
        "quién eres"
      ],
      target: "#about",
      label: "sobre mí"
    },
    {
      keywords: [
        "habilidades",
        "skills"
      ],
      target: "#skills",
      label: "habilidades"
    },
    {
      keywords: [
        "herramientas",
        "tools",
        "tecnologias",
        "tecnologías"
      ],
      target: "#tools",
      label: "herramientas"
    },
    {
      keywords: [
        "ubicacion",
        "ubicación",
        "location",
        "mapa"
      ],
      target: "#location",
      label: "ubicación"
    },
    {
      keywords: [
        "contacto",
        "contactar",
        "email",
        "correo"
      ],
      target: "#contact",
      label: "contacto"
    }
  ];

  const section =
    sectionMap.find(item =>
      item.keywords.some(keyword =>
        normalized.includes(
          normalizeText(keyword)
        )
      )
    );

  if (!section) return null;

  return {
    answer:
      `Claro 🚀 Te llevo a la sección de ${section.label}.`,
    suggestions: getSmartSuggestions(message),
    action: {
      type: "section",
      target: section.target
    },
    direct: true
  };
}

function executeAction(action) {
  if (!action) return;

  if (action.type === "link") {
    window.open(
      action.url,
      "_blank"
    );

    return;
  }

  if (action.type === "section") {
    scrollToSection(action.target);
    return;
  }

  if (action.type === "project") {
  const project =
    getProjectById(action.projectId);

  if (!project) {
    typeBotMessage(
      "No pude encontrar ese proyecto 😅."
    );

    return;
  }

  processProjectSelection(action.projectId);
}
}

/* ==============================
   RESPONSE ENGINE
============================== */
function getContextualResponse(message) {
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

function getBotResponse(message) {
  const normalizedMessage =
    normalizeText(message);
    
    const contextualResponse =
  getContextualResponse(message);

if (contextualResponse) {
  return contextualResponse;
}

  const specialProjectResponse =
    getSpecialProjectResponse(message);

  if (specialProjectResponse) {
    return specialProjectResponse;
  }

  const recruiterResponse =
    getRecruiterResponse(message);

  if (recruiterResponse) {
    return recruiterResponse;
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
    return {
      answer:
        `Encontré este proyecto: <strong>${matchedProject.titulo}</strong>. ¿Quieres que lo abra?`,
      suggestions: [
        {
          label: "Abrir proyecto",
          value: matchedProject.id,
          type: "project"
        },
        "proyectos",
        "contacto"
      ]
    };
  }

  const projectSearchResponse =
    getProjectSearchResponse(message);

  if (projectSearchResponse) {
    return projectSearchResponse;
  }

  const directSectionAction =
    getDirectSectionAction(message);

  if (directSectionAction) {
    return directSectionAction;
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

function getFallbackResponse() {
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

/* ==============================
   MESSAGE PROCESSING
============================== */

function processMessage(message) {
  if (!message) return;

  addUserMessage(message);

  /* ==============================
     CONFIRMACIÓN DE ACCIÓN
  ============================== */

  if (
    pendingAction &&
    isAffirmative(message)
  ) {
    const action =
      pendingAction;

    pendingAction = null;

    addTypingMessage();

    setTimeout(async () => {
      removeTypingMessage();

      await typeBotMessage(
        "Perfecto 🚀 Te llevo ahí."
      );

      executeAction(action);
    }, 500);

    return;
  }

  pendingAction = null;

  addTypingMessage();

  setTimeout(async () => {
    removeTypingMessage();

    const response =
      getBotResponse(message);

    await typeBotMessage(
      response.answer
    );

    /* TARJETAS DE PROYECTOS */

    if (response.projects) {
      addProjectCards(
        response.projects
      );
    }

    /* ACCIONES */

    if (
      response.action &&
      response.direct
    ) {
      await wait(350);

      executeAction(
        response.action
      );
    } else if (
      response.action
    ) {
      pendingAction =
        response.action;
    }

    /* SUGERENCIAS */

    addSuggestions(
      response.suggestions
    );
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
   UTILS
============================== */
function matchesKeyword( message, keyword) {
  const normalizedMessage =
    normalizeText(message);

  const normalizedKeyword =
    normalizeText(keyword);

  if (
    normalizedMessage ===
    normalizedKeyword
  ) {
    return true;
  }

  if (
    normalizedKeyword.includes(" ")
  ) {
    return normalizedMessage.includes(
      normalizedKeyword
    );
  }

  const words =
    normalizedMessage.split(/\s+/);

  return words.includes(
    normalizedKeyword
  );
}

function isAffirmative(message) {
  const normalizedMessage =
    normalizeText(message);

  return [
    "si",
    "sí",
    "simon",
    "claro",
    "va",
    "ok",
    "dale",
    "por supuesto"
  ].some(word =>
    normalizedMessage.includes(
      normalizeText(word)
    )
  );
}

function normalizeText(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scrollToBottom() {
  chatbotMessages.scrollTop =
    chatbotMessages.scrollHeight;
}
function getRandomWelcomeMessage() {
  const randomIndex =
    Math.floor(
      Math.random() *
      welcomeMessages.length
    );

  return welcomeMessages[randomIndex];
}


/* ==============================
   INIT
============================== */

export function initChatbot() {
  if (!chatbotToggle || !chatbotWindow) return;

  chatbotToggle.addEventListener(
    "click",
    toggleChatbot
  );

  window.addEventListener(
    "projectModalClosed",
    handleModalClose
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