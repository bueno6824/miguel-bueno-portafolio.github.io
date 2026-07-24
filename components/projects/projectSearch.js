import {
    setProjectSearchQuery
} from "./projectExplorerState.js";

import {
    refreshProjectsView
} from "./projectExplorer.js";

/* =========================================
   PROJECT SEARCH
========================================= */

let searchInitialized = false;

export function initProjectSearch() {
    /*
     * Evita registrar los eventos dos veces
     * si la función se ejecuta nuevamente.
     */
    if (searchInitialized) {
        return;
    }

    const input =
        document.getElementById(
            "projectSearchInput"
        );

    const clearButton =
        document.getElementById(
            "projectSearchClear"
        );

    if (!input) {
        console.warn(
            "No se encontró #projectSearchInput."
        );

        return;
    }

    searchInitialized = true;

    input.addEventListener(
        "input",
        event => {
            const query =
                event.target.value.trim();

            setProjectSearchQuery(
                query
            );

            updateClearButton(
                clearButton,
                query
            );

            /*
             * Esta función combina:
             *
             * búsqueda
             * categoría
             * ordenamiento
             */
            refreshProjectsView();
        }
    );

    clearButton?.addEventListener(
        "click",
        () => {
            input.value = "";

            setProjectSearchQuery("");

            updateClearButton(
                clearButton,
                ""
            );

            refreshProjectsView();

            input.focus();
        }
    );
}

function updateClearButton(
    button,
    query
) {
    if (!button) {
        return;
    }

    button.hidden =
        query.length === 0;
}