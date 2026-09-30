// ==========================================
// NORMALIZACIÓN DE TEXTO
// ==========================================

// Importa la función utilizada para normalizar textos
// antes de realizar comparaciones entre cadenas.
import {

  normalizeText

} from "../chatbotUtils.js";


// ==========================================
// CÁLCULO DE COMPLEJIDAD
// ==========================================

// Importa la función encargada de calcular
// el nivel de complejidad de un proyecto.
import {

  calculateComplexityScore

} from "../chatbotAnalysis.js";


// ==========================================
// OBTENER STACK DEL PROYECTO
// ==========================================

// Devuelve la lista de tecnologías utilizadas
// por un proyecto.
export function getProjectStack(project) {

  // Comprueba que la propiedad "stack" exista
  // y sea realmente un arreglo.
  return Array.isArray(project?.stack)

    // Si es un arreglo, devuelve el stack del proyecto.
    ? project.stack

    // Si no existe o no es un arreglo,
    // devuelve un arreglo vacío.
    : [];

}


// ==========================================
// OBTENER AÑO DEL PROYECTO
// ==========================================

// Obtiene y convierte el año del proyecto
// a un número entero válido.
export function getProjectYear(project) {

  // Convierte el valor del año a un número entero.
  const year =

    Number.parseInt(

      project?.año,

      10

    );

  // Comprueba que el resultado sea un número finito.
  // Si lo es, devuelve el año; de lo contrario, devuelve 0.
  return Number.isFinite(year)

    ? year

    : 0;

}


// ==========================================
// OBTENER TECNOLOGÍAS COMPARTIDAS
// ==========================================

// Encuentra las tecnologías que aparecen
// en ambos proyectos.
export function getSharedTechnologies(firstStack, secondStack) {

  // Filtra las tecnologías del primer proyecto
  // buscando coincidencias en el segundo stack.
  return firstStack.filter(

    technology =>

      secondStack.some(item =>

        // Normaliza ambos nombres para evitar diferencias
        // causadas por mayúsculas, minúsculas o formato.
        normalizeText(item) ===

        normalizeText(technology)

      )

  );

}


// ==========================================
// OBTENER TECNOLOGÍAS EXCLUSIVAS
// ==========================================

// Obtiene las tecnologías que pertenecen al stack origen
// pero que no aparecen en el stack de comparación.
export function getUniqueTechnologies(sourceStack, comparisonStack) {

  // Filtra el stack origen eliminando las tecnologías
  // que también existen en el stack de comparación.
  return sourceStack.filter(

    technology =>

      !comparisonStack.some(item =>

        // Compara las tecnologías después de normalizarlas.
        normalizeText(item) ===

        normalizeText(technology)

      )

  );

}


// ==========================================
// COMPROBAR USO DE UNA TECNOLOGÍA
// ==========================================

// Determina si un proyecto utiliza una tecnología específica.
export function projectUsesTechnology(project, technology) {

  // Normaliza el nombre de la tecnología buscada.
  const normalizedTechnology =

    normalizeText(technology);

  // Busca la tecnología dentro del stack del proyecto.
  return getProjectStack(

    project

  ).some(item =>

    // Compara el nombre normalizado de cada tecnología
    // con la tecnología que se está buscando.
    normalizeText(item) ===

    normalizedTechnology

  );

}


// ==========================================
// COMPARAR CANTIDAD DE TECNOLOGÍAS
// ==========================================

// Compara cuántas tecnologías utiliza cada proyecto.
export function compareTechnologyCount(firstProject, secondProject) {

  // Obtiene la cantidad de tecnologías del primer proyecto.
  const firstCount =

    getProjectStack(

      firstProject

    ).length;

  // Obtiene la cantidad de tecnologías del segundo proyecto.
  const secondCount =

    getProjectStack(

      secondProject

    ).length;

  // Si ambos tienen la misma cantidad,
  // devuelve un resultado de empate.
  if (firstCount === secondCount) {

    return "Empate";

  }

  // Devuelve el título del proyecto que tiene
  // mayor cantidad de tecnologías.
  return firstCount > secondCount

    ? firstProject.titulo

    : secondProject.titulo;

}


// ==========================================
// COMPARAR COMPLEJIDAD
// ==========================================

// Compara la puntuación de complejidad
// de los dos proyectos.
export function compareComplexity(firstProject, secondProject) {

  // Calcula la puntuación de complejidad del primer proyecto.
  const firstScore =

    calculateComplexityScore(

      firstProject

    );

  // Calcula la puntuación de complejidad del segundo proyecto.
  const secondScore =

    calculateComplexityScore(

      secondProject

    );

  // Si ambas puntuaciones son iguales,
  // devuelve un empate.
  if (firstScore === secondScore) {

    return "Empate";

  }

  // Devuelve el título del proyecto con
  // la puntuación de complejidad más alta.
  return firstScore > secondScore

    ? firstProject.titulo

    : secondProject.titulo;

}


// ==========================================
// COMPARAR AÑOS DE PROYECTOS
// ==========================================

// Compara el año de realización de dos proyectos.
export function compareProjectYears(firstProject, secondProject) {

  // Convierte el año del primer proyecto a número.
  // Si no existe un valor válido, utiliza 0.
  const firstYear =

    Number.parseInt(

      firstProject.año,

      10

    ) || 0;

  // Convierte el año del segundo proyecto a número.
  // Si no existe un valor válido, utiliza 0.
  const secondYear =

    Number.parseInt(

      secondProject.año,

      10

    ) || 0;

  // Comprueba si ambos proyectos pertenecen al mismo año.
  if (firstYear === secondYear) {

    return "Ambos son del mismo año";

  }

  // Devuelve el título del proyecto que tenga
  // el año más reciente.
  return firstYear > secondYear

    ? firstProject.titulo

    : secondProject.titulo;

}


// ==========================================
// PUNTUACIÓN GENERAL DEL PROYECTO
// ==========================================

// Calcula una puntuación general para un proyecto,
// tomando en cuenta diferentes características.
export function calculateGeneralProjectScore(project) {

  // Comienza con la puntuación de complejidad del proyecto.
  let score =

    calculateComplexityScore(

      project

    );

  // Obtiene las tecnologías utilizadas por el proyecto.
  const stack =

    getProjectStack(project);

  // Suma una unidad por cada tecnología del stack.
  score += stack.length;

  // Si existe una demo válida, agrega 2 puntos.
  if (

    project.demo &&

    project.demo !== "#"

  ) {

    score += 2;

  }

  // Si existe un enlace de código válido,
  // agrega 2 puntos.
  if (

    project.codigo &&

    project.codigo !== "#"

  ) {

    score += 2;

  }

  // Si el proyecto cuenta con una descripción larga,
  // agrega 1 punto adicional.
  if (

    project.descripcionLarga

  ) {

    score += 1;

  }

  // Devuelve la puntuación general calculada.
  return score;

}


// ==========================================
// PUNTUACIÓN PARA RECLUTADORES
// ==========================================

// Calcula una puntuación específica para valorar
// características relevantes dentro de un contexto
// de reclutamiento.
export function calculateRecruiterScore(project) {

  // Comienza con la puntuación de complejidad
  // del proyecto.
  let score =

    calculateComplexityScore(

      project

    );

  // Obtiene las tecnologías utilizadas.
  const stack =

    getProjectStack(project);

  // Cada tecnología tiene un peso de 2 puntos
  // dentro de esta puntuación.
  score += stack.length * 2;

  // Si existe un enlace de código válido,
  // agrega 3 puntos.
  if (

    project.codigo &&

    project.codigo !== "#"

  ) {

    score += 3;

  }

  // Si existe una demo válida,
  // agrega 3 puntos.
  if (

    project.demo &&

    project.demo !== "#"

  ) {

    score += 3;

  }

  // Si existe una descripción larga de más de 80 caracteres,
  // agrega 2 puntos adicionales.
  if (

    project.descripcionLarga &&

    project.descripcionLarga.length > 80

  ) {

    score += 2;

  }

  // Devuelve la puntuación final para reclutadores.
  return score;

}


// ==========================================
// DETECTAR TECNOLOGÍA COMPARADA
// ==========================================

// Busca una tecnología mencionada por el usuario
// dentro de los stacks de los dos proyectos comparados.
export function detectComparedTechnology(message, firstProject, secondProject) {

  // Combina las tecnologías de ambos proyectos
  // en un solo arreglo.
  const technologies = [

    ...getProjectStack(

      firstProject

    ),

    ...getProjectStack(

      secondProject

    )

  ];

  // Busca la primera tecnología cuyo nombre
  // aparezca dentro del mensaje del usuario.
  return (

    technologies.find(technology =>

      message.includes(

        // Normaliza el nombre de la tecnología
        // antes de buscarla en el mensaje.
        normalizeText(technology)

      )

    ) || null

  );

}