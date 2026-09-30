// ==========================================
// IMPORTACIONES
// ==========================================

// Importa la función encargada de procesar
// la selección de un proyecto desde el chatbot.
import {

  processProjectSelection

} from "./chatbotProjects.js";


// Importa utilidades para normalizar textos
// y comprobar coincidencias con palabras clave.
import {

  normalizeText,

  matchesKeyword

} from "./chatbotUtils.js";


// Importa el sistema encargado de generar
// sugerencias inteligentes para el chatbot.
import {

  getSmartSuggestions

} from "./chatbotSuggestions.js";


// ==========================================
// DESPLAZAMIENTO HACIA UNA SECCIÓN
// ==========================================

// Desplaza suavemente la página hasta la sección
// indicada mediante un selector CSS.
export function scrollToSection(selector) {

  // Verifica que exista un selector y que
  // sea una cadena de texto válida.
  if (

    !selector ||

    typeof selector !== "string"

  ) {

    return false;

  }


  // Busca en el documento el elemento
  // correspondiente al selector recibido.
  const section =

    document.querySelector(selector);


  // Si la sección no existe, muestra una advertencia
  // y detiene la ejecución.
  if (!section) {

    console.warn(

      `No se encontró la sección ${selector}`

    );

    return false;

  }


  // Altura aproximada de la barra de navegación.
  // Se utiliza para evitar que la sección quede
  // oculta debajo del navbar.
  const navbarOffset = 80;


  // Calcula la posición vertical de destino.
  // Toma la posición de la sección respecto al viewport,
  // agrega el desplazamiento actual de la página
  // y resta la altura del navbar.
  const targetPosition =

    section.getBoundingClientRect().top +

    window.scrollY -

    navbarOffset;


  // Realiza el desplazamiento suave hacia
  // la posición calculada.
  window.scrollTo({

    // Evita que el valor de desplazamiento
    // sea menor que cero.
    top: Math.max(targetPosition, 0),

    // Activa una animación de desplazamiento suave.
    behavior: "smooth"

  });


  // Indica que la acción se ejecutó correctamente.
  return true;

}


// ==========================================
// DETECCIÓN DEL CONTENEDOR CON SCROLL
// ==========================================

// Busca el primer elemento padre que tenga
// desplazamiento vertical disponible.
function findScrollContainer(element) {

  // Comienza revisando el elemento padre directo.
  let parent =

    element.parentElement;


  // Continúa recorriendo los padres
  // hasta encontrar un contenedor desplazable.
  while (parent) {

    // Obtiene los estilos calculados
    // del elemento actual.
    const styles =

      getComputedStyle(parent);


    // Obtiene la configuración de overflow vertical.
    const overflowY =

      styles.overflowY;


    // Comprueba si el elemento permite scroll vertical
    // y si realmente tiene contenido que desborda.
    const canScroll =

      (

        overflowY === "auto" ||

        overflowY === "scroll"

      ) &&

      parent.scrollHeight >

      parent.clientHeight;


    // Si el elemento puede desplazarse verticalmente,
    // se utiliza como contenedor de scroll.
    if (canScroll) {

      return parent;

    }


    // Continúa buscando en el siguiente elemento padre.
    parent =

      parent.parentElement;

  }


  // Si no existe un contenedor desplazable específico,
  // utiliza el elemento principal de desplazamiento
  // del documento como alternativa.
  return (

    document.scrollingElement ||

    document.documentElement

  );

}


// ==========================================
// DETECCIÓN DE ACCIONES DIRECTAS DE SECCIÓN
// ==========================================

// Analiza el mensaje del usuario para determinar
// si solicita ir directamente a una sección del portafolio.
export function getDirectSectionAction(message) {

  // Normaliza el mensaje para facilitar
  // las comparaciones de texto.
  const normalized =

    normalizeText(message);


  // Mapa de secciones disponibles.
  // Cada sección contiene las palabras clave que
  // pueden utilizarse para solicitarla.
  const sectionMap = [

    {

      // Palabras asociadas con la sección de inicio.
      keywords: [

        "inicio",

        "home",

        "hero"

      ],

      // Selector CSS de la sección.
      target: "#inicio",

      // Nombre que se mostrará al usuario.
      label: "inicio"

    },

    {

      // Palabras asociadas con la sección
      // de información personal.
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

      // Palabras asociadas con la sección
      // de habilidades.
      keywords: [

        "habilidades",

        "skills"

      ],

      target: "#skills",

      label: "habilidades"

    },

    {

      // Palabras asociadas con herramientas
      // y tecnologías.
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

      // Palabras asociadas con la ubicación
      // o el mapa.
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

      // Palabras asociadas con la sección
      // de contacto.
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


  // Busca la primera sección cuyas palabras clave
  // coincidan con el mensaje normalizado.
  const section =

    sectionMap.find(item =>

      item.keywords.some(keyword =>

        normalized.includes(

          normalizeText(keyword)

        )

      )

    );


  // Si no se encontró ninguna sección relacionada,
  // no se genera ninguna acción.
  if (!section) return null;


  // Devuelve la respuesta y la acción que
  // posteriormente podrá ejecutar el chatbot.
  return {

    // Mensaje que se mostrará al usuario.
    answer:

      `Claro 🚀 Te llevo a la sección de ${section.label}.`,

    // Genera sugerencias relacionadas con
    // la solicitud original.
    suggestions: getSmartSuggestions(message),

    // Define la acción que debe ejecutar
    // el sistema de navegación.
    action: {

      // Indica que la acción corresponde
      // a una sección del portafolio.
      type: "section",

      // Guarda el selector de la sección destino.
      target: section.target

    },

    // Indica que esta respuesta corresponde
    // directamente a una acción solicitada.
    direct: true

  };

}


// ==========================================
// EJECUCIÓN DE ACCIONES
// ==========================================

// Ejecuta una acción generada previamente
// por el sistema del chatbot.
export async function executeAction(action) {

  // Verifica que exista una acción válida
  // y que sea un objeto.
  if (!action || typeof action !== "object") {

    return false;

  }


  // ==========================================
  // ACCIÓN: LINK
  // ==========================================

  // Comprueba si la acción corresponde
  // a abrir un enlace externo.
  if (action.type === "link") {

    // Verifica que exista una URL.
    if (!action.url) {

      return false;

    }


    // Abre la URL en una nueva pestaña.
    // Las opciones indican que la nueva ventana
    // no debe conservar acceso al objeto opener
    // y que se aplican las características indicadas.
    window.open(

      action.url,

      "_blank",

      "noopener,noreferrer"

    );


    // Indica que el enlace fue ejecutado.
    return true;

  }


  // ==========================================
  // ACCIÓN: SECTION
  // ==========================================

  // Comprueba si la acción corresponde
  // a desplazarse hacia una sección.
  if (action.type === "section") {

    // Ejecuta el desplazamiento utilizando
    // el selector guardado en la acción.
    return scrollToSection(

      action.target

    );

  }


  // ==========================================
  // ACCIÓN: PROJECT
  // ==========================================

  // Comprueba si la acción corresponde
  // a seleccionar un proyecto.
  if (action.type === "project") {

    // Obtiene el identificador del proyecto.
    // Primero intenta utilizar projectId y,
    // si no existe, utiliza id como alternativa.
    const projectId =

      action.projectId ??

      action.id;


    // Si no existe un identificador válido,
    // no se puede procesar el proyecto.
    if (!projectId) {

      return false;

    }


    // Procesa la selección del proyecto.
    // showUserMessage y showBotMessage se desactivan
    // porque esta acción ya forma parte de una respuesta
    // existente del chatbot.
    return await processProjectSelection(

      projectId,

      {

        showUserMessage: false,

        showBotMessage: false

      }

    );

  }


  // ==========================================
  // ACCIÓN NO RECONOCIDA
  // ==========================================

  // Si el tipo de acción no coincide con ninguno
  // de los casos disponibles, muestra una advertencia.
  console.warn(

    "Tipo de acción no reconocido:",

    action

  );


  // Indica que la acción no pudo ejecutarse.
  return false;

}