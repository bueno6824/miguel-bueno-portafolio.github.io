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

export function refreshProjectsView() {
    const state =
        getProjectExplorerState();

    /*
     * 1. Obtener proyectos según
     * la consulta del buscador.
     */
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
    filteredProjects =
        sortProjects(
            filteredProjects,
            state.order
        );

    /*
     * 4. Renderizar el resultado final.
     */
    loadProjects(
        filteredProjects
    );

    updateProjectsEmptyState(
        filteredProjects,
        state
    );
}

function updateProjectsEmptyState(
    projects,
    state
) {
    const emptyState =
        document.getElementById(
            "projectsEmptyState"
        );

    if (!emptyState) {
        return;
    }

    const hasResults =
        projects.length > 0;

    emptyState.hidden =
        hasResults;

    if (hasResults) {
        return;
    }

    const details = [];

    if (state.query) {
        details.push(
            `la búsqueda "${state.query}"`
        );
    }

    if (
        state.category !== "todos"
    ) {
        details.push(
            `la categoría "${formatLabel(
                state.category
            )}"`
        );
    }

    emptyState.textContent =
        details.length
            ? `No se encontraron proyectos para ${details.join(" y ")}.`
            : "No hay proyectos disponibles.";
}

function formatLabel(value = "") {
    return value
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}