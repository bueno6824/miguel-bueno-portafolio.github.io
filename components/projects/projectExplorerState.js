/* =========================================
   PROJECT EXPLORER STATE
========================================= */

const projectExplorerState = {
    query: "",
    category: "todos",
    order: "featured"
};

export function getProjectExplorerState() {
    return {
        ...projectExplorerState
    };
}

export function setProjectSearchQuery(
    query = ""
) {
    projectExplorerState.query =
        query
            .toString()
            .trim();
}

export function setProjectCategory(
    category = "todos"
) {
    projectExplorerState.category =
        category
            .toString()
            .trim()
            .toLowerCase();
}

export function setProjectOrder(
    order = "featured"
) {
    projectExplorerState.order =
        order;
}

export function resetProjectExplorerState() {
    projectExplorerState.query = "";
    projectExplorerState.category =
        "todos";
    projectExplorerState.order =
        "featured";
}