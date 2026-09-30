/* =========================================
   PROJECT EXPLORER STATE
========================================= */

/* Estado actual del explorador de proyectos */
const projectExplorerState = {

    // Texto utilizado actualmente en el buscador
    query: "",

    // Categoría seleccionada para filtrar los proyectos
    category: "todos",

    // Criterio de ordenamiento seleccionado
    order: "featured"

};

/* Devuelve una copia del estado actual del explorador de proyectos */
export function getProjectExplorerState() {

    return {

        // Crea una copia del objeto para evitar modificar directamente el estado original
        ...projectExplorerState

    };

}

/* Actualiza la consulta utilizada para buscar proyectos */
export function setProjectSearchQuery(

    query = ""

) {

    // Convierte la consulta a texto y elimina espacios innecesarios al inicio y al final
    projectExplorerState.query =
        query
            .toString()
            .trim();

}

/* Actualiza la categoría seleccionada para filtrar los proyectos */
export function setProjectCategory(

    category = "todos"

) {

    // Normaliza la categoría convirtiéndola a texto, eliminando espacios y usando minúsculas
    projectExplorerState.category =
        category
            .toString()
            .trim()
            .toLowerCase();

}

/* Actualiza el criterio utilizado para ordenar los proyectos */
export function setProjectOrder(

    order = "featured"

) {

    // Guarda el criterio de ordenamiento seleccionado
    projectExplorerState.order =
        order;

}

/* Restablece todos los valores del explorador a su configuración inicial */
export function resetProjectExplorerState() {

    // Elimina cualquier consulta de búsqueda activa
    projectExplorerState.query = "";

    // Restablece la categoría para mostrar todos los proyectos
    projectExplorerState.category =
        "todos";

    // Restablece el ordenamiento predeterminado
    projectExplorerState.order =
        "featured";

}