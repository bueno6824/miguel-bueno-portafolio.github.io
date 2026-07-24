import {
    getProjectsGroupedByYear
} from "../../js/services/projectService.js";

import {
    openProjectModal
} from "../modals/modal.js";


let timelineInitialized = false;


/* =========================================
   PROJECT TIMELINE
========================================= */

export function renderProjectTimeline() {
    const container =
        document.getElementById(
            "projectsTimeline"
        );

    if (!container) {
        console.warn(
            "No se encontró #projectsTimeline."
        );

        return;
    }

    const groupedProjects =
        getProjectsGroupedByYear();

    const timelineEntries =
        Object.entries(
            groupedProjects
        );

    if (!timelineEntries.length) {
        container.innerHTML = `
      <p class="projects-timeline-empty">
        No hay proyectos disponibles para mostrar.
      </p>
    `;

        return;
    }

    container.innerHTML =
        timelineEntries
            .map(
                ([year, projects]) =>
                    renderTimelineYear(
                        year,
                        projects
                    )
            )
            .join("");

    initTimelineEvents(
        container
    );

}

function renderTimelineYear(
    year,
    projects
) {
    return `
    <section
      class="projects-timeline-year"
      aria-labelledby="timeline-year-${year}"
    >
      <div
        class="projects-timeline-year-marker"
      >
        <span
          class="projects-timeline-dot"
          aria-hidden="true"
        ></span>

        <h4
          id="timeline-year-${year}"
          class="projects-timeline-year-title"
        >
          ${year}
        </h4>

        <span
          class="projects-timeline-year-count"
        >
          ${formatProjectCount(
        projects.length
    )}
        </span>
      </div>

      <div
        class="projects-timeline-items"
      >
        ${projects
            .map(
                renderTimelineProject
            )
            .join("")
        }
      </div>
    </section>
  `;
}

function renderTimelineProject(
    project
) {
    const displayTitle =
        project.icono
            ? `${project.icono} ${project.titulo}`
            : project.titulo;

    const statusLabel =
        formatTaxonomyLabel(
            project.metadata?.estado ||
            project.estado ||
            "sin-estado"
        );

    const technologies =
        (project.stack || [])
            .slice(0, 4);

    return `
    <article
      class="
        projects-timeline-card
        ${project.featured
            ? "projects-timeline-card--featured"
            : ""
        }
      "
      data-project-id="${project.id}"
    >
      <div
        class="projects-timeline-card-header"
      >
        <div>
          <h5
            class="projects-timeline-card-title"
          >
            ${displayTitle}
          </h5>

          <span
            class="projects-timeline-card-category"
          >
            ${formatTaxonomyLabel(
            project.categoria
        )
        }
          </span>
        </div>

        <span
          class="
            projects-timeline-status
            projects-timeline-status--${project.metadata?.estado ||
        project.estado ||
        "sin-estado"
        }
          "
        >
          ${statusLabel}
        </span>
      </div>

      <p
        class="projects-timeline-card-description"
      >
        ${project.descripcion?.corta ||
        project.descripcionCorta ||
        ""
        }
      </p>

      ${technologies.length
            ? `
            <div
              class="projects-timeline-stack"
            >
              ${technologies
                .map(
                    technology => `
                      <span>
                        ${technology}
                      </span>
                    `
                )
                .join("")
            }
            </div>
          `
            : ""
        }

      <button
        class="projects-timeline-button"
        type="button"
        data-project-id="${project.id}"
      >
        Ver proyecto
        <span aria-hidden="true">
          →
        </span>
      </button>
    </article>
  `;
}

function formatTaxonomyLabel(
    value = ""
) {
    return value
        .toString()
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}

function formatProjectCount(
    count
) {
    return count === 1
        ? "1 proyecto"
        : `${count} proyectos`;
}

function initTimelineEvents(
    container
) {
    if (timelineInitialized) {
        return;
    }

    timelineInitialized = true;

    container.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest(
                    ".projects-timeline-button"
                );

            if (!button) {
                return;
            }

            const projectId =
                button.dataset.projectId;

            if (!projectId) {
                return;
            }

            openProjectModal(
                projectId
            );
        }
    );
}


