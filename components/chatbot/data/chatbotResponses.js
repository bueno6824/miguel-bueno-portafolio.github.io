// ==========================================
// MENSAJES DE BIENVENIDA
// ==========================================

// Lista de mensajes que el chatbot puede mostrar
// al iniciar una conversación con el usuario.
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


// ==========================================
// RESPUESTAS DEL CHATBOT
// ==========================================

// Contiene todas las intenciones que el chatbot puede reconocer.
// Cada objeto representa una intención diferente,
// sus palabras clave y las respuestas asociadas.
export const responses = [

  // ------------------------------------------
  // INTENCIÓN: SALUDO
  // ------------------------------------------

  {
    // Identificador interno de la intención
    intent: "saludo",

    // Palabras o frases que pueden activar esta intención
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

    // Respuestas posibles para esta intención
    // El sistema puede seleccionar una de ellas.
    answer: [
      "¡Hola! 👋 Soy el asistente de Miguel ⚡ Puedo contarte sobre sus proyectos, habilidades, ubicación o formas de contacto. ¿Qué quieres revisar primero?",
      "¡Qué onda! 🚀 Estoy aquí para ayudarte a explorar el portafolio de Miguel. ¿Quieres ver proyectos, tecnologías o contacto?",
      "¡Hey! 😄 Puedes preguntarme por proyectos, tecnologías, Arduino, ubicación o contacto."
    ],

    // Opciones que pueden mostrarse como sugerencias
    // para facilitar la interacción del usuario.
    suggestions: [
      "Soy reclutador",
      "proyectos",
      "contacto"
    ]
  },


  // ------------------------------------------
  // INTENCIÓN: GITHUB
  // ------------------------------------------

  {
    // Identificador interno de la intención
    intent: "github",

    // Palabras relacionadas con GitHub y código
    keywords: [
      "github",
      "git hub",
      "repositorio",
      "repo",
      "codigo",
      "código"
    ],

    // Respuesta relacionada con el perfil de GitHub
    answer: [
      "Miguel tiene su código y proyectos publicados en GitHub. ¿Quieres que te lleve a su perfil?"
    ],

    // Sugerencias posteriores a la respuesta
    suggestions: [
      "sí",
      "proyectos",
      "contacto"
    ],

    // Acción que puede ejecutar el chatbot
    // cuando se detecta esta intención.
    action: {

      // Indica que la acción consiste en abrir un enlace
      type: "link",

      // URL del perfil de GitHub
      url: "https://github.com/bueno6824"
    }
  },


  // ------------------------------------------
  // INTENCIÓN: HABILIDADES
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "habilidades",

    // Palabras relacionadas con tecnologías,
    // lenguajes y habilidades de desarrollo.
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

    // Diferentes respuestas posibles sobre las habilidades
    answer: [
      "Su stack principal incluye HTML, CSS, JavaScript, Bootstrap, Git, GitHub, Arduino y bases de desarrollo full stack. ¿Quieres conocer sus proyectos?",
      "Miguel trabaja principalmente con frontend moderno, diseño responsive, componentes reutilizables y arquitectura modular. ¿Quieres ver su GitHub?",
      "También está avanzando hacia full stack con Node.js, Express y MySQL. ¿Quieres saber más sobre sus herramientas?"
    ],

    // Sugerencias para continuar la conversación
    suggestions: [
      "proyectos",
      "arduino",
      "github"
    ]
  },


  // ------------------------------------------
  // INTENCIÓN: IOT / ARDUINO
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "iot",

    // Palabras relacionadas con IoT, Arduino,
    // electrónica y automatización.
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

    // Respuestas posibles relacionadas con IoT
    answer: [
      "También trabaja con proyectos IoT usando Arduino, sensores, automatización y lógica aplicada a hardware 🔌. ¿Quieres ver proyectos relacionados?",
      "En la parte IoT, Miguel explora Arduino, sensores, electrónica básica y automatización. ¿Quieres conocer su stack?",
      "Sus proyectos con Arduino conectan programación con hardware real, ideal para soluciones prácticas. ¿Quieres contactarlo?"
    ],

    // Sugerencias para continuar
    suggestions: [
      "proyectos IoT",
      "Arduino",
      "ESP32",
      "contacto"
    ]
  },


  // ------------------------------------------
  // INTENCIÓN: UBICACIÓN
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "ubicacion",

    // Palabras relacionadas con ubicación geográfica
    // y modalidad de trabajo.
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

    // Respuesta que proporciona la información de ubicación
    answer: [
      "Miguel está ubicado en León, Guanajuato, México 📍 y está abierto a colaboración remota. Te llevo a ubicación."
    ],

    // Sugerencias después de mostrar la información
    suggestions: [
      "contacto",
      "proyectos",
      "herramientas"
    ],

    // Acción automática asociada a esta intención
    action: {

      // Indica que se debe navegar a una sección
      type: "section",

      // Selector de la sección de ubicación
      target: "#location"
    },

    // Indica que la acción puede ejecutarse directamente
    direct: true
  },


  // ------------------------------------------
  // INTENCIÓN: CONTACTO
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "contacto",

    // Palabras relacionadas con comunicación,
    // contratación y oportunidades laborales.
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

    // Respuesta relacionada con la sección de contacto
    answer: [
      "Puedes contactarlo desde la sección de contacto del portafolio. Te llevo ahí."
    ],

    // Opciones sugeridas para continuar
    suggestions: [
      "proyectos",
      "github",
      "herramientas"
    ],

    // Acción asociada a la intención
    action: {

      // Indica que debe navegar a una sección
      type: "section",

      // Selector de la sección de contacto
      target: "#contact"
    },

    // Permite ejecutar la acción directamente
    direct: true
  },


  // ------------------------------------------
  // INTENCIÓN: AGRADECIMIENTO
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "agradecimiento",

    // Palabras y frases que indican agradecimiento
    // o una valoración positiva de la ayuda.
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

    // Respuestas posibles ante un agradecimiento
    answer: [
      "¡De nada! 😄 ¿Quieres seguir explorando los proyectos de Miguel?",

      "¡Con gusto! 🚀 Puedo mostrarte proyectos, herramientas o formas de contacto.",

      "¡Excelente! ⚡ Me alegra que te haya servido. ¿Qué más quieres revisar?",

      "¡Para eso estoy! 😎 ¿Seguimos con proyectos, tecnologías o contacto?"
    ],

    // Sugerencias para continuar la conversación
    suggestions: [
      "proyectos",
      "herramientas",
      "contacto"
    ]
  },


  // ------------------------------------------
  // INTENCIÓN: DESPEDIDA
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "despedida",

    // Palabras y frases relacionadas con despedirse
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

    // Respuestas posibles para una despedida
    answer: [
      "¡Hasta luego! 👋 Gracias por visitar el portafolio de Miguel.",

      "¡Nos vemos! 🚀 Puedes volver cuando quieras para revisar más proyectos.",

      "¡Gracias por pasar por aquí! 😄 Que tengas un excelente día.",

      "¡Hasta pronto! ⚡ No olvides revisar GitHub o dejar un mensaje en contacto."
    ],

    // Sugerencias que se muestran al finalizar
    suggestions: [
      "inicio",
      "github",
      "contacto"
    ]
  },


  // ------------------------------------------
  // INTENCIÓN: ELOGIO
  // ------------------------------------------

  {
    // Identificador de la intención
    intent: "elogio",

    // Palabras y frases que indican que el usuario
    // está haciendo un comentario positivo sobre el portafolio.
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

    // Respuestas posibles ante un elogio
    answer: [
      "¡Qué bueno que te gustó! 😄 Miguel ha trabajado bastante en mejorar la experiencia del portafolio.",

      "¡Gracias! 🚀 El objetivo es mostrar proyectos reales con una presentación moderna y profesional.",

      "¡Se aprecia mucho! ⚡ Todavía hay más proyectos y mejoras por venir.",

      "¡Gracias por decirlo! 😎 ¿Quieres que te recomiende uno de los proyectos?"
    ],

    // Sugerencias para continuar explorando el portafolio
    suggestions: [
      "recomiéndame un proyecto",
      "proyectos",
      "contacto"
    ]
  },

];


// ==========================================
// FUNCIÓN: MENSAJE DE BIENVENIDA ALEATORIO
// ==========================================

// Obtiene uno de los mensajes de bienvenida
// de forma aleatoria.
export function getRandomWelcomeMessage() {

  // Genera un número aleatorio entre 0 y la cantidad
  // de mensajes disponibles.
  const randomIndex =
    Math.floor(
      Math.random() *
      welcomeMessages.length
    );

  // Devuelve el mensaje correspondiente al índice generado.
  return welcomeMessages[randomIndex];
}