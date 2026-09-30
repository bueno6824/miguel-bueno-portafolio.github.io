import {
    getCategories
} from "../../js/services/projectService.js";

import {
    setProjectCategory
} from "./projectExplorerState.js";

import {
    refreshProjectsView
} from "./projectExplorer.js";

/* Renderiza dinámicamente los botones de filtro según las categorías disponibles */
export function renderProjectFilters() {

    // Obtiene el contenedor donde se mostrarán los filtros de proyectos
    const container =
        document.getElementById(
            "projectFilters"
        );

    // Detiene la función si el contenedor no existe
    if (!container) return;

    // Obtiene las categorías disponibles desde el servicio de proyectos
    const categories =
        getCategories();

    // Genera un botón de filtro por cada categoría disponible
    container.innerHTML =
        categories
            .map(
                (
                    category,
                    index
                ) => {

                    // Genera una etiqueta legible para cada categoría
                    const label =
                        category === "todos"
                            ? "Todos"
                            : formatCategoryLabel(
                                category
                            );

                    // Marca como activo el primer filtro, correspondiente a "Todos"
                    const activeClass =
                        index === 0
                            ? "active"
                            : "";

                    // Devuelve la estructura HTML del botón de categoría
                    return `

            <button

              class="
                project-filter
                ${activeClass}
              "

              type="button"

              data-category="${category}"

            >

              ${label}

            </button>

          `;

                }

            )

            // Une todos los botones generados en una sola cadena HTML
            .join("");

    // Obtiene todos los botones de filtro y agrega su comportamiento de clic
    container
        .querySelectorAll(
            ".project-filter"
        )
        .forEach(button => {

            // Escucha cuando el usuario selecciona una categoría
            button.addEventListener(
                "click",
                () => {

                    // Obtiene la categoría asociada al botón seleccionado
                    const category =
                        button.dataset.category;

                    // Guarda la categoría seleccionada en el estado del explorador
                    setProjectCategory(
                        category
                    );

                    // Actualiza visualmente el filtro activo
                    updateActiveFilter(
                        button
                    );

                    // Actualiza la lista de proyectos con el nuevo filtro
                    refreshProjectsView();

                }
            );

        });
}

/* Actualiza el estado visual de los botones de filtro */
function updateActiveFilter(
    activeButton
) {

    // Obtiene todos los botones de filtro disponibles
    document
        .querySelectorAll(
            ".project-filter"
        )
        .forEach(button => {

            // Elimina la clase active de cada botón antes de marcar el seleccionado
            button.classList.remove(
                "active"
            );

        });

    // Marca como activo el botón seleccionado
    activeButton.classList.add(
        "active"
    );
}

/* Convierte el nombre interno de una categoría en una etiqueta legible */
function formatCategoryLabel(
    category
) {

    // Reemplaza guiones por espacios y convierte la primera letra de cada palabra a mayúscula
    return category
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}