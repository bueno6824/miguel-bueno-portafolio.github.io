// Normaliza un texto para facilitar comparaciones y detección de palabras.
// Convierte a minúsculas, elimina acentos, reemplaza signos de puntuación
// y elimina espacios innecesarios al inicio, final y entre palabras.
export function normalizeText(text = "") {

  return String(text)

    // Convierte todo el texto a minúsculas.
    .toLowerCase()

    // Separa los caracteres acentuados de sus acentos.
    .normalize("NFD")

    // Elimina los signos diacríticos, como acentos y diéresis.
    .replace(

      /[\u0300-\u036f]/g,

      ""

    )

    // Reemplaza signos de puntuación por espacios.
    .replace(

      /[¿?¡!.,;:()"']/g,

      " "

    )

    // Reduce múltiples espacios consecutivos a uno solo.
    .replace(/\s+/g, " ")

    // Elimina espacios al principio y al final.
    .trim();

}

// Comprueba si un mensaje contiene una palabra o expresión determinada.
// Permite comparar tanto palabras individuales como frases completas.
export function matchesKeyword(message, keyword) {

  // Normaliza el mensaje recibido.
  const normalizedMessage =

    normalizeText(message);

  // Normaliza la palabra o expresión que se desea buscar.
  const normalizedKeyword =

    normalizeText(keyword);

  // Si ambos textos son exactamente iguales, existe coincidencia.
  if (

    normalizedMessage ===

    normalizedKeyword

  ) {

    return true;

  }

  // Si la palabra clave contiene espacios, se busca como una frase completa.
  if (

    normalizedKeyword.includes(" ")

  ) {

    return normalizedMessage.includes(

      normalizedKeyword

    );

  }

  // Divide el mensaje en palabras individuales.
  const words =

    normalizedMessage.split(/\s+/);

  // Comprueba si la palabra clave existe como una palabra independiente.
  return words.includes(

    normalizedKeyword

  );

}

// Determina si el mensaje del usuario representa una respuesta afirmativa.
export function isAffirmative(message) {

  // Normaliza el mensaje antes de comprobar las posibles respuestas.
  const normalizedMessage =

    normalizeText(message);

  // Lista de expresiones utilizadas para indicar una respuesta afirmativa.
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

    // Comprueba si alguna expresión afirmativa está presente en el mensaje.
    normalizedMessage.includes(

      normalizeText(word)

    )

  );

}

// Crea una pausa asíncrona durante la cantidad de milisegundos indicada.
export function wait(milliseconds) {

  // Devuelve una Promise que se resuelve después del tiempo especificado.
  return new Promise(resolve => {

    setTimeout(resolve, milliseconds);

  });

}