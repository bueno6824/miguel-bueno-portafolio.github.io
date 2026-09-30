import {
    getVisibleProjects,
    searchProjects,
    sortProjects
} from "../../js/services/projectService.js";

import {
    getProjectExplorerState
} from "./projectExplorerState.js";

import {
    loadProjects
} from "./proyects.js";

/* =========================================
   PROJECT EXPLORER
========================================= */

/* Actualiza la vista de proyectos aplicando los filtros, búsqueda y ordenamiento actuales */
export function refreshProjectsView() {

    // Obtiene el estado actual del explorador de proyectos
    const state =
        getProjectExplorerState();

    /*
     * 1. Obtener proyectos según
     * la consulta del buscador.
     */

    // Si existe una búsqueda, obtiene los proyectos que coinciden con ella
    let filteredProjects =
        state.query
            ? searchProjects(
                state.query
            )
            : getVisibleProjects();

    /*
     * 2. Aplicar la categoría activa
     * sobre los resultados del buscador.
     */

    // Filtra los proyectos por categoría cuando se selecciona una categoría específica
    if (
        state.category &&
        state.category !== "todos"
    ) {
        filteredProjects =
            filteredProjects.filter(
                project =>
                    project.categoria ===
                    state.category
            );
    }

    /*
     * 3. Aplicar ordenamiento.
     */

    // Ordena los proyectos utilizando el criterio seleccionado actualmente
    filteredProjects =
        sortProjects(
            filteredProjects,
            state.order
        );

    /*
     * 4. Renderizar el resultado final.
     */

    // Carga en la interfaz los proyectos que cumplen con los filtros
    loadProjects(
        filteredProjects
    );

    // Actualiza la información que indica cuántos resultados se muestran
    updateProjectsResultsInfo(
        filteredProjects,
        state
    );

    // Actualiza el mensaje que aparece cuando no existen resultados
    updateProjectsEmptyState(
        filteredProjects,
        state
    );
}

/* Actualiza la sección que informa cuando la búsqueda o los filtros no producen resultados */
function updateProjectsEmptyState(
    projects,
    state
) {

    // Obtiene el elemento que contiene el mensaje de estado vacío
    const emptyState =
        document.getElementById(
            "projectsEmptyState"
        );

    // Detiene la función si el elemento no existe
    if (!emptyState) {
        return;
    }

    // Comprueba si existe al menos un proyecto disponible
    const hasResults =
        projects.length > 0;

    // Muestra u oculta el estado vacío según la existencia de resultados
    emptyState.hidden =
        hasResults;

    // Si existen resultados, no es necesario mostrar el mensaje
    if (hasResults) {
        return;
    }

    // Almacena los criterios activos para construir un mensaje descriptivo
    const details = [];

    // Agrega al mensaje la búsqueda realizada, si existe
    if (state.query) {
        details.push(
            `la búsqueda "${state.query}"`
        );
    }

    // Agrega al mensaje la categoría seleccionada, si no corresponde a "todos"
    if (
        state.category !== "todos"
    ) {
        details.push(
            `la categoría "${formatLabel(
                state.category
            )}"`
        );
    }

    // Construye el mensaje final dependiendo de los filtros utilizados
    emptyState.textContent =
        details.length
            ? `No se encontraron proyectos para ${details.join(" y ")}.`
            : "No hay proyectos disponibles.";
}

/* Convierte valores internos de categorías en etiquetas con formato legible */
function formatLabel(value = "") {

    // Reemplaza los guiones por espacios y convierte la primera letra de cada palabra a mayúscula
    return value
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}

/* Actualiza el texto que informa la cantidad de proyectos mostrados y los filtros utilizados */
function updateProjectsResultsInfo(projects, state) {

    // Obtiene el elemento donde se muestra la información de resultados
    const resultsInfo =
        document.getElementById(
            "projectsResultsInfo"
        );

    // Detiene la función si el elemento no existe
    if (!resultsInfo) {
        return;
    }

    // Obtiene la cantidad total de proyectos que cumplen los criterios actuales
    const count = projects.length;

    // Selecciona la forma singular o plural de la palabra proyecto
    const projectLabel =
        count === 1
            ? "proyecto"
            : "proyectos";

    // Almacena los detalles de los filtros activos
    const details = [];

    // Agrega la búsqueda actual a la información mostrada
    if (state.query) {
        details.push(
            `búsqueda "${state.query}"`
        );
    }

    // Agrega la categoría seleccionada cuando no se muestran todas
    if (
        state.category &&
        state.category !== "todos"
    ) {
        details.push(
            `categoría "${formatLabel(
                state.category
            )}"`
        );
    }

    // Si existen filtros, muestra la cantidad junto con sus detalles
    if (details.length) {
        resultsInfo.textContent =
            `Mostrando ${count} ${projectLabel} · ${details.join(
                " · "
            )}.`;
        return;
    }

    // Si no existen filtros adicionales, muestra únicamente la cantidad de proyectos
    resultsInfo.textContent =
        `Mostrando ${count} ${projectLabel}.`;
}