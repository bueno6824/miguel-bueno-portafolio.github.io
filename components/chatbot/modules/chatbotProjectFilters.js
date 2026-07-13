import {
  getProjects
} from "./chatbotProjects.js";

import {
  chatbotContext
} from "./chatbotState.js";

import {
  normalizeText
} from "./chatbotUtils.js";

/* ==============================
   PROJECT FILTER RESPONSE
============================== */

export function getProjectFilterResponse(
  message
) {
  const normalizedMessage =
    normalizeText(message);

  if (!normalizedMessage) {
    return null;
  }

  if (
    !isProjectFilterRequest(
      normalizedMessage
    )
  ) {
    return null;
  }

  const projects =
    getProjects();

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

  const filters =
    detectProjectFilters(
      normalizedMessage,
      projects
    );

  if (!hasActiveFilters(filters)) {
    return null;
  }

  const filteredProjects =
    filterProjects(
      projects,
      filters
    );

  if (!filteredProjects.length) {
    return buildNoMatchesResponse(
      filters
    );
  }

  saveFilterContext(
    filteredProjects,
    filters
  );

  return buildFilterResponse(
    filteredProjects,
    filters
  );
}

function isProjectFilterRequest(
  message
) {
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

  return projectPatterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

function detectProjectFilters(
  message,
  projects
) {
  return {
    technologies:
      detectTechnologies(
        message,
        projects
      ),

    categories:
      detectCategories(
        message,
        projects
      ),

    levels:
      detectLevels(
        message,
        projects
      ),

    years:
      detectYears(message)
  };
}

function detectTechnologies(
  message,
  projects
) {
  const technologies =
    getUniqueValues(
      projects.flatMap(project =>
        Array.isArray(project.stack)
          ? project.stack
          : []
      )
    );

  return technologies.filter(
    technology =>
      message.includes(
        normalizeText(technology)
      )
  );
}

function detectCategories(
  message,
  projects
) {
  const projectCategories =
    getUniqueValues(
      projects
        .map(project =>
          project.categoria
        )
        .filter(Boolean)
    );

  const aliases = [
    {
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
      value: "Full Stack",
      patterns: [
        "full stack",
        "fullstack",
        "frontend y backend"
      ]
    }
  ];

  const detected = [];

  projectCategories.forEach(category => {
    if (
      message.includes(
        normalizeText(category)
      )
    ) {
      addUniqueValue(
        detected,
        category
      );
    }
  });

  aliases.forEach(alias => {
    const matched =
      alias.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      );

    if (matched) {
      const realCategory =
        projectCategories.find(category =>
          normalizeText(category) ===
          normalizeText(alias.value)
        );

      if (realCategory) {
        addUniqueValue(
          detected,
          realCategory
        );
      }
    }
  });

  return detected;
}

function detectLevels(
  message,
  projects
) {
  const projectLevels =
    getUniqueValues(
      projects
        .map(project =>
          project.nivel
        )
        .filter(Boolean)
    );

  const detected =
    projectLevels.filter(level =>
      message.includes(
        normalizeText(level)
      )
    );

  const aliases = [
    {
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
      patterns: [
        "intermedio",
        "nivel medio"
      ],
      expected: [
        "intermedio"
      ]
    },

    {
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

  aliases.forEach(alias => {
    const matchesAlias =
      alias.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      );

    if (!matchesAlias) {
      return;
    }

    const realLevel =
      projectLevels.find(level =>
        alias.expected.includes(
          normalizeText(level)
        )
      );

    if (realLevel) {
      addUniqueValue(
        detected,
        realLevel
      );
    }
  });

  return detected;
} 
 
function detectYears(message) {
  const yearMatches =
    message.match(
      /\b(?:19|20)\d{2}\b/g
    ) || [];

  return [
    ...new Set(
      yearMatches.map(Number)
    )
  ];
}

function hasActiveFilters(filters) {
  return (
    filters.technologies.length > 0 ||
    filters.categories.length > 0 ||
    filters.levels.length > 0 ||
    filters.years.length > 0
  );
}

function filterProjects(
  projects,
  filters
) {
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

function matchesTechnologies(
  project,
  technologies
) {
  if (!technologies.length) {
    return true;
  }

  const stack =
    Array.isArray(project.stack)
      ? project.stack.map(
          technology =>
            normalizeText(technology)
        )
      : [];

  return technologies.every(
    technology =>
      stack.includes(
        normalizeText(technology)
      )
  );
}

function matchesCategories(
  project,
  categories
) {
  if (!categories.length) {
    return true;
  }

  const projectCategory =
    normalizeText(
      project.categoria || ""
    );

  return categories.some(category =>
    projectCategory.includes(
      normalizeText(category)
    )
  );
}

function matchesLevels(
  project,
  levels
) {
  if (!levels.length) {
    return true;
  }

  const projectLevel =
    normalizeText(
      project.nivel || ""
    );

  return levels.some(level =>
    projectLevel.includes(
      normalizeText(level)
    )
  );
}

function matchesYears(
  project,
  years
) {
  if (!years.length) {
    return true;
  }

  const projectYear =
    Number.parseInt(
      project.año,
      10
    );

  return years.includes(
    projectYear
  );
}

function saveFilterContext(
  projects,
  filters
) {
  chatbotContext.lastTopic =
    "project-filter";

  chatbotContext.lastProjects =
    projects;

  chatbotContext.lastProjectsShown =
    projects;

  chatbotContext.lastTechnology =
    filters.technologies[0] ||
    null;

  chatbotContext.lastCategory =
    filters.categories[0] ||
    null;

  if (projects.length === 1) {
    chatbotContext.lastProject =
      projects[0];

    chatbotContext.lastMentionedProject =
      projects[0];
  }
}

function buildFilterResponse(
  projects,
  filters
) {
  const filterDescription =
    buildFilterDescription(
      filters
    );

  const projectCount =
    projects.length;

  return {
    answer: `
      Encontré
      <strong>${projectCount}</strong>
      ${
        projectCount === 1
          ? "proyecto"
          : "proyectos"
      }
      ${filterDescription} 🔎

      <br><br>

      ${
        projectCount === 1
          ? "Esta es la mejor coincidencia:"
          : "Estas son las coincidencias disponibles:"
      }
    `,

    projects,

    suggestions:
      buildFilterSuggestions(
        projects
      )
  };
}

function buildFilterDescription(
  filters
) {
  const descriptions = [];

  if (filters.categories.length) {
    descriptions.push(
      `de categoría <strong>${filters.categories.join(", ")}</strong>`
    );
  }

  if (filters.technologies.length) {
    descriptions.push(
      `con <strong>${filters.technologies.join(", ")}</strong>`
    );
  }

  if (filters.levels.length) {
    descriptions.push(
      `de nivel <strong>${filters.levels.join(", ")}</strong>`
    );
  }

  if (filters.years.length) {
    descriptions.push(
      `del año <strong>${filters.years.join(", ")}</strong>`
    );
  }

  return descriptions.length
    ? descriptions.join(" ")
    : "relacionados con tu búsqueda";
}

function buildNoMatchesResponse(
  filters
) {
  return {
    answer: `
      No encontré proyectos que cumplan
      todos los filtros solicitados 😅.

      <br><br>

      ${
        buildFilterDescription(
          filters
        )
      }

      <br><br>

      Puedes retirar alguna tecnología,
      categoría, nivel o año para ampliar
      los resultados.
    `,

    suggestions: [
      "ver proyectos",
      "proyectos frontend",
      "proyectos IoT"
    ]
  };
}

function buildFilterSuggestions(
  projects
) {
  if (projects.length === 1) {
    return [
      "abre el primero",
      "qué tecnologías usa",
      "tiene demo"
    ];
  }

  return [
    "abre el primero",
    "abre el último",
    "compáralos"
  ];
}

function getUniqueValues(values) {
  const uniqueValues = [];

  values.forEach(value => {
    addUniqueValue(
      uniqueValues,
      value
    );
  });

  return uniqueValues;
}

function addUniqueValue(
  collection,
  value
) {
  if (!value) {
    return;
  }

  const normalizedValue =
    normalizeText(value);

  const alreadyExists =
    collection.some(item =>
      normalizeText(item) ===
      normalizedValue
    );

  if (!alreadyExists) {
    collection.push(value);
  }
}

