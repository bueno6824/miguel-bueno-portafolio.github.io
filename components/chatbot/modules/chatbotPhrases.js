/* ==============================
   RANDOM ITEM
============================== */

export function getRandomItem(
  items = []
) {
  if (
    !Array.isArray(items) ||
    !items.length
  ) {
    return "";
  }

  const randomIndex =
    Math.floor(
      Math.random() *
      items.length
    );

  return items[randomIndex];
}


/* ==============================
   CONFIRMATIONS
============================== */

export function getConfirmationPhrase() {
  return getRandomItem([
    "Claro 🚀",
    "Por supuesto ✨",
    "Perfecto, vamos con eso.",
    "Buena elección 🔥",
    "Con gusto."
  ]);
}


/* ==============================
   PROJECT INTRO
============================== */

export function getProjectIntroPhrase() {
  return getRandomItem([
    "Encontré un proyecto que coincide con tu búsqueda:",
    "Este proyecto encaja bastante bien:",
    "Te recomiendo revisar este proyecto:",
    "Este resultado podría interesarte:",
    "Aquí tienes una opción relevante:"
  ]);
}


/* ==============================
   OPENING PROJECT
============================== */

export function getOpeningProjectPhrase(
  projectTitle
) {
  return getRandomItem([
    `🚀 Abriendo <strong>${projectTitle}</strong>.`,
    `Perfecto. Voy a mostrarte <strong>${projectTitle}</strong>.`,
    `Buena elección 🔥 Abriendo <strong>${projectTitle}</strong>.`,
    `Claro. Te llevo al proyecto <strong>${projectTitle}</strong>.`
  ]);
}


/* ==============================
   NO RESULT
============================== */

export function getNoResultPhrase() {
  return getRandomItem([
    "No encontré una coincidencia exacta 😅.",
    "No pude identificar un resultado preciso.",
    "No tengo suficiente información para responder eso todavía.",
    "Esa consulta no coincide directamente con los datos disponibles."
  ]);
}