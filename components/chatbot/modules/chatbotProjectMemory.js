import {

  // Importa el contexto compartido del chatbot para
  // guardar información relacionada con el proyecto actual.
  chatbotContext

} from "./chatbotState.js";

import {

  // Importa la función utilizada para normalizar
  // los mensajes antes de realizar comparaciones.
  normalizeText

} from "./chatbotUtils.js";

import {

  // Obtiene el proyecto que actualmente está activo
  // dentro del contexto de la conversación.
  getActiveProject

} from "./chatbotConversationContext.js";


// Analiza el mensaje del usuario y determina si está
// solicitando información relacionada con el proyecto activo.
export function getProjectMemoryResponse(message) {

  // Normaliza el mensaje para facilitar la detección
  // de las diferentes consultas disponibles.
  const normalizedMessage =

    normalizeText(message);

  // Si el mensaje no contiene contenido válido,
  // no se genera ninguna respuesta.
  if (!normalizedMessage) {

    return null;

  }

  // Obtiene el proyecto actualmente activo
  // dentro del contexto de conversación.
  const project =

    getActiveProject();

  // Si no existe un proyecto activo,
  // este módulo no puede responder la consulta.
  if (!project) {

    return null;

  }

  // Comprueba las diferentes consultas relacionadas
  // con el proyecto y devuelve la primera respuesta válida.
  return (

    getProjectTechnologiesResponse(

      normalizedMessage,

      project

    ) ||

    getProjectDemoResponse(

      normalizedMessage,

      project

    ) ||

    getProjectCodeResponse(

      normalizedMessage,

      project

    ) ||

    getProjectYearResponse(

      normalizedMessage,

      project

    ) ||

    getProjectCategoryResponse(

      normalizedMessage,

      project

    ) ||

    getProjectLevelResponse(

      normalizedMessage,

      project

    ) ||

    getProjectDescriptionResponse(

      normalizedMessage,

      project

    ) ||

    getProjectOpenDemoResponse(

      normalizedMessage,

      project

    ) ||

    getProjectOpenCodeResponse(

      normalizedMessage,

      project

    ) ||

    null

  );

}


// Detecta si el usuario está preguntando por
// las tecnologías utilizadas por el proyecto.
function getProjectTechnologiesResponse(message, project) {

  // Patrones asociados con preguntas sobre tecnologías
  // y el stack utilizado por el proyecto.
  const patterns = [

    "que tecnologias usa",

    "que herramientas usa",

    "cual es su stack",

    "que stack tiene",

    "tecnologias",

    "stack"

  ];

  // Si el mensaje no coincide con ninguno
  // de los patrones, no corresponde a esta respuesta.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Obtiene el stack del proyecto asegurándose
  // de que sea un arreglo válido.
  const stack =

    Array.isArray(project.stack)

      ? project.stack

      : [];

  // Si el proyecto no tiene tecnologías registradas,
  // informa al usuario de esta situación.
  if (!stack.length) {

    return {

      answer:

        `No tengo tecnologías registradas para <strong>${project.titulo}</strong>.`,

      suggestions:

        getProjectMemorySuggestions()

    };

  }

  // Guarda la primera tecnología como referencia
  // dentro del contexto del chatbot.
  chatbotContext.lastTechnology =

    stack[0] || null;

  // Devuelve la lista de tecnologías utilizadas
  // por el proyecto actual.
  return {

    answer: `

      <strong>${project.titulo}</strong>

      utiliza:

      <br><br>

      ${stack

        .map(

          technology =>

            `• ${technology}`

        )

        .join("<br>")}

    `,

    // Mantiene el proyecto actual disponible
    // para las siguientes interacciones.
    projects: [

      project

    ],

    // Añade sugerencias relacionadas con
    // la información del proyecto.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Detecta preguntas relacionadas con la existencia
// de una demo pública del proyecto.
function getProjectDemoResponse(message, project) {

  // Patrones utilizados para identificar
  // preguntas sobre demos o sitios disponibles.
  const patterns = [

    "tiene demo",

    "hay demo",

    "tiene pagina",

    "se puede probar",

    "tiene sitio",

    "demo disponible"

  ];

  // Si el mensaje no coincide con los patrones,
  // no se procesa como consulta de demo.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Determina si existe una URL de demo válida.
  const hasDemo =

    Boolean(

      project.demo &&

      project.demo !== "#"

    );

  // Construye la respuesta dependiendo
  // de si el proyecto tiene demo disponible.
  return {

    answer: hasDemo

      ? `

        Sí 🚀

        <strong>${project.titulo}</strong>

        tiene una demo disponible.

      `

      : `

        No encontré una demo pública registrada para

        <strong>${project.titulo}</strong>.

      `,

    // Mantiene el proyecto como resultado
    // de la consulta actual.
    projects: [

      project

    ],

    // Si existe demo, ofrece acciones relacionadas
    // con ella; de lo contrario, utiliza sugerencias generales.
    suggestions: hasDemo

      ? [

        "abre la demo",

        "abre el código",

        "qué tecnologías usa"

      ]

      : getProjectMemorySuggestions()

  };

}


// Detecta preguntas relacionadas con el código
// o repositorio del proyecto.
function getProjectCodeResponse(

  message,

  project

) {

  // Patrones utilizados para detectar consultas
  // sobre GitHub y el código fuente.
  const patterns = [

    "tiene codigo",

    "hay codigo",

    "tiene github",

    "tiene repositorio",

    "codigo disponible",

    "repositorio disponible"

  ];

  // Si no existe coincidencia, no responde
  // a través de esta función.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Comprueba si el proyecto tiene una URL
  // de código válida.
  const hasCode =

    Boolean(

      project.codigo &&

      project.codigo !== "#"

    );

  // Genera la respuesta según la disponibilidad
  // del repositorio.
  return {

    answer: hasCode

      ? `

        Sí 💻

        El código de

        <strong>${project.titulo}</strong>

        está disponible.

      `

      : `

        No encontré un repositorio público registrado para

        <strong>${project.titulo}</strong>.

      `,

    // Devuelve el proyecto relacionado
    // con la consulta actual.
    projects: [

      project

    ],

    // Si existe código, ofrece acciones relacionadas
    // con el repositorio y la demo.
    suggestions: hasCode

      ? [

        "abre el código",

        "abre la demo",

        "qué tecnologías usa"

      ]

      : getProjectMemorySuggestions()

  };

}


// Detecta preguntas relacionadas con el año
// en que fue registrado o realizado el proyecto.
function getProjectYearResponse(

  message,

  project

) {

  // Patrones asociados con preguntas sobre fechas y años.
  const patterns = [

    "de que año es",

    "cuando lo hiciste",

    "cuando fue creado",

    "en que año",

    "que año es"

  ];

  // Si el mensaje no coincide con los patrones,
  // no se procesa como consulta de año.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Devuelve el año registrado para el proyecto.
  return {

    answer: `

      <strong>${project.titulo}</strong>

      está registrado en el año

      <strong>${project.año || "no especificado"}</strong>.

    `,

    // Conserva el proyecto relacionado con la respuesta.
    projects: [

      project

    ],

    // Ofrece las sugerencias generales del proyecto.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Detecta preguntas relacionadas con la categoría
// a la que pertenece el proyecto.
function getProjectCategoryResponse(message, project) {

  // Patrones utilizados para detectar preguntas
  // sobre la categoría o tipo del proyecto.
  const patterns = [

    "que categoria tiene",

    "que categoria es",

    "cual es su categoria",

    "cual es la categoria",

    "de que categoria es",

    "a que categoria pertenece",

    "de que tipo es",

    "es frontend",

    "es backend",

    "es web",

    "es iot"

  ];

  // Si no existe coincidencia con los patrones,
  // no genera una respuesta.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Obtiene la categoría del proyecto o utiliza
  // un texto alternativo si no está especificada.
  const category =

    project.categoria ||

    "no especificada";

  // Guarda la categoría actual como referencia
  // dentro del contexto del chatbot.
  chatbotContext.lastCategory =

    category;

  // Devuelve la categoría correspondiente al proyecto.
  return {

    answer: `

      <strong>${project.titulo}</strong>

      pertenece a la categoría

      <strong>${category}</strong>.

    `,

    // Mantiene el proyecto actual como resultado.
    projects: [

      project

    ],

    // Añade sugerencias para continuar consultando.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Detecta preguntas relacionadas con el nivel
// de dificultad o complejidad del proyecto.
function getProjectLevelResponse(

  message,

  project

) {

  // Patrones utilizados para detectar preguntas
  // sobre el nivel del proyecto.
  const patterns = [

    "que nivel tiene",

    "cual es su nivel",

    "es basico",

    "es intermedio",

    "es avanzado",

    "que tan avanzado es"

  ];

  // Si el mensaje no coincide con ningún patrón,
  // no se genera respuesta.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Devuelve el nivel registrado para el proyecto.
  return {

    answer: `

      El nivel registrado de

      <strong>${project.titulo}</strong>

      es

      <strong>${project.nivel || "no especificado"}</strong>.

    `,

    // Conserva el proyecto consultado.
    projects: [

      project

    ],

    // Añade sugerencias relacionadas con el proyecto.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Detecta preguntas relacionadas con la descripción,
// funcionamiento o propósito del proyecto.
function getProjectDescriptionResponse(message, project) {

  // Patrones utilizados para identificar
  // preguntas sobre la función o descripción.
  const patterns = [

    "que hace",

    "que hace este proyecto",

    "que hace el proyecto",

    "como funciona",

    "de que trata",

    "para que sirve",

    "cual es su funcion",

    "que funcion tiene",

    "explicame el proyecto",

    "descripcion del proyecto",

    "cuentame de ese proyecto",

    "cuentame sobre el proyecto"

  ];

  // Si el mensaje no coincide con ningún patrón,
  // no se procesa como consulta descriptiva.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Utiliza primero la descripción larga y,
  // si no existe, intenta utilizar la descripción corta.
  const description =

    project.descripcionLarga ||

    project.descripcionCorta ||

    "No hay una descripción disponible para este proyecto.";

  // Devuelve la descripción del proyecto.
  return {

    answer: `

      <strong>${project.titulo}</strong>

      <br><br>

      ${description}

    `,

    // Conserva el proyecto consultado.
    projects: [

      project

    ],

    // Añade sugerencias para continuar explorando
    // la información del proyecto.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Detecta solicitudes para abrir directamente
// la demo del proyecto.
function getProjectOpenDemoResponse(

  message,

  project

) {

  // Patrones utilizados para solicitar
  // la apertura de una demo o sitio.
  const patterns = [

    "abre la demo",

    "abre el sitio",

    "abre la pagina",

    "quiero probarlo",

    "muestra la demo"

  ];

  // Si no existe coincidencia,
  // no ejecuta ninguna acción.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Comprueba que exista una demo válida
  // antes de intentar abrirla.
  if (

    !project.demo ||

    project.demo === "#"

  ) {

    return {

      answer:

        `No encontré una demo pública para <strong>${project.titulo}</strong>.`,

      // Ofrece alternativas cuando no existe demo.
      suggestions:

        getProjectMemorySuggestions()

    };

  }

  // Construye una acción directa para abrir
  // la URL de la demo del proyecto.
  return {

    answer:

      `🚀 Abriendo la demo de <strong>${project.titulo}</strong>.`,

    action: {

      type: "link",

      url: project.demo

    },

    // Indica que la acción debe ejecutarse directamente.
    direct: true,

    // Añade sugerencias para continuar explorando.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Detecta solicitudes para abrir directamente
// el código o repositorio del proyecto.
function getProjectOpenCodeResponse(

  message,

  project

) {

  // Patrones utilizados para solicitar
  // la apertura del repositorio.
  const patterns = [

    "abre el codigo",

    "abre github",

    "abre el repositorio",

    "muestra el codigo",

    "quiero ver el repo",

    "abre el repo"

  ];

  // Si no existe coincidencia con los patrones,
  // no ejecuta ninguna acción.
  if (!matchesAny(message, patterns)) {

    return null;

  }

  // Comprueba que exista un repositorio válido
  // antes de intentar abrirlo.
  if (

    !project.codigo ||

    project.codigo === "#"

  ) {

    return {

      answer:

        `No encontré un repositorio público para <strong>${project.titulo}</strong>.`,

      // Ofrece sugerencias alternativas.
      suggestions:

        getProjectMemorySuggestions()

    };

  }

  // Construye una acción directa para abrir
  // la URL del repositorio.
  return {

    answer:

      `💻 Abriendo el código de <strong>${project.titulo}</strong>.`,

    action: {

      type: "link",

      url: project.codigo

    },

    // Indica que la acción debe ejecutarse inmediatamente.
    direct: true,

    // Añade sugerencias relacionadas con el proyecto.
    suggestions:

      getProjectMemorySuggestions()

  };

}


// Comprueba si el mensaje coincide con
// alguno de los patrones proporcionados.
function matchesAny(message, patterns = []) {

  // Normaliza el mensaje antes de realizar
  // las comparaciones.
  const normalizedMessage =

    normalizeText(message);

  // Revisa cada patrón y determina si aparece
  // dentro del mensaje normalizado.
  return patterns.some(pattern => {

    // Normaliza el patrón actual para que
    // la comparación sea consistente.
    const normalizedPattern =

      normalizeText(pattern);

    // Comprueba si el patrón normalizado
    // está contenido dentro del mensaje.
    return normalizedMessage.includes(

      normalizedPattern

    );

  });

}


// Devuelve las sugerencias generales utilizadas
// para continuar consultando información del proyecto.
function getProjectMemorySuggestions() {

  return [

    "qué tecnologías usa",

    "tiene demo",

    "tiene código"

  ];

}