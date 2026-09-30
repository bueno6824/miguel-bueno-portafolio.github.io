// Importa la función que obtiene la lista de proyectos
// utilizada por el sistema de análisis.
import {

  getProjects

} from "./chatbotProjects.js";

// Importa la función para normalizar textos
// antes de realizar comparaciones.
import {

  normalizeText

} from "./chatbotUtils.js";


/* ==============================
   ANALYSIS CACHE
============================== */

// Guarda en memoria el resultado del análisis
// para evitar recalcularlo innecesariamente.
let cachedAnalysis = null;

// Guarda la referencia de la lista de proyectos
// utilizada para generar el análisis almacenado.
let cachedProjectsReference = null;


/* ==============================
   PUBLIC ANALYSIS
============================== */

// Analiza todos los proyectos y devuelve
// información estadística y comparativa.
export function analyzeProjects({

  forceRefresh = false

} = {}) {

  // Obtiene la lista actual de proyectos.
  const projects =

    getProjects();

  // Si no se solicita una actualización forzada,
  // existe un análisis almacenado y la referencia
  // de proyectos sigue siendo la misma,
  // reutiliza el resultado anterior.
  if (

    !forceRefresh &&

    cachedAnalysis &&

    cachedProjectsReference === projects

  ) {

    return cachedAnalysis;

  }

  // Actualiza la referencia de los proyectos
  // utilizados para el nuevo análisis.
  cachedProjectsReference =

    projects;

  // Construye un nuevo análisis con
  // la lista actual de proyectos.
  cachedAnalysis =

    buildProjectsAnalysis(

      projects

    );

  // Devuelve y almacena el resultado generado.
  return cachedAnalysis;

}


/* ==============================
   CACHE RESET
============================== */

// Limpia completamente el análisis almacenado
// y la referencia de proyectos asociada.
export function resetProjectsAnalysis() {

  cachedAnalysis = null;

  cachedProjectsReference = null;

}


// Construye la información estadística
// de todos los proyectos recibidos.
function buildProjectsAnalysis(projects) {

  // Garantiza que el valor recibido sea un arreglo.
  // Si no lo es, utiliza un arreglo vacío.
  const safeProjects =

    Array.isArray(projects)

      ? projects

      : [];

  // Almacena cuántas veces aparece
  // cada tecnología.
  const technologyCount = {};

  // Almacena cuántos proyectos pertenecen
  // a cada categoría.
  const categoryCount = {};

  // Almacena cuántos proyectos existen
  // por cada nivel de dificultad.
  const levelCount = {};

  // Recorre todos los proyectos disponibles.
  safeProjects.forEach(project => {

    // Cuenta la categoría del proyecto.
    countCategory(

      categoryCount,

      project.categoria

    );

    // Cuenta el nivel del proyecto.
    countCategory(

      levelCount,

      project.nivel

    );

    // Obtiene el stack tecnológico del proyecto.
    // Si no existe o no es un arreglo,
    // utiliza un arreglo vacío.
    const stack =

      Array.isArray(project.stack)

        ? project.stack

        : [];

    // Recorre todas las tecnologías
    // utilizadas por el proyecto.
    stack.forEach(technology => {

      // Incrementa el contador correspondiente
      // para cada tecnología encontrada.
      countCategory(

        technologyCount,

        technology

      );

    });

  });

  // Devuelve el análisis completo
  // de los proyectos.
  return {

    // Número total de proyectos.
    totalProjects:

      safeProjects.length,

    // Lista completa de proyectos analizados.
    projects:

      safeProjects,

    // Conteo de tecnologías.
    technologies:

      technologyCount,

    // Conteo de categorías.
    categories:

      categoryCount,

    // Conteo de niveles.
    levels:

      levelCount,

    // Proyecto registrado más recientemente.
    latestProject:

      getLatestProjectFromList(

        safeProjects

      ),

    // Proyecto registrado más antiguamente.
    oldestProject:

      getOldestProjectFromList(

        safeProjects

      ),

    // Proyecto que utiliza más tecnologías.
    mostTechnologiesProject:

      getProjectWithMostTechnologies(

        safeProjects

      ),

    // Proyecto con mayor puntuación
    // estimada de complejidad.
    mostComplexProject:

      getMostComplexProject(

        safeProjects

      )

  };

}


// Incrementa el contador de una categoría,
// nivel o tecnología dentro de una colección.
function countCategory(

  collection,

  value

) {

  // Normaliza el valor para poder comparar
  // diferentes variantes del mismo texto.
  const normalizedValue =

    normalizeText(value);

  // Ignora valores vacíos o no válidos.
  if (!normalizedValue) {

    return;

  }

  // Busca si ya existe una clave equivalente
  // ignorando diferencias de formato.
  const existingKey =

    Object.keys(collection)

      .find(key =>

        normalizeText(key) ===

        normalizedValue

      );

  // Conserva la clave existente cuando se encuentra.
  // Si no existe, utiliza el valor original
  // convertido a texto y sin espacios extremos.
  const key =

    existingKey ||

    String(value).trim();

  // Incrementa el contador correspondiente.
  collection[key] =

    (collection[key] || 0) + 1;

}


// Obtiene el proyecto con el año
// más reciente de una lista.
function getLatestProjectFromList(

  projects

) {

  // Crea una copia para evitar modificar
  // directamente el arreglo original.
  return [...projects]

    // Ordena los proyectos de mayor a menor año.
    .sort((projectA, projectB) => {

      return (

        getProjectYear(projectB) -

        getProjectYear(projectA)

      );

    })[0] || null;

}


// Obtiene el proyecto con el año
// más antiguo de una lista.
function getOldestProjectFromList(

  projects

) {

  // Crea una copia para evitar modificar
  // directamente el arreglo original.
  return [...projects]

    // Ordena los proyectos de menor a mayor año.
    .sort((projectA, projectB) => {

      return (

        getProjectYear(projectA) -

        getProjectYear(projectB)

      );

    })[0] || null;

}


// Obtiene el año numérico de un proyecto.
function getProjectYear(project) {

  // Convierte el valor del año a un número entero.
  const year =

    Number.parseInt(

      project?.año,

      10

    );

  // Devuelve el año si es un número válido.
  // De lo contrario, devuelve 0.
  return Number.isFinite(year)

    ? year

    : 0;

}


// Busca el proyecto que contiene
// la mayor cantidad de tecnologías.
function getProjectWithMostTechnologies(

  projects

) {

  // Reduce la lista hasta encontrar
  // el proyecto con el stack más grande.
  return projects.reduce(

    (selectedProject, currentProject) => {

      // Si todavía no existe un proyecto seleccionado,
      // utiliza el proyecto actual.
      if (!selectedProject) {

        return currentProject;

      }

      // Obtiene la cantidad de tecnologías
      // del proyecto seleccionado.
      const selectedStackLength =

        Array.isArray(

          selectedProject.stack

        )

          ? selectedProject.stack.length

          : 0;

      // Obtiene la cantidad de tecnologías
      // del proyecto actual.
      const currentStackLength =

        Array.isArray(

          currentProject.stack

        )

          ? currentProject.stack.length

          : 0;

      // Conserva el proyecto que tenga
      // el stack tecnológico más grande.
      return currentStackLength >

        selectedStackLength

        ? currentProject

        : selectedProject;

    },

    // Valor inicial cuando todavía no existe
    // ningún proyecto seleccionado.
    null

  );

}


// Busca el proyecto con mayor
// puntuación estimada de complejidad.
function getMostComplexProject(

  projects

) {

  // Reduce la lista comparando
  // la puntuación de complejidad.
  return projects.reduce(

    (selectedProject, currentProject) => {

      // Si todavía no existe un proyecto seleccionado,
      // utiliza el proyecto actual.
      if (!selectedProject) {

        return currentProject;

      }

      // Calcula la complejidad del proyecto seleccionado.
      const selectedScore =

        calculateComplexityScore(

          selectedProject

        );

      // Calcula la complejidad del proyecto actual.
      const currentScore =

        calculateComplexityScore(

          currentProject

        );

      // Conserva el proyecto con
      // la mayor puntuación.
      return currentScore >

        selectedScore

        ? currentProject

        : selectedProject;

    },

    // Valor inicial cuando la lista está vacía.
    null

  );

}


// Calcula una puntuación estimada de complejidad
// para un proyecto.
export function calculateComplexityScore(

  project

) {

  // Un proyecto inexistente tiene
  // una complejidad de cero.
  if (!project) {

    return 0;

  }

  // Inicializa la puntuación.
  let score = 0;

  // Obtiene el stack tecnológico del proyecto.
  // Si no existe, utiliza un arreglo vacío.
  const stack =

    Array.isArray(project.stack)

      ? project.stack

      : [];

  // Cada tecnología aporta dos puntos
  // a la puntuación de complejidad.
  score += stack.length * 2;

  // Normaliza el nivel del proyecto.
  const level =

    normalizeText(project.nivel);

  // Define la puntuación asociada
  // a cada nivel de dificultad.
  const levelScores = {

    basico: 1,

    intermedio: 3,

    avanzado: 5

  };

  // Agrega la puntuación correspondiente
  // al nivel del proyecto.
  score +=

    levelScores[level] || 0;

  // Normaliza la categoría del proyecto.
  const category =

    normalizeText(

      project.categoria

    );

  // Define la puntuación asociada
  // a cada categoría.
  const categoryScores = {

    frontend: 2,

    backend: 3,

    fullstack: 5,

    "full stack": 5,

    iot: 4,

    movil: 3,

    escritorio: 3

  };

  // Agrega la puntuación correspondiente
  // a la categoría.
  score +=

    categoryScores[category] || 0;

  // Si existe una demo funcional,
  // agrega un punto adicional.
  if (

    project.demo &&

    project.demo !== "#"

  ) {

    score += 1;

  }

  // Si existe un enlace válido al código,
  // agrega otro punto.
  if (

    project.codigo &&

    project.codigo !== "#"

  ) {

    score += 1;

  }

  // Obtiene los elementos multimedia del proyecto.
  const media =

    Array.isArray(project.media)

      ? project.media

      : [];

  // Agrega puntos según la cantidad de multimedia,
  // con un máximo de tres puntos.
  score += Math.min(

    media.length,

    3

  );

  // Devuelve la puntuación final.
  return score;

}


// Obtiene todos los proyectos que utilizan
// una tecnología determinada.
export function getProjectsByTechnology(

  technology

) {

  // Normaliza el nombre de la tecnología
  // para facilitar la búsqueda.
  const normalizedTechnology =

    normalizeText(technology);

  // Si la tecnología está vacía,
  // devuelve un arreglo sin resultados.
  if (!normalizedTechnology) {

    return [];

  }

  // Filtra los proyectos que contienen
  // la tecnología solicitada.
  return getProjects().filter(project => {

    // Obtiene el stack tecnológico del proyecto.
    const stack =

      Array.isArray(project.stack)

        ? project.stack

        : [];

    // Comprueba si alguna tecnología del stack
    // contiene el término buscado.
    return stack.some(item =>

      normalizeText(item).includes(

        normalizedTechnology

      )

    );

  });

}


// Obtiene todos los proyectos
// pertenecientes a una categoría.
export function getProjectsByCategory(

  category

) {

  // Normaliza el nombre de la categoría.
  const normalizedCategory =

    normalizeText(category);

  // Si la categoría está vacía,
  // devuelve un arreglo sin resultados.
  if (!normalizedCategory) {

    return [];

  }

  // Filtra los proyectos cuya categoría
  // contiene el término solicitado.
  return getProjects().filter(project => {

    return normalizeText(

      project.categoria

    ).includes(

      normalizedCategory

    );

  });

}


// Obtiene la cantidad de proyectos
// que utilizan una tecnología determinada.
export function getTechnologyCount(

  technology

) {

  // Reutiliza la función de búsqueda por tecnología
  // y devuelve únicamente la cantidad de resultados.
  return getProjectsByTechnology(

    technology

  ).length;

}


// Obtiene la cantidad de proyectos
// pertenecientes a una categoría determinada.
export function getCategoryCount(

  category

) {

  // Reutiliza la función de búsqueda por categoría
  // y devuelve únicamente la cantidad de resultados.
  return getProjectsByCategory(

    category

  ).length;

}