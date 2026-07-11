import {
  normalizeText,
  matchesKeyword
} from "./chatbotUtils.js";

/* ==============================
   SMART SUGGESTIONS
============================== */

export function getSmartSuggestions(message) {
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