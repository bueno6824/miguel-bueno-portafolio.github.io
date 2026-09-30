import {

  // Importa la función que normaliza los textos
  // para facilitar las comparaciones.
  getProjects

} from "./chatbotProjects.js";

import {

  // Importa el contexto global utilizado por el chatbot
  // para conservar información de la conversación.
  chatbotContext

} from "./chatbotState.js";

import {

  // Importa la función encargada de normalizar mensajes
  // y valores antes de compararlos.
  normalizeText

} from "./chatbotUtils.js";


/* ==============================
   PROJECT FILTER RESPONSE
============================== */

// Analiza un mensaje y determina si el usuario
// está solicitando proyectos mediante filtros.
export function getProjectFilterResponse(

  message

) {

  // Normaliza el mensaje recibido para poder
  // compararlo con los patrones definidos.
  const normalizedMessage =

    normalizeText(message);

  // Si no existe contenido después de normalizar,
  // no se puede procesar una búsqueda.
  if (!normalizedMessage) {

    return null;

  }

  // Comprueba si el mensaje realmente corresponde
  // a una solicitud de filtrado de proyectos.
  if (

    !isProjectFilterRequest(

      normalizedMessage

    )

  ) {

    return null;

  }

  // Obtiene todos los proyectos disponibles.
  const projects =

    getProjects();

  // Si todavía no existen proyectos disponibles,
  // devuelve una respuesta informativa.
  if (!projects.length) {

    return {

      answer:

        "Los proyectos todavía no están disponibles 😅.",

      suggestions: [

        "herramientas",

        "contacto",

        "github"

      ]

    };

  }

  // Detecta los diferentes filtros solicitados
  // dentro del mensaje del usuario.
  const filters =

    detectProjectFilters(

      normalizedMessage,

      projects

    );

  // Si no se detectó ningún filtro válido,
  // permite que otros módulos procesen la consulta.
  if (!hasActiveFilters(filters)) {

    return null;

  }

  // Aplica los filtros detectados sobre la lista
  // completa de proyectos.
  const filteredProjects =

    filterProjects(

      projects,

      filters

    );

  // Si ningún proyecto cumple con los filtros,
  // construye una respuesta indicando que no hubo coincidencias.
  if (!filteredProjects.length) {

    return buildNoMatchesResponse(

      filters

    );

  }

  // Guarda los resultados y filtros actuales
  // dentro del contexto del chatbot.
  saveFilterContext(

    filteredProjects,

    filters

  );

  // Construye la respuesta final con los proyectos
  // encontrados y las sugerencias correspondientes.
  return buildFilterResponse(

    filteredProjects,

    filters

  );

}

// Determina si el mensaje contiene señales
// relacionadas con una búsqueda de proyectos.
function isProjectFilterRequest(

  message

) {

  // Patrones generales que indican que el usuario
  // está buscando algún tipo de proyecto.
  const projectPatterns = [

    "proyecto",

    "proyectos",

    "muestrame algo",

    "quiero ver algo",

    "tienes algo",

    "ensename algo",

    "busco algo",

    "algo hecho con",

    "algo de"

  ];

  // Comprueba si alguno de los patrones
  // aparece dentro del mensaje normalizado.
  return projectPatterns.some(pattern =>

    message.includes(

      normalizeText(pattern)

    )

  );

}

// Detecta todos los tipos de filtros disponibles
// que aparecen dentro del mensaje.
function detectProjectFilters(

  message,

  projects

) {

  // Devuelve un objeto agrupando los filtros
  // detectados por categoría.
  return {

    // Tecnologías solicitadas.
    technologies:

      detectTechnologies(

        message,

        projects

      ),

    // Categorías de proyectos solicitadas.
    categories:

      detectCategories(

        message,

        projects

      ),

    // Niveles de dificultad solicitados.
    levels:

      detectLevels(

        message,

        projects

      ),

    // Años mencionados en la consulta.
    years:

      detectYears(message)

  };

}

// Detecta tecnologías mencionadas por el usuario
// comparándolas contra los stacks de los proyectos.
function detectTechnologies(

  message,

  projects

) {

  // Obtiene una lista sin valores repetidos
  // con todas las tecnologías utilizadas.
  const technologies =

    getUniqueValues(

      projects.flatMap(project =>

        Array.isArray(project.stack)

          ? project.stack

          : []

      )

    );

  // Devuelve únicamente las tecnologías que aparecen
  // dentro del mensaje del usuario.
  return technologies.filter(

    technology =>

      message.includes(

        normalizeText(technology)

      )

  );

}

// Detecta categorías de proyectos solicitadas
// directamente o mediante alias.
function detectCategories(

  message,

  projects

) {

  // Obtiene todas las categorías existentes
  // entre los proyectos disponibles.
  const projectCategories =

    getUniqueValues(

      projects

        .map(project =>

          project.categoria

        )

        .filter(Boolean)

    );

  // Define expresiones alternativas que pueden
  // utilizarse para referirse a una categoría.
  const aliases = [

    {

      // Categoría relacionada con desarrollo web.
      value: "Web",

      patterns: [

        "web",

        "frontend",

        "front end",

        "pagina web",

        "sitio web"

      ]

    },

    {

      // Categoría relacionada con IoT y hardware.
      value: "IoT",

      patterns: [

        "iot",

        "hardware",

        "arduino",

        "sensores",

        "sistemas embebidos"

      ]

    },

    {

      // Categoría relacionada con desarrollo backend.
      value: "Backend",

      patterns: [

        "backend",

        "back end",

        "servidor",

        "api",

        "base de datos"

      ]

    },

    {

      // Categoría relacionada con proyectos Full Stack.
      value: "Full Stack",

      patterns: [

        "full stack",

        "fullstack",

        "frontend y backend"

      ]

    }

  ];

  // Almacena las categorías detectadas
  // evitando valores duplicados.
  const detected = [];

  // Revisa cada categoría existente en los proyectos.
  projectCategories.forEach(category => {

    // Comprueba si la categoría aparece
    // directamente dentro del mensaje.
    if (

      message.includes(

        normalizeText(category)

      )

    ) {

      // Añade la categoría si todavía no existe
      // dentro de la lista de resultados.
      addUniqueValue(

        detected,

        category

      );

    }

  });

  // Revisa los alias definidos para detectar
  // categorías mediante expresiones alternativas.
  aliases.forEach(alias => {

    // Comprueba si alguno de los patrones del alias
    // aparece en el mensaje.
    const matched =

      alias.patterns.some(pattern =>

        message.includes(

          normalizeText(pattern)

        )

      );

    // Continúa solamente si se encontró
    // una coincidencia con el alias.
    if (matched) {

      // Busca la categoría real correspondiente
      // dentro de las categorías existentes.
      const realCategory =

        projectCategories.find(category =>

          normalizeText(category) ===

          normalizeText(alias.value)

        );

      // Si existe la categoría real,
      // la agrega a los resultados.
      if (realCategory) {

        addUniqueValue(

          detected,

          realCategory

        );

      }

    }

  });

  // Devuelve las categorías detectadas.
  return detected;

}

// Detecta los niveles de dificultad solicitados.
function detectLevels(

  message,

  projects

) {

  // Obtiene los niveles disponibles actualmente
  // entre los proyectos.
  const projectLevels =

    getUniqueValues(

      projects

        .map(project =>

          project.nivel

        )

        .filter(Boolean)

    );

  // Busca coincidencias directas entre los niveles
  // disponibles y el mensaje.
  const detected =

    projectLevels.filter(level =>

      message.includes(

        normalizeText(level)

      )

    );

  // Define expresiones alternativas para los diferentes niveles.
  const aliases = [

    {

      // Expresiones asociadas con un nivel básico.
      patterns: [

        "facil",

        "sencillo",

        "basico",

        "principiante"

      ],

      expected: [

        "basico",

        "básico"

      ]

    },

    {

      // Expresiones asociadas con un nivel intermedio.
      patterns: [

        "intermedio",

        "nivel medio"

      ],

      expected: [

        "intermedio"

      ]

    },

    {

      // Expresiones asociadas con un nivel avanzado.
      patterns: [

        "avanzado",

        "complejo",

        "dificil",

        "mayor nivel"

      ],

      expected: [

        "avanzado"

      ]

    }

  ];

  // Comprueba cada grupo de alias.
  aliases.forEach(alias => {

    // Determina si alguno de los patrones
    // aparece dentro del mensaje.
    const matchesAlias =

      alias.patterns.some(pattern =>

        message.includes(

          normalizeText(pattern)

        )

      );

    // Si no existe coincidencia,
    // pasa al siguiente alias.
    if (!matchesAlias) {

      return;

    }

    // Busca el nivel real correspondiente
    // entre los niveles disponibles.
    const realLevel =

      projectLevels.find(level =>

        alias.expected.includes(

          normalizeText(level)

        )

      );

    // Si se encontró un nivel válido,
    // se añade a la lista de resultados.
    if (realLevel) {

      addUniqueValue(

        detected,

        realLevel

      );

    }

  });

  // Devuelve todos los niveles detectados.
  return detected;

}

// Detecta años de cuatro dígitos dentro del mensaje.
function detectYears(message) {

  // Busca años que comiencen por 19 o 20.
  const yearMatches =

    message.match(

      /\b(?:19|20)\d{2}\b/g

    ) || [];

  // Convierte los años encontrados a números
  // y elimina posibles duplicados.
  return [

    ...new Set(

      yearMatches.map(Number)

    )

  ];

}

// Comprueba si existe al menos un filtro activo.
function hasActiveFilters(filters) {

  // Un filtro está activo cuando existe
  // al menos una tecnología, categoría, nivel o año.
  return (

    filters.technologies.length > 0 ||

    filters.categories.length > 0 ||

    filters.levels.length > 0 ||

    filters.years.length > 0

  );

}

// Aplica todos los filtros sobre la lista de proyectos.
function filterProjects(

  projects,

  filters

) {

  // Conserva únicamente los proyectos
  // que cumplen todos los filtros activos.
  return projects.filter(project => {

    return (

      matchesTechnologies(

        project,

        filters.technologies

      ) &&

      matchesCategories(

        project,

        filters.categories

      ) &&

      matchesLevels(

        project,

        filters.levels

      ) &&

      matchesYears(

        project,

        filters.years

      )

    );

  });

}

// Comprueba si un proyecto utiliza
// las tecnologías solicitadas.
function matchesTechnologies(

  project,

  technologies

) {

  // Si no se solicitaron tecnologías,
  // todos los proyectos cumplen este filtro.
  if (!technologies.length) {

    return true;

  }

  // Obtiene el stack del proyecto normalizado.
  const stack =

    Array.isArray(project.stack)

      ? project.stack.map(

        technology =>

          normalizeText(technology)

      )

      : [];

  // Comprueba que todas las tecnologías solicitadas
  // estén presentes en el stack del proyecto.
  return technologies.every(

    technology =>

      stack.includes(

        normalizeText(technology)

      )

  );

}

// Comprueba si un proyecto pertenece
// a alguna de las categorías solicitadas.
function matchesCategories(

  project,

  categories

) {

  // Si no se solicitaron categorías,
  // todos los proyectos cumplen este filtro.
  if (!categories.length) {

    return true;

  }

  // Obtiene y normaliza la categoría del proyecto.
  const projectCategory =

    normalizeText(

      project.categoria || ""

    );

  // Comprueba si alguna categoría solicitada
  // coincide con la categoría del proyecto.
  return categories.some(category =>

    projectCategory.includes(

      normalizeText(category)

    )

  );

}

// Comprueba si un proyecto corresponde
// a alguno de los niveles solicitados.
function matchesLevels(

  project,

  levels

) {

  // Si no se solicitaron niveles,
  // todos los proyectos cumplen este filtro.
  if (!levels.length) {

    return true;

  }

  // Obtiene y normaliza el nivel del proyecto.
  const projectLevel =

    normalizeText(

      project.nivel || ""

    );

  // Comprueba si alguno de los niveles solicitados
  // coincide con el nivel del proyecto.
  return levels.some(level =>

    projectLevel.includes(

      normalizeText(level)

    )

  );

}

// Comprueba si el año del proyecto
// coincide con alguno de los años solicitados.
function matchesYears(

  project,

  years

) {

  // Si no se solicitaron años,
  // todos los proyectos cumplen este filtro.
  if (!years.length) {

    return true;

  }

  // Convierte el año del proyecto a número
  // para poder compararlo con los años detectados.
  const projectYear =

    Number.parseInt(

      project.año,

      10

    );

  // Comprueba si el año del proyecto
  // se encuentra entre los años solicitados.
  return years.includes(

    projectYear

  );

}

// Guarda los resultados del filtrado dentro
// del contexto utilizado por el chatbot.
function saveFilterContext(

  projects,

  filters

) {

  // Indica que el tema actual de la conversación
  // corresponde al filtrado de proyectos.
  chatbotContext.lastTopic =

    "project-filter";

  // Guarda los proyectos filtrados como
  // los proyectos actualmente disponibles.
  chatbotContext.lastProjects =

    projects;

  // Guarda los proyectos que fueron mostrados al usuario.
  chatbotContext.lastProjectsShown =

    projects;

  // Guarda la primera tecnología utilizada como filtro.
  chatbotContext.lastTechnology =

    filters.technologies[0] ||

    null;

  // Guarda la primera categoría utilizada como filtro.
  chatbotContext.lastCategory =

    filters.categories[0] ||

    null;

  // Si solamente existe un proyecto,
  // lo establece como proyecto actual.
  if (projects.length === 1) {

    chatbotContext.lastProject =

      projects[0];

    chatbotContext.lastMentionedProject =

      projects[0];

  }

}

// Construye la respuesta final cuando existen
// proyectos que coinciden con los filtros.
function buildFilterResponse(

  projects,

  filters

) {

  // Genera una descripción textual de los filtros aplicados.
  const filterDescription =

    buildFilterDescription(

      filters

    );

  // Obtiene la cantidad de proyectos encontrados.
  const projectCount =

    projects.length;

  // Devuelve la respuesta junto con los proyectos
  // y las sugerencias disponibles.
  return {

    answer: `

      Encontré

      <strong>${projectCount}</strong>

      ${projectCount === 1

        ? "proyecto"

        : "proyectos"

      }

      ${filterDescription} 🔎

      <br><br>

      ${projectCount === 1

        ? "Esta es la mejor coincidencia:"

        : "Estas son las coincidencias disponibles:"

      }

    `,

    // Proyectos que cumplen con los filtros.
    projects,

    // Sugerencias para continuar interactuando
    // con los resultados encontrados.
    suggestions:

      buildFilterSuggestions(

        projects

      )

  };

}

// Construye una descripción legible
// de todos los filtros activos.
function buildFilterDescription(

  filters

) {

  // Almacena cada parte de la descripción.
  const descriptions = [];

  // Añade la categoría cuando existe.
  if (filters.categories.length) {

    descriptions.push(

      `de categoría <strong>${filters.categories.join(", ")}</strong>`

    );

  }

  // Añade las tecnologías cuando existen.
  if (filters.technologies.length) {

    descriptions.push(

      `con <strong>${filters.technologies.join(", ")}</strong>`

    );

  }

  // Añade los niveles cuando existen.
  if (filters.levels.length) {

    descriptions.push(

      `de nivel <strong>${filters.levels.join(", ")}</strong>`

    );

  }

  // Añade los años cuando existen.
  if (filters.years.length) {

    descriptions.push(

      `del año <strong>${filters.years.join(", ")}</strong>`

    );

  }

  // Une todas las descripciones encontradas.
  // Si no existe ninguna, utiliza un texto genérico.
  return descriptions.length

    ? descriptions.join(" ")

    : "relacionados con tu búsqueda";

}

// Construye la respuesta cuando ningún proyecto
// cumple todos los filtros solicitados.
function buildNoMatchesResponse(

  filters

) {

  // Devuelve el mensaje explicando que no hubo coincidencias
  // junto con sugerencias para ampliar la búsqueda.
  return {

    answer: `

      No encontré proyectos que cumplan

      todos los filtros solicitados 😅.

      <br><br>

      ${buildFilterDescription(

      filters

    )

      }

      <br><br>

      Puedes retirar alguna tecnología,

      categoría, nivel o año para ampliar

      los resultados.

    `,

    // Opciones para realizar nuevas búsquedas.
    suggestions: [

      "ver proyectos",

      "proyectos frontend",

      "proyectos IoT"

    ]

  };

}

// Genera sugerencias dependiendo de la cantidad
// de proyectos encontrados.
function buildFilterSuggestions(

  projects

) {

  // Cuando existe un solo proyecto,
  // las sugerencias se enfocan en conocerlo mejor.
  if (projects.length === 1) {

    return [

      "abre el primero",

      "qué tecnologías usa",

      "tiene demo"

    ];

  }

  // Cuando existen varios proyectos,
  // permite navegar o compararlos.
  return [

    "abre el primero",

    "abre el último",

    "compáralos"

  ];

}

// Obtiene valores únicos de una colección.
function getUniqueValues(values) {

  // Arreglo donde se almacenarán
  // los valores sin duplicados.
  const uniqueValues = [];

  // Recorre todos los valores recibidos.
  values.forEach(value => {

    // Añade cada valor utilizando la función
    // que controla los duplicados.
    addUniqueValue(

      uniqueValues,

      value

    );

  });

  // Devuelve la colección de valores únicos.
  return uniqueValues;

}

// Añade un valor a una colección solamente
// cuando todavía no existe.
function addUniqueValue(

  collection,

  value

) {

  // Ignora valores vacíos o inexistentes.
  if (!value) {

    return;

  }

  // Normaliza el valor para poder compararlo
  // independientemente de mayúsculas o acentos.
  const normalizedValue =

    normalizeText(value);

  // Comprueba si ya existe un elemento equivalente
  // dentro de la colección.
  const alreadyExists =

    collection.some(item =>

      normalizeText(item) ===

      normalizedValue

    );

  // Solo agrega el valor cuando todavía
  // no existe dentro de la colección.
  if (!alreadyExists) {

    collection.push(value);

  }

}