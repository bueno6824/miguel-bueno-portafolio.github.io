import {
  normalizeText
} from "./chatbotUtils.js";

export function getNavigationIntent(
  message
) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  const intent =
    findNavigationIntent(
      normalizedMessage
    );

  if (!intent) {
    return null;
  }

  return {
    answer:
      intent.answer,

    action: {
      type: "section",
      target: intent.target
    },

    direct: true,

    suggestions:
      intent.suggestions
  };
}

function findNavigationIntent(message) {
  const navigationMap = [
    {
      target: "#inicio",

      patterns: [
        "quiero volver al inicio",
        "llevame al inicio",
        "ve al inicio",
        "muestra el inicio",
        "regresa arriba"
      ],

      answer:
        "Claro 🚀 Te llevo al inicio.",

      suggestions: [
        "sobre mí",
        "proyectos",
        "contacto"
      ]
    },

    {
      target: "#about",

      patterns: [
        "quiero saber quien eres",
        "quiero saber quien es miguel",
        "cuentame sobre miguel",
        "muestrame sobre ti",
        "llevame a sobre mi",
        "quien es miguel"
      ],

      answer:
        "Claro. Te llevo a la sección sobre Miguel.",

      suggestions: [
        "habilidades",
        "proyectos",
        "contacto"
      ]
    },

    {
      target: "#skills",

      patterns: [
        "quiero ver tus skills",
        "muestrame tus habilidades",
        "ensename tus habilidades",
        "que habilidades tienes",
        "llevame a skills",
        "ver experiencia tecnica"
      ],

      answer:
        "Perfecto 🔥 Te llevo a la sección de habilidades.",

      suggestions: [
        "herramientas",
        "proyectos",
        "contacto"
      ]
    },

    {
      target: "#tools",

      patterns: [
        "quiero ver tus herramientas",
        "ensename tus herramientas",
        "muestrame tu stack",
        "que herramientas utilizas",
        "llevame a herramientas",
        "quiero ver las tecnologias"
      ],

      answer:
        "Claro 🛠 Te llevo a las herramientas y tecnologías.",

      suggestions: [
        "habilidades",
        "proyectos",
        "contacto"
      ]
    },

    {
      target: "#projects",

      patterns: [
        "quiero ver tus proyectos",
        "muestrame lo que has hecho",
        "ensename tu trabajo",
        "quiero ver tu portafolio",
        "llevame a proyectos",
        "que proyectos tienes"
      ],

      answer:
        "Buena elección 🚀 Te llevo a los proyectos.",

      suggestions: [
        "proyecto más complejo",
        "proyecto más reciente",
        "contacto"
      ]
    },

    {
      target: "#location",

      patterns: [
        "donde estas",
        "donde trabajas",
        "en que ciudad estas",
        "muestrame tu ubicacion",
        "llevame a ubicacion",
        "donde vive miguel"
      ],

      answer:
        "Claro 📍 Te llevo a la sección de ubicación.",

      suggestions: [
        "contacto",
        "proyectos",
        "herramientas"
      ]
    },

    {
      target: "#contact",

      patterns: [
        "quiero contactarte",
        "quiero contratarte",
        "quiero enviarte un mensaje",
        "como puedo contactarte",
        "llevame al contacto",
        "quiero mandarte un correo",
        "quiero hablar con miguel"
      ],

      answer:
        "Claro 📩 Te llevo a la sección de contacto.",

      suggestions: [
        "proyectos",
        "github",
        "herramientas"
      ]
    }
  ];

  return (
    navigationMap.find(item =>
      item.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      )
    ) || null
  );
}

