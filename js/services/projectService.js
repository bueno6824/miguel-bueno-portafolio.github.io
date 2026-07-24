import {
    fetchProjects
} from "./projectRepository.js";

/* =========================================
   PROJECT SERVICE
========================================= */

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
 */
export function getProjects() {
    return [...projects];
}

/**
 * Devuelve solamente proyectos visibles.
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
    const normalizedQuery =
        normalizeSearchText(query);

    if (!normalizedQuery) {
        return getVisibleProjects();
    }

    return getVisibleProjects().filter(
        project => {
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
    const sortedProjects = [
        ...projectList
    ];

    switch (order) {
        case "oldest":
            return sortedProjects.sort(
                (a, b) =>
                    getProjectYear(a) -
                    getProjectYear(b)
            );

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

        case "featured":
            return sortedProjects.sort(
                (a, b) => {
                    const featuredDifference =
                        Number(b.featured) -
                        Number(a.featured);

                    if (
                        featuredDifference !== 0
                    ) {
                        return featuredDifference;
                    }

                    return (
                        getProjectYear(b) -
                        getProjectYear(a)
                    );
                }
            );

        case "recent":
        default:
            return sortedProjects.sort(
                (a, b) =>
                    getProjectYear(b) -
                    getProjectYear(a)
            );
    }
}

/**
 * Genera estadísticas básicas
 * de todos los proyectos visibles.
 */
export function getProjectStats() {
    const visibleProjects =
        getVisibleProjects();

    const finishedProjects =
        visibleProjects.filter(
            project =>
                project.metadata?.estado ===
                "finalizado"
        );

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

    const categories =
        countValues(
            visibleProjects.map(
                project =>
                    project.categoria
            )
        );

    const technologies =
        countValues(
            visibleProjects.flatMap(
                project =>
                    getProjectTechnologies(
                        project
                    )
            )
        );

    return {
        total:
            visibleProjects.length,

        featured:
            visibleProjects.filter(
                project =>
                    project.featured
            ).length,

        finished:
            finishedProjects.length,

        inProgress:
            activeProjects.length,

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
    if (!Array.isArray(newProjects)) {
        console.warn(
            "setProjects esperaba un arreglo."
        );

        return;
    }

    projects = [
        ...newProjects
    ];
}

/* =========================================
   INTERNAL HELPERS
========================================= */

/**
 * Normaliza texto para búsquedas.
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
    const groupedTechnologies =
        Object.values(
            project.tecnologias || {}
        ).flat();

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
    const technologies =
        getProjectTechnologies(
            project
        );

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