import {
  getProjectsData
} from "../modals/modal.js";

export function loadProjects(
  projects = null
) {
  /*
   * Si recibimos proyectos por parámetro,
   * utilizamos esos.
   *
   * Si no, usamos los almacenados
   * en el modal.
   */
  const projectsData =
    Array.isArray(projects)
      ? projects
      : getProjectsData();

  const container =
    document.getElementById(
      "projectsGrid"
    );

  if (!container) {
    console.warn(
      "No se encontró #projectsGrid."
    );

    return;
  }

  if (
    !Array.isArray(projectsData) ||
    !projectsData.length
  ) {
    container.innerHTML = `
      <p class="projects-empty">
        No hay proyectos disponibles.
      </p>
    `;

    return;
  }

  container.innerHTML =
    projectsData
      .map(proyecto => {
        const featuredBadge =
          proyecto.featured
            ? `
              <span
                class="project-card-featured"
                aria-label="Proyecto destacado"
              >
                ⭐ Destacado
              </span>
            `
            : "";

        const featuredClass =
          proyecto.featured
            ? "project-card--featured"
            : "";

        /*
         * Compatibilidad temporal:
         *
         * imagenPortada puede ser:
         * - un string;
         * - un objeto con src y alt;
         * - o podemos recibir portada.
         */
        const coverSrc =
          typeof proyecto.imagenPortada ===
            "string"
            ? proyecto.imagenPortada
            : proyecto.imagenPortada?.src ||
            proyecto.portada?.src ||
            "";

        const coverAlt =
          typeof proyecto.imagenPortada ===
            "object"
            ? proyecto.imagenPortada?.alt ||
            proyecto.portada?.alt ||
            `Vista previa de ${proyecto.titulo}`
            : proyecto.portada?.alt ||
            `Vista previa de ${proyecto.titulo}`;

        const displayTitle =
          proyecto.icono
            ? `${proyecto.icono} ${proyecto.titulo}`
            : proyecto.titulo;

        return `
          <div
            class="
              card
              project-card
              ${featuredClass}
              reveal
              active
            "
            data-project-id="${proyecto.id}"
          >
            <div class="project-image">
              <img
                src="${coverSrc}"
                alt="${coverAlt}"
                loading="lazy"
              >

              ${featuredBadge}
            </div>

            <h3>
              ${displayTitle}
            </h3>

            <p>
              ${proyecto.descripcionCorta || ""}
            </p>

            <div class="badges">
              ${(proyecto.stack || [])
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

            <div class="project-links">
              <button
                class="btn secondary"
                type="button"
                onclick="openProjectModal('${proyecto.id}')"
              >
                Ver más
              </button>
            </div>
          </div>
        `;
      })
      .join("");
}