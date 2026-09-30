// Importa la función encargada de normalizar el texto recibido.
import {
  normalizeText
} from "./chatbotUtils.js";

// Analiza un mensaje para determinar si corresponde
// a una intención de navegación dentro del portafolio.
export function getNavigationIntent(
  message
) {

  // Normaliza el mensaje para facilitar la comparación
  // con los patrones definidos más adelante.
  const normalizedMessage =
    normalizeText(message);

  // Si el mensaje está vacío después de normalizarlo,
  // no se puede determinar ninguna intención.
  if (!normalizedMessage) {
    return null;
  }

  // Busca una intención de navegación que coincida
  // con el mensaje normalizado.
  const intent =
    findNavigationIntent(
      normalizedMessage
    );

  // Si no existe una intención coincidente,
  // devuelve null para que el chatbot continúe
  // procesando el mensaje con otros módulos.
  if (!intent) {
    return null;
  }

  // Construye la respuesta de navegación que utilizará
  // el sistema principal del chatbot.
  return {
    // Mensaje que se mostrará al usuario.
    answer:
      intent.answer,

    // Acción que indica que debe navegarse hacia
    // una sección específica del portafolio.
    action: {
      type: "section",
      target: intent.target
    },

    // Indica que esta acción debe ejecutarse
    // directamente sin procesamiento adicional.
    direct: true,

    // Sugerencias que pueden mostrarse después
    // de realizar la navegación.
    suggestions:
      intent.suggestions
  };
}

// Busca dentro del mapa de navegación una entrada
// cuyos patrones coincidan con el mensaje recibido.
function findNavigationIntent(message) {

  // Mapa central de las secciones navegables del portafolio.
  // Cada entrada contiene:
  // - target: sección destino.
  // - patterns: frases que activan la navegación.
  // - answer: respuesta del chatbot.
  // - suggestions: opciones posteriores.
  const navigationMap = [
    {
      // Sección principal o inicio del portafolio.
      target: "#inicio",

      // Frases relacionadas con regresar o navegar al inicio.
      patterns: [
        "quiero volver al inicio",
        "llevame al inicio",
        "ve al inicio",
        "muestra el inicio",
        "regresa arriba"
      ],

      // Respuesta mostrada al confirmar la navegación.
      answer:
        "Claro 🚀 Te llevo al inicio.",

      // Sugerencias disponibles después de llegar al inicio.
      suggestions: [
        "sobre mí",
        "proyectos",
        "contacto"
      ]
    },

    {
      // Sección con información personal o presentación.
      target: "#about",

      // Frases utilizadas para solicitar información sobre Miguel.
      patterns: [
        "quiero saber quien eres",
        "quiero saber quien es miguel",
        "cuentame sobre miguel",
        "muestrame sobre ti",
        "llevame a sobre mi",
        "quien es miguel"
      ],

      // Respuesta asociada a la navegación.
      answer:
        "Claro. Te llevo a la sección sobre Miguel.",

      // Opciones que el usuario puede consultar posteriormente.
      suggestions: [
        "habilidades",
        "proyectos",
        "contacto"
      ]
    },
    {
      // Sección donde se muestran las habilidades técnicas.
      target: "#skills",

      // Frases relacionadas con habilidades y experiencia técnica.
      patterns: [
        "quiero ver tus skills",
        "muestrame tus habilidades",
        "ensename tus habilidades",
        "que habilidades tienes",
        "llevame a skills",
        "ver experiencia tecnica"
      ],

      // Respuesta mostrada al realizar la navegación.
      answer:
        "Perfecto 🔥 Te llevo a la sección de habilidades.",

      // Sugerencias relacionadas con el contenido técnico.
      suggestions: [
        "herramientas",
        "proyectos",
        "contacto"
      ]
    },
    {
      // Sección donde se muestran herramientas y tecnologías.
      target: "#tools",

      // Frases utilizadas para solicitar información sobre el stack.
      patterns: [
        "quiero ver tus herramientas",
        "ensename tus herramientas",
        "muestrame tu stack",
        "que herramientas utilizas",
        "llevame a herramientas",
        "quiero ver las tecnologias"
      ],

      // Respuesta asociada a la navegación.
      answer:
        "Claro 🛠 Te llevo a las herramientas y tecnologías.",

      // Sugerencias relacionadas con el perfil técnico.
      suggestions: [
        "habilidades",
        "proyectos",
        "contacto"
      ]
    },
    {
      // Sección que contiene los proyectos del portafolio.
      target: "#projects",

      // Frases relacionadas con consultar trabajos y proyectos.
      patterns: [
        "quiero ver tus proyectos",
        "muestrame lo que has hecho",
        "ensename tu trabajo",
        "quiero ver tu portafolio",
        "llevame a proyectos",
        "que proyectos tienes"
      ],

      // Respuesta mostrada al navegar hacia los proyectos.
      answer:
        "Buena elección 🚀 Te llevo a los proyectos.",

      // Sugerencias relacionadas con el análisis de proyectos.
      suggestions: [
        "proyecto más complejo",
        "proyecto más reciente",
        "contacto"
      ]
    },
    {
      // Sección donde se muestra la ubicación.
      target: "#location",

      // Frases utilizadas para solicitar información sobre ubicación.
      patterns: [
        "donde estas",
        "donde trabajas",
        "en que ciudad estas",
        "muestrame tu ubicacion",
        "llevame a ubicacion",
        "donde vive miguel"
      ],

      // Respuesta asociada a la navegación.
      answer:
        "Claro 📍 Te llevo a la sección de ubicación.",

      // Sugerencias disponibles después de consultar la ubicación.
      suggestions: [
        "contacto",
        "proyectos",
        "herramientas"
      ]
    },
    {
      // Sección utilizada para establecer contacto.
      target: "#contact",

      // Frases relacionadas con contactar o contratar.
      patterns: [
        "quiero contactarte",
        "quiero contratarte",
        "quiero enviarte un mensaje",
        "como puedo contactarte",
        "llevame al contacto",
        "quiero mandarte un correo",
        "quiero hablar con miguel"
      ],

      // Respuesta mostrada al navegar hacia contacto.
      answer:
        "Claro 📩 Te llevo a la sección de contacto.",

      // Sugerencias posteriores relacionadas con el portafolio.
      suggestions: [
        "proyectos",
        "github",
        "herramientas"
      ]
    }
  ];

  // Busca la primera sección cuyo conjunto de patrones
  // contenga una coincidencia con el mensaje recibido.
  return (
    navigationMap.find(item =>

      // Comprueba todos los patrones definidos
      // para cada sección de navegación.
      item.patterns.some(pattern =>

        // Compara el mensaje con el patrón previamente normalizado.
        message.includes(
          normalizeText(pattern)
        )
      )
    ) || null
  );
}