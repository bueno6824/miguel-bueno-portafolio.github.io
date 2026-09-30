import {

  normalizeText,

  matchesKeyword

} from "./chatbotUtils.js";

/* ==============================

   SMART SUGGESTIONS

============================== */

// Genera sugerencias inteligentes según el contenido del mensaje del usuario.
export function getSmartSuggestions(message) {

  // Normaliza el mensaje para facilitar la detección de palabras clave.
  const normalizedMessage =

    normalizeText(message);

  // Detecta temas relacionados con IoT, Arduino, ESP32 y sensores.
  if (

    normalizedMessage.includes("arduino") ||

    normalizedMessage.includes("iot") ||

    normalizedMessage.includes("esp32") ||

    normalizedMessage.includes("sensores")

  ) {

    // Devuelve sugerencias relacionadas con proyectos IoT.
    return [

      "proyectos IoT",

      "Arduino",

      "ESP32",

      "contacto"

    ];

  }

  // Detecta temas relacionados con desarrollo frontend.
  if (

    normalizedMessage.includes("frontend") ||

    normalizedMessage.includes("html") ||

    normalizedMessage.includes("css") ||

    normalizedMessage.includes("javascript")

  ) {

    // Devuelve sugerencias relacionadas con tecnologías frontend.
    return [

      "proyectos frontend",

      "HTML",

      "CSS",

      "JavaScript"

    ];

  }

  // Detecta temas relacionados con desarrollo backend.
  if (

    normalizedMessage.includes("backend") ||

    normalizedMessage.includes("node") ||

    normalizedMessage.includes("express") ||

    normalizedMessage.includes("mysql")

  ) {

    // Devuelve sugerencias relacionadas con tecnologías backend.
    return [

      "Node.js",

      "Express",

      "MySQL",

      "proyectos"

    ];

  }

  // Detecta mensajes relacionados con empleo, contratación o reclutamiento.
  if (

    normalizedMessage.includes("contratar") ||

    normalizedMessage.includes("empleo") ||

    normalizedMessage.includes("trabajo") ||

    normalizedMessage.includes("reclutador")

  ) {

    // Devuelve opciones orientadas al contacto profesional.
    return [

      "contacto",

      "proyectos",

      "github"

    ];

  }

  // Detecta mensajes relacionados con ubicación.
  if (

    normalizedMessage.includes("ubicacion") ||

    normalizedMessage.includes("ubicación") ||

    normalizedMessage.includes("leon") ||

    normalizedMessage.includes("guanajuato")

  ) {

    // Devuelve sugerencias relacionadas con ubicación y contacto.
    return [

      "contacto",

      "ubicación",

      "proyectos"

    ];

  }

  // Devuelve sugerencias generales cuando no se detecta un tema específico.
  return [

    "proyectos",

    "herramientas",

    "contacto"

  ];

}