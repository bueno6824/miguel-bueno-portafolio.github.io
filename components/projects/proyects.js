import {
  getProjectsData
} from "../modals/modal.js";

// Carga y renderiza los proyectos dentro de la cuadrícula principal.
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

  // Obtiene el contenedor donde se mostrarán las tarjetas.
  const container =
    document.getElementById(
      "projectsGrid"
    );

  // Detiene la ejecución si el contenedor no existe.
  if (!container) {
    console.warn(
      "No se encontró #projectsGrid."
    );
    return;
  }

  /*
   * Verifica que los datos recibidos sean
   * un arreglo válido y que contengan proyectos.
   */
  if (
    !Array.isArray(projectsData) ||
    !projectsData.length
  ) {
    // Muestra un mensaje cuando no existen proyectos disponibles.
    container.innerHTML = `
      <p class="projects-empty">
        No hay proyectos disponibles.
      </p>
    `;
    return;
  }

  /*
   * Convierte cada proyecto en una tarjeta HTML
   * y posteriormente une todas las tarjetas
   * en una sola cadena.
   */
  container.innerHTML =
    projectsData
      .map(proyecto => {

        // Genera la etiqueta visual para los proyectos destacados.
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

        // Agrega una clase adicional cuando el proyecto es destacado.
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

        // Obtiene el texto alternativo correspondiente a la imagen.
        const coverAlt =
          typeof proyecto.imagenPortada ===
            "object"
            ? proyecto.imagenPortada?.alt ||
            proyecto.portada?.alt ||
            `Vista previa de ${proyecto.titulo}`
            : proyecto.portada?.alt ||
            `Vista previa de ${proyecto.titulo}`;

        // Combina el icono del proyecto con su título cuando existe.
        const displayTitle =
          proyecto.icono
            ? `${proyecto.icono} ${proyecto.titulo}`
            : proyecto.titulo;

        // Construye la estructura HTML completa de la tarjeta.
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

            <!-- Contenedor de la imagen principal del proyecto. -->
            <div class="project-image">

              <!-- Imagen de portada cargada de forma diferida. -->
              <img
                src="${coverSrc}"
                alt="${coverAlt}"
                loading="lazy"
              >

              <!-- Insignia que indica si el proyecto es destacado. -->
              ${featuredBadge}

            </div>

            <!-- Título visible del proyecto. -->
            <h3>
              ${displayTitle}
            </h3>

            <!-- Descripción corta del proyecto. -->
            <p>
              ${proyecto.descripcionCorta || ""}
            </p>

            <!-- Tecnologías utilizadas en el proyecto. -->
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

            <!-- Acciones disponibles para el proyecto. -->
            <div class="project-links">

              <!-- Abre el modal con la información completa del proyecto. -->
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