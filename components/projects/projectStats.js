import {
    getProjectStats
} from "../../js/services/projectService.js";

/* =========================================
   PROJECT STATS
========================================= */

export function renderProjectStats() {
    const container =
        document.getElementById(
            "projectStats"
        );

    if (!container) {
        console.warn(
            "No se encontró #projectStats."
        );

        return;
    }

    const stats =
        getProjectStats();

    const statItems = [
        {
            icon: "📁",
            value: stats.total,
            label:
                stats.total === 1
                    ? "Proyecto"
                    : "Proyectos"
        },
        {
            icon: "⭐",
            value: stats.featured,
            label:
                stats.featured === 1
                    ? "Destacado"
                    : "Destacados"
        },
        {
            icon: "🚧",
            value: stats.inProgress,
            label: "En desarrollo"
        },
        {
            icon: "✅",
            value: stats.finished,
            label:
                stats.finished === 1
                    ? "Finalizado"
                    : "Finalizados"
        },
        {
            icon: "🛠️",
            value:
                stats.totalTechnologies,
            label:
                stats.totalTechnologies === 1
                    ? "Tecnología"
                    : "Tecnologías"
        },
        {
            icon: "🗂️",
            value:
                stats.totalCategories,
            label:
                stats.totalCategories === 1
                    ? "Categoría"
                    : "Categorías"
        }
    ];

    container.innerHTML =
        statItems
            .map(
                item => `
          <article
            class="project-stat-card"
          >
            <span
              class="project-stat-icon"
              aria-hidden="true"
            >
              ${item.icon}
            </span>

            <div
              class="project-stat-content"
            >
              <strong
                class="project-stat-value"
              >
                ${item.value}
              </strong>

              <span
                class="project-stat-label"
              >
                ${item.label}
              </span>
            </div>
          </article>
        `
            )
            .join("");
}