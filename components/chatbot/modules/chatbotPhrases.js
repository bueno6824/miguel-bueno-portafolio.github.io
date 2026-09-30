/* ==============================
   RANDOM ITEM
============================== */

// Obtiene un elemento aleatorio de un arreglo.
// Se utiliza para variar las respuestas del chatbot.
export function getRandomItem(
  items = []
) {

  // Verifica que items sea realmente un arreglo
  // y que contenga al menos un elemento.
  if (
    !Array.isArray(items) ||
    !items.length
  ) {
    return "";
  }

  // Genera un índice aleatorio dentro del rango
  // disponible del arreglo.
  const randomIndex =
    Math.floor(
      Math.random() *
      items.length
    );

  // Devuelve el elemento ubicado en el índice aleatorio.
  return items[randomIndex];
}


/* ==============================
   CONFIRMATIONS
============================== */

// Genera una frase de confirmación aleatoria.
// Permite que el chatbot no utilice siempre la misma respuesta.
export function getConfirmationPhrase() {

  // Selecciona aleatoriamente una de las frases
  // utilizadas para confirmar una acción.
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

// Genera una introducción aleatoria para presentar
// un proyecto encontrado por el chatbot.
export function getProjectIntroPhrase() {

  // Selecciona una frase diferente de forma aleatoria
  // para introducir el proyecto al usuario.
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

// Genera una frase aleatoria cuando el chatbot
// va a abrir un proyecto específico.
export function getOpeningProjectPhrase(
  projectTitle
) {

  // Las frases utilizan el título del proyecto recibido
  // para personalizar el mensaje mostrado al usuario.
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

// Genera una respuesta aleatoria cuando el chatbot
// no encuentra un resultado que coincida con la consulta.
export function getNoResultPhrase() {

  // Selecciona una de las diferentes respuestas
  // disponibles para indicar que no hubo coincidencias.
  return getRandomItem([
    "No encontré una coincidencia exacta 😅.",
    "No pude identificar un resultado preciso.",
    "No tengo suficiente información para responder eso todavía.",
    "Esa consulta no coincide directamente con los datos disponibles."
  ]);
}