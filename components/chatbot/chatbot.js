import {
  getProjectsData,
  openProjectModal
} from "../modals/modal.js";

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
  }
];

/* ==============================
   CHATBOT UI
============================== */

function toggleChatbot() {
  chatbotWindow.classList.toggle("hidden");

  if (!chatbotStarted) {
    addBotMessage(
      "¡Qué onda! 👋 Soy el asistente de Miguel. Pregúntame sobre proyectos, herramientas, ubicación o contacto."
    );

    addSuggestions([
      "proyectos",
      "herramientas",
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
  pendingAction = null;
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
  const projects = getProjects();

  if (!projects.length) {
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
      "🚀 Estos son los proyectos disponibles. Toca uno y te abro el modal con todos los detalles:",
    suggestions: projects.map(project => ({
      label: project.titulo,
      value: project.id,
      type: "project"
    }))
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

function getProjectSearchResponse(message) {
  const results =
    searchProjects(message);

  if (!results.length) return null;

  return {
    answer:
      `Encontré ${results.length} proyecto(s) relacionado(s) con tu búsqueda 🔎. Toca uno para abrirlo:`,
    suggestions: results.map(project => ({
      label: project.titulo,
      value: project.id,
      type: "project"
    }))
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

  if (!project) return;

  addUserMessage(project.titulo);

  addTypingMessage();

  setTimeout(() => {
    removeTypingMessage();

    addBotMessage(
      `🚀 Abriendo <strong>${project.titulo}</strong> en el modal.`
    );

    openProjectModal(projectId);

    addSuggestions([
      "proyectos",
      "herramientas",
      "contacto"
    ]);
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
  }
}

/* ==============================
   RESPONSE ENGINE
============================== */

function getBotResponse(message) {
  const normalizedMessage =
    normalizeText(message);

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

  if (
    pendingAction &&
    isAffirmative(message)
  ) {
    const action =
      pendingAction;

    pendingAction = null;

    addTypingMessage();

    setTimeout(() => {
      removeTypingMessage();

      addBotMessage(
        "Perfecto 🚀 Te llevo ahí."
      );

      executeAction(action);
    }, 500);

    return;
  }

  pendingAction = null;

  addTypingMessage();

  setTimeout(() => {
    removeTypingMessage();

    const response =
      getBotResponse(message);

    addBotMessage(
      response.answer
    );

    if (
      response.action &&
      response.direct
    ) {
      setTimeout(() => {
        executeAction(
          response.action
        );
      }, 600);
    } else if (response.action) {
      pendingAction =
        response.action;
    }

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

function handleModalClose() {
  if (!chatbotStarted) return;

  addBotMessage(
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