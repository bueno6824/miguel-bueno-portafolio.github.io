import {
    normalizeProjects
} from "./projectModel.js";

/* =========================================
   PROJECT REPOSITORY
========================================= */

const PROJECTS_URL =
    "./data/proyectos.json";

/**
 * Obtiene los proyectos desde
 * la fuente de datos actual.
 */
export async function fetchProjects() {
    try {
        const response =
            await fetch(
                PROJECTS_URL
            );

        if (!response.ok) {
            throw new Error(
                `Error HTTP ${response.status}: ${response.statusText}`
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {
            throw new TypeError(
                "proyectos.json debe contener un arreglo de proyectos."
            );
        }

        return normalizeProjects(
            data
        );
    } catch (error) {
        console.error(
            "No fue posible cargar los proyectos:",
            error
        );

        return [];
    }
}