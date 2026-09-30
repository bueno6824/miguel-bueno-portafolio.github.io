import {
    getProjectStats
} from "../../js/services/projectService.js";

/* =========================================
   PROJECT STATS
========================================= */

/* Renderiza las estadísticas generales de los proyectos */
export function renderProjectStats() {

    // Obtiene el contenedor donde se mostrarán las estadísticas
    const container =
        document.getElementById(
            "projectStats"
        );

    // Verifica que el contenedor exista antes de continuar
    if (!container) {

        console.warn(
            "No se encontró #projectStats."
        );

        return;

    }

    // Obtiene las estadísticas calculadas por el servicio de proyectos
    const stats =
        getProjectStats();

    // Define los elementos estadísticos que se mostrarán en la interfaz
    const statItems = [

        // Estadística correspondiente al total de proyectos
        {

            icon: "📁",

            value: stats.total,

            label:
                stats.total === 1
                    ? "Proyecto"
                    : "Proyectos"

        },

        // Estadística correspondiente a los proyectos destacados
        {

            icon: "⭐",

            value: stats.featured,

            label:
                stats.featured === 1
                    ? "Destacado"
                    : "Destacados"

        },

        // Estadística correspondiente a los proyectos actualmente en desarrollo
        {

            icon: "🚧",

            value: stats.inProgress,

            label: "En desarrollo"

        },

        // Estadística correspondiente a los proyectos finalizados
        {

            icon: "✅",

            value: stats.finished,

            label:
                stats.finished === 1
                    ? "Finalizado"
                    : "Finalizados"

        },

        // Estadística correspondiente al total de tecnologías utilizadas
        {

            icon: "🛠️",

            value:
                stats.totalTechnologies,

            label:
                stats.totalTechnologies === 1
                    ? "Tecnología"
                    : "Tecnologías"

        },

        // Estadística correspondiente al total de categorías disponibles
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

    // Genera las tarjetas HTML con la información de cada estadística
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

            // Une todas las tarjetas generadas en una sola cadena HTML
            .join("");

}