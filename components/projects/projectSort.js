import {
    setProjectOrder
} from "./projectExplorerState.js";

import {
    refreshProjectsView
} from "./projectExplorer.js";

/* =========================================
   PROJECT SORT
========================================= */

let sortInitialized = false;

export function initProjectSort() {
    if (sortInitialized) {
        return;
    }

    const select =
        document.getElementById(
            "projectSortSelect"
        );

    if (!select) {
        console.warn(
            "No se encontró #projectSortSelect."
        );

        return;
    }

    sortInitialized = true;

    select.addEventListener(
        "change",
        event => {
            const order =
                event.target.value;

            setProjectOrder(
                order
            );

            refreshProjectsView();
        }
    );
}

