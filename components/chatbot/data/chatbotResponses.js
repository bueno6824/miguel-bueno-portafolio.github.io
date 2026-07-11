export const welcomeMessages = [
  "¡Hola! 👋 Soy el asistente de Miguel. ¿Qué te gustaría conocer hoy?",

  "¡Bienvenido! 🚀 Estoy listo para mostrarte los proyectos, tecnologías y experiencia de Miguel.",

  "¡Qué gusto verte! 😄 Puedes preguntarme por proyectos, herramientas, Arduino, contacto o ubicación.",

  "👋 Hola, soy el asistente virtual de Miguel. Haré que recorrer este portafolio sea mucho más fácil.",

  "🚀 Bienvenido al portafolio de Miguel. Pregúntame lo que quieras sobre sus proyectos o experiencia.",

  "¡Hola! 💻 Si eres reclutador o desarrollador, puedo ayudarte a encontrar rápidamente la información que buscas.",

  "⚡ Estoy listo para ayudarte. Puedes descubrir proyectos, tecnologías o incluso abrir el portafolio desde aquí.",

  "¡Hey! 😎 Pregúntame sobre Frontend, Backend, IoT, GitHub o cualquier proyecto del portafolio."
];

export const responses = [
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

export function getRandomWelcomeMessage() {
  const randomIndex =
    Math.floor(
      Math.random() *
      welcomeMessages.length
    );

  return welcomeMessages[randomIndex];
}