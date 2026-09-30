import {
    setProjectSearchQuery
} from "./projectExplorerState.js";

import {
    refreshProjectsView
} from "./projectExplorer.js";

/* =========================================
   PROJECT SEARCH
========================================= */

/* Indica si los eventos del buscador ya fueron registrados */
let searchInitialized = false;

/* Inicializa el comportamiento del buscador de proyectos */
export function initProjectSearch() {

    /*
     * Evita registrar los eventos dos veces
     * si la función se ejecuta nuevamente.
     */

    // Comprueba si el buscador ya fue inicializado
    if (searchInitialized) {

        return;

    }

    // Obtiene el campo de entrada utilizado para buscar proyectos
    const input =
        document.getElementById(
            "projectSearchInput"
        );

    // Obtiene el botón utilizado para limpiar la búsqueda
    const clearButton =
        document.getElementById(
            "projectSearchClear"
        );

    // Verifica que el campo de búsqueda exista antes de continuar
    if (!input) {

        console.warn(
            "No se encontró #projectSearchInput."
        );

        return;

    }

    // Marca el buscador como inicializado para evitar duplicar eventos
    searchInitialized = true;

    // Escucha los cambios realizados por el usuario en el campo de búsqueda
    input.addEventListener(
        "input",
        event => {

            // Obtiene la consulta actual eliminando espacios innecesarios
            const query =
                event.target.value.trim();

            // Guarda la consulta actual en el estado del explorador
            setProjectSearchQuery(
                query
            );

            // Actualiza la visibilidad del botón para limpiar la búsqueda
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

            // Actualiza la vista aplicando todos los criterios actuales
            refreshProjectsView();

        }
    );

    // Agrega el evento de limpieza únicamente si el botón existe
    clearButton?.addEventListener(
        "click",
        () => {

            // Limpia el contenido del campo de búsqueda
            input.value = "";

            // Restablece la consulta almacenada
            setProjectSearchQuery("");

            // Oculta el botón de limpieza al no existir una búsqueda activa
            updateClearButton(
                clearButton,
                ""
            );

            // Actualiza la lista de proyectos después de limpiar la búsqueda
            refreshProjectsView();

            // Devuelve el cursor al campo de búsqueda
            input.focus();

        }
    );
}

/* Actualiza la visibilidad del botón utilizado para limpiar la búsqueda */
function updateClearButton(
    button,
    query
) {

    // No realiza ninguna acción si el botón no existe
    if (!button) {

        return;

    }

    // Oculta el botón cuando no existe texto en la búsqueda
    button.hidden =
        query.length === 0;
}