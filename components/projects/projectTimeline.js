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

/* Renderiza la línea de tiempo agrupando los proyectos por año */
export function renderProjectTimeline() {
  // Obtiene el contenedor donde se mostrará la línea de tiempo
  const container =
    document.getElementById(
      "projectsTimeline"
    );

  // Verifica que el contenedor exista antes de continuar
  if (!container) {
    console.warn(
      "No se encontró #projectsTimeline."
    );

    return;
  }

  // Obtiene los proyectos agrupados según su año
  const groupedProjects =
    getProjectsGroupedByYear();

  // Convierte los grupos de proyectos en una lista de entradas
  const timelineEntries =
    Object.entries(
      groupedProjects
    );

  // Muestra un mensaje cuando no existen proyectos disponibles
  if (!timelineEntries.length) {
    container.innerHTML = `
      <p class="projects-timeline-empty">
        No hay proyectos disponibles para mostrar.
      </p>
    `;

    return;
  }

  // Genera el HTML correspondiente a cada año de la línea de tiempo
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

  // Inicializa los eventos de interacción de la línea de tiempo
  initTimelineEvents(
    container
  );

}

/* Genera la estructura HTML correspondiente a un año de la línea de tiempo */
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

/* Genera la tarjeta individual de un proyecto dentro de la línea de tiempo */
function renderTimelineProject(
  project
) {
  // Construye el título mostrando el icono del proyecto cuando está disponible
  const displayTitle =
    project.icono
      ? `${project.icono} ${project.titulo}`
      : project.titulo;

  // Obtiene y formatea el estado actual del proyecto
  const statusLabel =
    formatTaxonomyLabel(
      project.metadata?.estado ||
      project.estado ||
      "sin-estado"
    );

  // Limita la cantidad de tecnologías mostradas en la tarjeta a cuatro
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

/* Convierte valores internos de la taxonomía en etiquetas legibles */
function formatTaxonomyLabel(
  value = ""
) {
  // Convierte el valor a texto, reemplaza guiones y capitaliza cada palabra
  return value
    .toString()
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    );
}

/* Genera el texto correspondiente a la cantidad de proyectos */
function formatProjectCount(
  count
) {
  // Utiliza el formato singular cuando existe un solo proyecto
  return count === 1
    ? "1 proyecto"
    : `${count} proyectos`;
}

/* Inicializa la interacción de los botones de la línea de tiempo */
function initTimelineEvents(
  container
) {
  // Evita registrar múltiples veces el mismo evento
  if (timelineInitialized) {
    return;
  }

  // Marca los eventos de la línea de tiempo como inicializados
  timelineInitialized = true;

  // Utiliza delegación de eventos para detectar los botones de los proyectos
  container.addEventListener(
    "click",
    event => {
      // Busca el botón de proyecto más cercano al elemento seleccionado
      const button =
        event.target.closest(
          ".projects-timeline-button"
        );

      // Detiene la ejecución si el clic no corresponde a un botón de proyecto
      if (!button) {
        return;
      }

      // Obtiene el identificador del proyecto asociado al botón
      const projectId =
        button.dataset.projectId;

      // Verifica que exista un identificador válido
      if (!projectId) {
        return;
      }

      // Abre el modal correspondiente al proyecto seleccionado
      openProjectModal(
        projectId
      );
    }
  );
}

