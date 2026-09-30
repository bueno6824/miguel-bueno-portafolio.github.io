// ==========================================
// CÁLCULO DE COMPLEJIDAD
// ==========================================

// Importa la función que calcula la puntuación
// de complejidad de un proyecto.
import {

  calculateComplexityScore

} from "../chatbotAnalysis.js";


// ==========================================
// MÉTRICAS DE COMPARACIÓN
// ==========================================

// Importa las funciones necesarias para obtener
// y comparar diferentes características de proyectos.
import {

  // Obtiene el stack tecnológico de un proyecto.
  getProjectStack,

  // Obtiene el año de un proyecto.
  getProjectYear,

  // Obtiene las tecnologías compartidas.
  getSharedTechnologies,

  // Obtiene las tecnologías exclusivas de cada proyecto.
  getUniqueTechnologies,

  // Comprueba si un proyecto utiliza una tecnología.
  projectUsesTechnology,

  // Compara la cantidad de tecnologías.
  compareTechnologyCount,

  // Compara la complejidad de los proyectos.
  compareComplexity,

  // Compara el año de los proyectos.
  compareProjectYears,

  // Calcula una puntuación general para cada proyecto.
  calculateGeneralProjectScore,

  // Calcula una puntuación orientada al contexto
  // de reclutamiento.
  calculateRecruiterScore

} from "./comparisonMetrics.js";


// ==========================================
// RESPUESTA GENERAL DE COMPARACIÓN
// ==========================================

// Construye la respuesta principal cuando el usuario
// solicita una comparación entre dos proyectos.
export function buildComparisonResponse(firstProject, secondProject) {

  // Obtiene las tecnologías utilizadas
  // por el primer proyecto.
  const firstStack =

    getProjectStack(firstProject);

  // Obtiene las tecnologías utilizadas
  // por el segundo proyecto.
  const secondStack =

    getProjectStack(secondProject);

  // Calcula la complejidad estimada
  // del primer proyecto.
  const firstComplexity =

    calculateComplexityScore(

      firstProject

    );

  // Calcula la complejidad estimada
  // del segundo proyecto.
  const secondComplexity =

    calculateComplexityScore(

      secondProject

    );

  // Obtiene las tecnologías presentes
  // en ambos proyectos.
  const sharedTechnologies =

    getSharedTechnologies(

      firstStack,

      secondStack

    );

  // Obtiene las tecnologías exclusivas
  // del primer proyecto.
  const firstUniqueTechnologies =

    getUniqueTechnologies(

      firstStack,

      secondStack

    );

  // Obtiene las tecnologías exclusivas
  // del segundo proyecto.
  const secondUniqueTechnologies =

    getUniqueTechnologies(

      secondStack,

      firstStack

    );

  // Determina qué proyecto tiene más tecnologías.
  const technologiesWinner =

    compareTechnologyCount(

      firstProject,

      secondProject

    );

  // Determina qué proyecto tiene mayor
  // puntuación de complejidad.
  const complexityWinner =

    compareComplexity(

      firstProject,

      secondProject

    );

  // Determina cuál de los dos proyectos
  // es más reciente.
  const recentWinner =

    compareProjectYears(

      firstProject,

      secondProject

    );


  // Devuelve el objeto de respuesta completo
  // utilizado por el chatbot.
  return {

    // Contenido HTML que se mostrará al usuario.
    answer: `

      <strong>⚖️ Comparación de proyectos</strong>

      <br><br>

      <strong>1. ${firstProject.titulo}</strong>

      <br>

      Categoría:

      <strong>${firstProject.categoria || "No especificada"}</strong>

      <br>

      Nivel:

      <strong>${firstProject.nivel || "No especificado"}</strong>

      <br>

      Año:

      <strong>${firstProject.año || "No especificado"}</strong>

      <br>

      Tecnologías:

      <strong>${firstStack.length}</strong>

      <br>

      Complejidad estimada:

      <strong>${firstComplexity}</strong>

      <br><br>

      <strong>2. ${secondProject.titulo}</strong>

      <br>

      Categoría:

      <strong>${secondProject.categoria || "No especificada"}</strong>

      <br>

      Nivel:

      <strong>${secondProject.nivel || "No especificado"}</strong>

      <br>

      Año:

      <strong>${secondProject.año || "No especificado"}</strong>

      <br>

      Tecnologías:

      <strong>${secondStack.length}</strong>

      <br>

      Complejidad estimada:

      <strong>${secondComplexity}</strong>

      <br><br>

      <strong>📊 Resultado</strong>

      <br><br>

      • Más tecnologías:

      <strong>${technologiesWinner}</strong>

      <br>

      • Mayor complejidad estimada:

      <strong>${complexityWinner}</strong>

      <br>

      • Más reciente:

      <strong>${recentWinner}</strong>

      ${buildTechnologiesComparison(

      sharedTechnologies,

      firstUniqueTechnologies,

      secondUniqueTechnologies,

      firstProject,

      secondProject

    )}

    `,

    // Proyectos que forman parte de la comparación.
    projects: [

      firstProject,

      secondProject

    ],

    // Sugerencias que el usuario puede seleccionar
    // después de recibir la comparación.
    suggestions: [

      "¿cuál es mejor para un reclutador?",

      "¿cuál es más complejo?",

      "ver proyectos"

    ]

  };

}


// ==========================================
// COMPARACIÓN DE CANTIDAD DE TECNOLOGÍAS
// ==========================================

// Construye una respuesta específica para indicar
// qué proyecto utiliza más tecnologías.
export function buildTechnologyCountResponse(firstProject, secondProject) {

  // Obtiene la cantidad de tecnologías
  // del primer proyecto.
  const firstCount =

    getProjectStack(

      firstProject

    ).length;

  // Obtiene la cantidad de tecnologías
  // del segundo proyecto.
  const secondCount =

    getProjectStack(

      secondProject

    ).length;


  // Comprueba si ambos proyectos tienen
  // exactamente la misma cantidad.
  if (firstCount === secondCount) {

    return {

      // Respuesta indicando el empate.
      answer: `

        Ambos proyectos utilizan la misma cantidad:

        <strong>${firstCount}</strong>

        tecnologías principales.

      `,

      // Mantiene ambos proyectos en el contexto.
      projects: [

        firstProject,

        secondProject

      ],

      // Devuelve sugerencias relacionadas
      // con la comparación.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Determina cuál proyecto tiene
  // mayor cantidad de tecnologías.
  const winner =

    firstCount > secondCount

      ? firstProject

      : secondProject;


  // Obtiene la cantidad mayor de tecnologías.
  const winnerCount =

    Math.max(

      firstCount,

      secondCount

    );


  // Obtiene la cantidad menor de tecnologías.
  const otherCount =

    Math.min(

      firstCount,

      secondCount

    );


  return {

    // Construye la respuesta indicando
    // la diferencia entre ambos proyectos.
    answer: `

      <strong>${winner.titulo}</strong>

      utiliza más tecnologías:

      <br><br>

      <strong>${winnerCount}</strong>

      frente a

      <strong>${otherCount}</strong>

      del otro proyecto.

    `,

    // Mantiene como proyecto principal
    // al proyecto con mayor cantidad de tecnologías.
    projects: [

      winner

    ],

    // Sugerencias posteriores.
    suggestions:

      getComparisonSuggestions()

  };

}


// ==========================================
// COMPARACIÓN DE COMPLEJIDAD
// ==========================================

// Construye una respuesta específica sobre
// la complejidad estimada de dos proyectos.
export function buildComplexityResponse(firstProject, secondProject) {

  // Calcula la puntuación del primer proyecto.
  const firstScore =

    calculateComplexityScore(

      firstProject

    );

  // Calcula la puntuación del segundo proyecto.
  const secondScore =

    calculateComplexityScore(

      secondProject

    );


  // Comprueba si ambos tienen la misma puntuación.
  if (firstScore === secondScore) {

    return {

      // Informa que existe un empate.
      answer: `

        Ambos proyectos tienen la misma puntuación

        estimada de complejidad:

        <strong>${firstScore}</strong>.

      `,

      // Mantiene ambos proyectos disponibles.
      projects: [

        firstProject,

        secondProject

      ],

      // Agrega sugerencias de comparación.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Determina qué proyecto tiene
  // la puntuación más alta.
  const winner =

    firstScore > secondScore

      ? firstProject

      : secondProject;


  // Obtiene la puntuación más alta.
  const winnerScore =

    Math.max(

      firstScore,

      secondScore

    );


  // Obtiene la puntuación más baja.
  const otherScore =

    Math.min(

      firstScore,

      secondScore

    );


  return {

    // Explica qué proyecto obtuvo
    // mayor complejidad estimada.
    answer: `

      Según el análisis del stack, nivel,

      categoría, multimedia y enlaces,

      <strong>${winner.titulo}</strong>

      es el más complejo.

      <br><br>

      Puntuación estimada:

      <strong>${winnerScore}</strong>

      frente a

      <strong>${otherScore}</strong>.

    `,

    // Mantiene como proyecto principal
    // al proyecto con mayor puntuación.
    projects: [

      winner

    ],

    // Sugerencias posteriores.
    suggestions:

      getComparisonSuggestions()

  };

}


// ==========================================
// COMPARACIÓN DE FECHAS
// ==========================================

// Construye una respuesta para determinar
// cuál de los dos proyectos es más reciente.
export function buildRecentResponse(firstProject, secondProject) {

  // Obtiene el año del primer proyecto.
  const firstYear =

    getProjectYear(

      firstProject

    );

  // Obtiene el año del segundo proyecto.
  const secondYear =

    getProjectYear(

      secondProject

    );


  // Comprueba si ambos proyectos pertenecen
  // al mismo año.
  if (firstYear === secondYear) {

    return {

      // Informa que ambos proyectos tienen
      // el mismo año registrado.
      answer: `

        Ambos proyectos están registrados en el año

        <strong>${firstYear || "no especificado"}</strong>.

      `,

      // Mantiene ambos proyectos disponibles.
      projects: [

        firstProject,

        secondProject

      ],

      // Agrega sugerencias relacionadas.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Determina qué proyecto tiene el año
  // más reciente.
  const winner =

    firstYear > secondYear

      ? firstProject

      : secondProject;


  return {

    // Indica cuál es el proyecto más reciente
    // y el año correspondiente.
    answer: `

      El más reciente es

      <strong>${winner.titulo}</strong>,

      registrado en

      <strong>${winner.año}</strong>.

    `,

    // Mantiene como proyecto principal
    // al proyecto más reciente.
    projects: [

      winner

    ],

    // Agrega sugerencias posteriores.
    suggestions:

      getComparisonSuggestions()

  };

}


// ==========================================
// COMPARAR USO DE UNA TECNOLOGÍA
// ==========================================

// Construye una respuesta para determinar
// qué proyecto utiliza una tecnología específica.
export function buildTechnologyUsageResponse(firstProject, secondProject, technology) {

  // Comprueba si el primer proyecto utiliza
  // la tecnología indicada.
  const firstUsesTechnology =

    projectUsesTechnology(

      firstProject,

      technology

    );

  // Comprueba si el segundo proyecto utiliza
  // la tecnología indicada.
  const secondUsesTechnology =

    projectUsesTechnology(

      secondProject,

      technology

    );


  // Si ambos proyectos utilizan la tecnología...
  if (

    firstUsesTechnology &&

    secondUsesTechnology

  ) {

    return {

      // Informa que ambos proyectos comparten
      // la tecnología consultada.
      answer: `

        Ambos proyectos utilizan

        <strong>${technology}</strong>.

      `,

      // Mantiene ambos proyectos disponibles.
      projects: [

        firstProject,

        secondProject

      ],

      // Sugerencias posteriores.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Si ninguno de los proyectos utiliza
  // la tecnología consultada...
  if (

    !firstUsesTechnology &&

    !secondUsesTechnology

  ) {

    return {

      // Informa que la tecnología no aparece
      // en ninguno de los stacks principales.
      answer: `

        Ninguno de los dos proyectos registra

        <strong>${technology}</strong>

        dentro de su stack principal.

      `,

      // No establece un proyecto específico
      // como resultado.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Determina cuál de los dos proyectos
  // utiliza la tecnología.
  const winner =

    firstUsesTechnology

      ? firstProject

      : secondProject;


  return {

    // Indica el proyecto que utiliza
    // la tecnología solicitada.
    answer: `

      El proyecto que utiliza

      <strong>${technology}</strong>

      es

      <strong>${winner.titulo}</strong>.

    `,

    // Mantiene como resultado el proyecto
    // que utiliza la tecnología.
    projects: [

      winner

    ],

    // Sugerencias posteriores.
    suggestions:

      getComparisonSuggestions()

  };

}


// ==========================================
// RECOMENDACIÓN GENERAL
// ==========================================

// Construye una respuesta cuando el usuario solicita
// una recomendación general entre dos proyectos.
export function buildGeneralRecommendation(firstProject, secondProject) {

  // Calcula la puntuación general del primer proyecto.
  const firstScore =

    calculateGeneralProjectScore(

      firstProject

    );

  // Calcula la puntuación general del segundo proyecto.
  const secondScore =

    calculateGeneralProjectScore(

      secondProject

    );


  // Si ambas puntuaciones son iguales,
  // presenta las fortalezas de ambos proyectos.
  if (firstScore === secondScore) {

    return {

      answer: `

        Los dos proyectos tienen fortalezas similares.

        <br><br>

        <strong>${firstProject.titulo}</strong>

        destaca por su enfoque

        <strong>${firstProject.categoria || "general"}</strong>,

        mientras que

        <strong>${secondProject.titulo}</strong>

        demuestra habilidades en

        <strong>${secondProject.categoria || "otra área"}</strong>.

        <br><br>

        La mejor elección depende del tipo de vacante

        o habilidad que quieras demostrar.

      `,

      // Conserva ambos proyectos en la respuesta.
      projects: [

        firstProject,

        secondProject

      ],

      // Agrega sugerencias relacionadas.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Determina qué proyecto obtuvo
  // la puntuación general más alta.
  const winner =

    firstScore > secondScore

      ? firstProject

      : secondProject;


  return {

    // Construye una recomendación basada
    // en la puntuación calculada.
    answer: `

      Como recomendación general elegiría

      <strong>${winner.titulo}</strong>.

      <br><br>

      Su combinación de tecnologías,

      complejidad, nivel y recursos disponibles

      lo convierte en una muestra más completa

      del trabajo realizado.

    `,

    // Devuelve como proyecto principal
    // el seleccionado por la puntuación.
    projects: [

      winner

    ],

    // Sugerencias posteriores.
    suggestions:

      getComparisonSuggestions()

  };

}


// ==========================================
// RECOMENDACIÓN PARA RECLUTADORES
// ==========================================

// Construye una respuesta específica para preguntas
// relacionadas con la presentación de proyectos
// ante un reclutador.
export function buildRecruiterRecommendation(firstProject, secondProject) {

  // Calcula la puntuación orientada al reclutamiento
  // para el primer proyecto.
  const firstScore =

    calculateRecruiterScore(

      firstProject

    );

  // Calcula la puntuación orientada al reclutamiento
  // para el segundo proyecto.
  const secondScore =

    calculateRecruiterScore(

      secondProject

    );


  // Si ambos proyectos obtienen la misma puntuación,
  // muestra las fortalezas diferenciadas de cada uno.
  if (firstScore === secondScore) {

    return {

      answer: `

        Para un reclutador, ambos proyectos aportan

        señales valiosas pero diferentes.

        <br><br>

        <strong>${firstProject.titulo}</strong>

        demuestra experiencia en

        <strong>${firstProject.categoria || "su área"}</strong>,

        mientras que

        <strong>${secondProject.titulo}</strong>

        muestra capacidades en

        <strong>${secondProject.categoria || "otra especialidad"}</strong>.

        <br><br>

        La elección dependería del perfil de la vacante.

      `,

      // Mantiene ambos proyectos como parte
      // del resultado de la comparación.
      projects: [

        firstProject,

        secondProject

      ],

      // Sugerencias posteriores.
      suggestions:

        getComparisonSuggestions()

    };

  }


  // Determina cuál proyecto obtuvo
  // la puntuación más alta para reclutadores.
  const winner =

    firstScore > secondScore

      ? firstProject

      : secondProject;


  return {

    // Construye la recomendación enfocada
    // en una presentación ante reclutadores.
    answer: `

      Para presentarlo a un reclutador,

      recomendaría

      <strong>${winner.titulo}</strong>.

      <br><br>

      Tiene una combinación más fuerte de stack,

      complejidad, documentación, código y

      demostración disponible.

      <br><br>

      Aun así, la recomendación puede cambiar según

      la vacante: Frontend, Full Stack, Backend o IoT.

    `,

    // Devuelve el proyecto recomendado
    // como resultado principal.
    projects: [

      winner

    ],

    // Sugerencias adaptadas a diferentes
    // perfiles profesionales.
    suggestions: [

      "busco un frontend",

      "busco un full stack",

      "ver proyectos"

    ]

  };

}


// ==========================================
// COMPARACIÓN DETALLADA DE TECNOLOGÍAS
// ==========================================

// Construye las secciones HTML que muestran
// tecnologías compartidas y exclusivas.
export function buildTechnologiesComparison(sharedTechnologies, firstUniqueTechnologies, secondUniqueTechnologies, firstProject, secondProject) {

  // Almacena las diferentes secciones de comparación
  // antes de unirlas en una sola respuesta.
  const sections = [];


  // Si existen tecnologías compartidas...
  if (sharedTechnologies.length) {

    // Agrega una sección indicando
    // las tecnologías presentes en ambos proyectos.
    sections.push(`

      <br><br>

      <strong>🤝 Tecnologías compartidas:</strong>

      <br>

      ${sharedTechnologies.join(", ")}

    `);

  }


  // Si el primer proyecto tiene tecnologías exclusivas...
  if (firstUniqueTechnologies.length) {

    // Agrega una sección con las tecnologías
    // que únicamente aparecen en el primer proyecto.
    sections.push(`

      <br><br>

      <strong>🔹 Exclusivas de ${firstProject.titulo}:</strong>

      <br>

      ${firstUniqueTechnologies.join(", ")}

    `);

  }


  // Si el segundo proyecto tiene tecnologías exclusivas...
  if (secondUniqueTechnologies.length) {

    // Agrega una sección con las tecnologías
    // que únicamente aparecen en el segundo proyecto.
    sections.push(`

      <br><br>

      <strong>🔸 Exclusivas de ${secondProject.titulo}:</strong>

      <br>

      ${secondUniqueTechnologies.join(", ")}

    `);

  }


  // Une todas las secciones generadas
  // en una única cadena HTML.
  return sections.join("");

}


// ==========================================
// SUGERENCIAS DE COMPARACIÓN
// ==========================================

// Devuelve las preguntas sugeridas que pueden utilizarse
// después de mostrar una comparación.
export function getComparisonSuggestions() {

  return [

    "¿cuál es más complejo?",

    "¿cuál usa más tecnologías?",

    "¿cuál es mejor para un reclutador?"

  ];

}