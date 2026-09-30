import {
    setProjectOrder
} from "./projectExplorerState.js";

import {
    refreshProjectsView
} from "./projectExplorer.js";

/* =========================================
   PROJECT SORT
========================================= */

/* Indica si el selector de ordenamiento ya fue inicializado */
let sortInitialized = false;

/* Inicializa el selector encargado de ordenar los proyectos */
export function initProjectSort() {

    // Evita registrar nuevamente el evento si la función ya fue ejecutada
    if (sortInitialized) {

        return;

    }

    // Obtiene el selector de ordenamiento desde el DOM
    const select =
        document.getElementById(
            "projectSortSelect"
        );

    // Verifica que el selector exista antes de continuar
    if (!select) {

        console.warn(
            "No se encontró #projectSortSelect."
        );

        return;

    }

    // Marca el módulo como inicializado
    sortInitialized = true;

    // Escucha los cambios realizados en el selector de ordenamiento
    select.addEventListener(
        "change",
        event => {

            // Obtiene el criterio de ordenamiento seleccionado
            const order =
                event.target.value;

            // Guarda el nuevo criterio en el estado del explorador
            setProjectOrder(
                order
            );

            // Actualiza la vista de proyectos con el nuevo orden
            refreshProjectsView();

        }

    );

}