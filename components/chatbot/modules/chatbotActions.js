import {
  processProjectSelection
} from "./chatbotProjects.js";

import {
  normalizeText,
  matchesKeyword
} from "./chatbotUtils.js";

import {
  getSmartSuggestions
} from "./chatbotSuggestions.js";

export function scrollToSection(selector) {
  if (
    !selector ||
    typeof selector !== "string"
  ) {
    return false;
  }

  const section =
    document.querySelector(selector);

  if (!section) {
    console.warn(
      `No se encontró la sección ${selector}`
    );

    return false;
  }

  const navbarOffset = 80;

  const targetPosition =
    section.getBoundingClientRect().top +
    window.scrollY -
    navbarOffset;

  window.scrollTo({
    top: Math.max(targetPosition, 0),
    behavior: "smooth"
  });

  return true;
}

function findScrollContainer(element) {
  let parent =
    element.parentElement;

  while (parent) {
    const styles =
      getComputedStyle(parent);

    const overflowY =
      styles.overflowY;

    const canScroll =
      (
        overflowY === "auto" ||
        overflowY === "scroll"
      ) &&
      parent.scrollHeight >
      parent.clientHeight;

    if (canScroll) {
      return parent;
    }

    parent =
      parent.parentElement;
  }

  return (
    document.scrollingElement ||
    document.documentElement
  );
}

export function getDirectSectionAction(message) {
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

export async function executeAction(action) {
  if (!action || typeof action !== "object") {
    return false;
  }

  if (action.type === "link") {
    if (!action.url) {
      return false;
    }

    window.open(
      action.url,
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }

  if (action.type === "section") {
    return scrollToSection(
      action.target
    );
  }

  if (action.type === "project") {
    const projectId =
      action.projectId ??
      action.id;

    if (!projectId) {
      return false;
    }

    return await processProjectSelection(
  projectId,
  {
    showUserMessage: false
  }
);
  }

  console.warn(
    "Tipo de acción no reconocido:",
    action
  );

  return false;
}