import {

    fetchProjects

} from "./projectRepository.js";

/* =========================================
   PROJECT SERVICE
========================================= */

/*
 * Almacena en memoria los proyectos
 * cargados desde el repository.
 */
let projects = [];

/**
 * Inicializa el servicio cargando
 * los proyectos desde el repository.
 */
export async function initProjectService() {

    projects =

        await fetchProjects();

    return getProjects();

}

/**
 * Devuelve una copia de todos
 * los proyectos cargados.
 *
 * Se utiliza una copia para evitar
 * modificar directamente el arreglo interno.
 */
export function getProjects() {

    return [...projects];

}

/**
 * Devuelve solamente proyectos visibles.
 *
 * Los proyectos con visible en false
 * quedan excluidos de los resultados.
 */
export function getVisibleProjects() {

    return projects.filter(

        project =>

            project.visible !== false

    );

}

/**
 * Busca un proyecto por su ID.
 */
export function getProjectById(id) {

    if (!id) {

        return null;

    }

    return (

        projects.find(

            project =>

                project.id === id

        ) || null

    );

}

/**
 * Busca un proyecto por su slug.
 */
export function getProjectBySlug(slug) {

    if (!slug) {

        return null;

    }

    return (

        projects.find(

            project =>

                project.slug === slug

        ) || null

    );

}

/**
 * Devuelve los proyectos destacados.
 */
export function getFeaturedProjects() {

    return getVisibleProjects().filter(

        project =>

            project.featured === true

    );

}

/**
 * Devuelve proyectos por categoría.
 */
export function getProjectsByCategory(

    category

) {

    if (!category) {

        return getVisibleProjects();

    }

    /*
     * Normaliza la categoría recibida
     * para realizar una comparación
     * independiente de mayúsculas o acentos.
     */
    const normalizedCategory =

        normalizeSearchText(category);

    return getVisibleProjects().filter(

        project =>

            normalizeSearchText(

                project.categoria

            ) === normalizedCategory

    );

}

/**
 * Devuelve proyectos por estado.
 */
export function getProjectsByStatus(

    status

) {

    if (!status) {

        return getVisibleProjects();

    }

    /*
     * Normaliza el estado recibido
     * antes de compararlo con los proyectos.
     */
    const normalizedStatus =

        normalizeSearchText(status);

    return getVisibleProjects().filter(

        project =>

            normalizeSearchText(

                project.metadata?.estado

            ) === normalizedStatus

    );

}

/**
 * Devuelve proyectos por año.
 */
export function getProjectsByYear(

    year

) {

    /*
     * Convierte el año recibido a número
     * para compararlo con el año normalizado.
     */
    const parsedYear =

        Number.parseInt(year, 10);

    if (Number.isNaN(parsedYear)) {

        return [];

    }

    return getVisibleProjects().filter(

        project =>

            project.anio === parsedYear

    );

}

/**
 * Busca proyectos por:
 *
 * - título
 * - categoría
 * - subcategorías
 * - stack
 * - tecnologías
 * - keywords
 * - aliases
 * - año
 * - estado
 */
export function searchProjects(

    query = ""

) {

    /*
     * Normaliza la consulta antes de realizar
     * la búsqueda.
     */
    const normalizedQuery =

        normalizeSearchText(query);

    /*
     * Una consulta vacía devuelve todos
     * los proyectos visibles.
     */
    if (!normalizedQuery) {

        return getVisibleProjects();

    }

    return getVisibleProjects().filter(

        project => {

            /*
             * Construye un único texto con todos
             * los datos relevantes del proyecto.
             */
            const searchableContent =

                buildSearchableContent(

                    project

                );

            return searchableContent.includes(

                normalizedQuery

            );

        }

    );

}

/**
 * Ordena proyectos sin modificar
 * el arreglo principal.
 *
 * Opciones:
 *
 * recent
 * oldest
 * alphabetic
 * featured
 */
export function sortProjects(

    projectList = getVisibleProjects(),

    order = "recent"

) {

    /*
     * Se crea una copia para que el ordenamiento
     * no modifique el arreglo original.
     */
    const sortedProjects = [

        ...projectList

    ];

    switch (order) {

        /*
         * Ordena del proyecto más antiguo
         * al más reciente.
         */
        case "oldest":

            return sortedProjects.sort(

                (a, b) => {

                    const yearDifference =

                        getProjectYear(a) -

                        getProjectYear(b);

                    if (yearDifference !== 0) {

                        return yearDifference;

                    }

                    return compareProjectTitles(

                        a,

                        b

                    );

                }

            );

        /*
         * Ordena alfabéticamente por título.
         */
        case "alphabetic":

            return sortedProjects.sort(

                (a, b) =>

                    a.titulo.localeCompare(

                        b.titulo,

                        "es",

                        {

                            sensitivity: "base"

                        }

                    )

            );

        /*
         * Coloca primero los proyectos destacados.
         * Si empatan, utiliza el año y después
         * el título como criterios secundarios.
         */
        case "featured":

            return sortedProjects.sort(

                (a, b) => {

                    const featuredDifference =

                        Number(b.featured) -

                        Number(a.featured);

                    if (featuredDifference !== 0) {

                        return featuredDifference;

                    }

                    const yearDifference =

                        getProjectYear(b) -

                        getProjectYear(a);

                    if (yearDifference !== 0) {

                        return yearDifference;

                    }

                    return compareProjectTitles(

                        a,

                        b

                    );

                }

            );

        /*
         * Ordena del proyecto más reciente
         * al más antiguo.
         */
        case "recent":

            return sortedProjects.sort(

                (a, b) => {

                    const yearDifference =

                        getProjectYear(b) -

                        getProjectYear(a);

                    if (yearDifference !== 0) {

                        return yearDifference;

                    }

                    return compareProjectTitles(

                        a,

                        b

                    );

                }

            );

    }

}

/*
 * Compara dos proyectos utilizando
 * sus títulos en español.
 */
function compareProjectTitles(

    projectA,

    projectB

) {

    return projectA.titulo.localeCompare(

        projectB.titulo,

        "es",

        {

            sensitivity: "base"

        }

    );

}

/**
 * Genera estadísticas básicas
 * de todos los proyectos visibles.
 */
export function getProjectStats() {

    /*
     * Obtiene únicamente los proyectos
     * disponibles públicamente.
     */
    const visibleProjects =

        getVisibleProjects();

    /*
     * Identifica los proyectos que
     * ya fueron finalizados.
     */
    const finishedProjects =

        visibleProjects.filter(

            project =>

                project.metadata?.estado ===

                "finalizado"

        );

    /*
     * Identifica proyectos que actualmente
     * están en desarrollo o progreso.
     */
    const activeProjects =

        visibleProjects.filter(

            project =>

                [

                    "en-desarrollo",

                    "en-progreso"

                ].includes(

                    project.metadata?.estado

                )

        );

    /*
     * Cuenta la frecuencia de cada categoría.
     */
    const categories =

        countValues(

            visibleProjects.map(

                project =>

                    project.categoria

            )

        );

    /*
     * Obtiene y cuenta las tecnologías
     * utilizadas en todos los proyectos.
     */
    const technologies =

        countValues(

            visibleProjects.flatMap(

                project =>

                    getProjectTechnologies(

                        project

                    )

            )

        );

    /*
     * Devuelve todas las estadísticas
     * utilizadas por el dashboard y otras vistas.
     */
    return {

        total:

            visibleProjects.length,

        featured:

            visibleProjects.filter(

                project =>

                    project.featured === true

            ).length,

        finished:

            finishedProjects.length,

        inProgress:

            activeProjects.length,

        totalTechnologies:

            Object.keys(

                technologies

            ).length,

        totalCategories:

            Object.keys(

                categories

            ).length,

        categories,

        technologies

    };

}

/**
 * Permite reemplazar los proyectos
 * manualmente.
 *
 * Útil para pruebas y para el futuro
 * panel administrativo.
 */
export function setProjects(

    newProjects = []

) {

    /*
     * Verifica que el valor recibido
     * sea realmente un arreglo.
     */
    if (!Array.isArray(newProjects)) {

        console.warn(

            "setProjects esperaba un arreglo."

        );

        return;

    }

    /*
     * Guarda una copia del nuevo arreglo
     * para evitar conservar la referencia original.
     */
    projects = [

        ...newProjects

    ];

}

/* =========================================
   INTERNAL HELPERS
========================================= */

/**
 * Normaliza texto para búsquedas.
 *
 * Elimina diferencias entre mayúsculas,
 * minúsculas y caracteres acentuados.
 */
function normalizeSearchText(

    value = ""

) {

    return value

        .toString()

        .normalize("NFD")

        .replace(

            /[\u0300-\u036f]/g,

            ""

        )

        .toLowerCase()

        .trim();

}

/**
 * Devuelve un año seguro para ordenar.
 *
 * Si el proyecto no contiene un año entero,
 * devuelve 0 como valor de respaldo.
 */
function getProjectYear(project) {

    return Number.isInteger(

        project?.anio

    )

        ? project.anio

        : 0;

}

/**
 * Obtiene todas las tecnologías
 * de un proyecto sin repetidos.
 */
function getProjectTechnologies(

    project

) {

    /*
     * Obtiene las tecnologías agrupadas
     * dentro del objeto de tecnologías.
     */
    const groupedTechnologies =

        Object.values(

            project.tecnologias || {}

        ).flat();

    /*
     * Combina stack y tecnologías agrupadas
     * eliminando valores duplicados.
     */
    return [

        ...new Set([

            ...(project.stack || []),

            ...groupedTechnologies

        ])

    ];

}

/**
 * Construye el texto completo
 * utilizado por el buscador.
 */
function buildSearchableContent(

    project

) {

    /*
     * Obtiene todas las tecnologías
     * asociadas al proyecto.
     */
    const technologies =

        getProjectTechnologies(

            project

        );

    /*
     * Reúne todos los campos que pueden
     * utilizarse para localizar un proyecto.
     */
    const values = [

        project.id,

        project.slug,

        project.titulo,

        project.categoria,

        project.nivel,

        project.anio,

        project.metadata?.estado,

        project.metadata?.rol,

        project.metadata?.cliente,

        ...(project.subcategorias || []),

        ...(project.stack || []),

        ...technologies,

        ...(

            project.busqueda

                ?.keywords || []

        ),

        ...(

            project.busqueda

                ?.aliases || []

        )

    ];

    /*
     * Elimina valores vacíos, une todos los campos
     * y finalmente normaliza el texto resultante.
     */
    return normalizeSearchText(

        values

            .filter(Boolean)

            .join(" ")

    );

}

/**
 * Cuenta cuántas veces aparece
 * cada valor.
 */
function countValues(

    values = []

) {

    /*
     * Reduce el arreglo creando un objeto
     * donde cada propiedad representa un valor
     * y su contenido indica cuántas veces aparece.
     */
    return values.reduce(

        (counter, value) => {

            if (!value) {

                return counter;

            }

            counter[value] =

                (counter[value] || 0) +

                1;

            return counter;

        },

        {}

    );

}

/**
 * Devuelve el título visual del proyecto,
 * incluyendo el icono cuando existe.
 */
export function getProjectDisplayTitle(

    project

) {

    if (!project) {

        return "";

    }

    return project.icono

        ? `${project.icono} ${project.titulo}`

        : project.titulo;

}

/**
 * Devuelve los proyectos visibles
 * ordenados para la vista principal.
 *
 * Primero:
 * proyectos destacados.
 *
 * Después:
 * proyectos más recientes.
 */
export function getMainProjects() {

    return sortProjects(

        getVisibleProjects(),

        "featured"

    );

}

/**
 * Devuelve todas las categorías
 * existentes sin repetir.
 */
export function getCategories() {

    /*
     * "todos" se agrega manualmente para
     * representar la opción de mostrar todo.
     */
    return [

        "todos",

        ...new Set(

            getVisibleProjects()

                .map(

                    project =>

                        project.categoria

                )

                .filter(Boolean)

        )

    ];

}

/**
 * Agrupa los proyectos visibles por año.
 *
 * Resultado:
 *
 * {
 *   2026: [proyecto1, proyecto2],
 *   2025: [proyecto3]
 * }
 */
export function getProjectsGroupedByYear() {

    /*
     * Ordena primero los proyectos por fecha
     * para conservar un orden descendente.
     */
    const sortedProjects =

        sortProjects(

            getVisibleProjects(),

            "recent"

        );

    /*
     * Agrupa cada proyecto dentro de la propiedad
     * correspondiente a su año.
     */
    return sortedProjects.reduce(

        (

            groupedProjects,

            project

        ) => {

            const year =

                project.anio ||

                "Sin fecha";

            if (

                !groupedProjects[year]

            ) {

                groupedProjects[year] = [];

            }

            groupedProjects[year].push(

                project

            );

            return groupedProjects;

        },

        {}

    );

}