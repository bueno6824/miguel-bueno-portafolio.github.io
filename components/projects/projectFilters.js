import {
    getCategories
} from "../../js/services/projectService.js";

import {
    setProjectCategory
} from "./projectExplorerState.js";

import {
    refreshProjectsView
} from "./projectExplorer.js";

export function renderProjectFilters() {
    const container =
        document.getElementById(
            "projectFilters"
        );

    if (!container) return;

    const categories =
        getCategories();

    container.innerHTML =
        categories
            .map(
                (
                    category,
                    index
                ) => {
                    const label =
                        category === "todos"
                            ? "Todos"
                            : formatCategoryLabel(
                                category
                            );

                    const activeClass =
                        index === 0
                            ? "active"
                            : "";

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
            .join("");

    container
        .querySelectorAll(
            ".project-filter"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const category =
                        button.dataset.category;

                    setProjectCategory(
                        category
                    );

                    updateActiveFilter(
                        button
                    );

                    refreshProjectsView();
                }
            );
        });
}

function updateActiveFilter(
    activeButton
) {
    document
        .querySelectorAll(
            ".project-filter"
        )
        .forEach(button => {
            button.classList.remove(
                "active"
            );
        });

    activeButton.classList.add(
        "active"
    );
}

function formatCategoryLabel(
    category
) {
    return category
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );
}