import {
    initProjectService,
    getVisibleProjects,
    getProjectStats,
    sortProjects,
    getProjectDisplayTitle
} from "../../js/services/projectService.js";


/* =========================================
   DASHBOARD
========================================= */

/* Inicializa la navegación, el menú móvil y los datos del dashboard cuando el DOM está listo. */
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        initDashboardNavigation();
        initMobileMenu();
        await initDashboardData();
    }
);


/* =========================================
   DATA
========================================= */

/* Inicializa el servicio de proyectos y carga la información necesaria para el dashboard. */
async function initDashboardData() {
    try {
        // Inicializa la fuente de datos de proyectos.
        await initProjectService();

        // Renderiza las estadísticas generales.
        renderDashboardStats();

        // Renderiza los proyectos más recientes.
        renderRecentProjects();
    } catch (error) {
        // Registra cualquier error ocurrido durante la carga de los datos.
        console.error(
            "Error cargando los datos del dashboard:",
            error
        );
    }
}


/* =========================================
   STATISTICS
========================================= */

/* Genera las tarjetas con las estadísticas principales del portafolio. */
function renderDashboardStats() {

    // Obtiene el contenedor donde se mostrarán las estadísticas.
    const container =
        document.getElementById(
            "dashboardStats"
        );

    // Detiene la ejecución si el contenedor no existe.
    if (!container) {
        return;
    }

    // Obtiene las estadísticas calculadas por el servicio de proyectos.
    const stats =
        getProjectStats();

    // Construye las tarjetas HTML con los diferentes valores estadísticos.
    container.innerHTML = `
        <article class="dashboard-stat">
            <span class="dashboard-stat-label">
                Proyectos
            </span>
            <strong class="dashboard-stat-value">
                ${stats.total}
            </strong>
            <span class="dashboard-stat-description">
                Proyectos visibles
            </span>
        </article>

        <article class="dashboard-stat">
            <span class="dashboard-stat-label">
                Destacados
            </span>
            <strong class="dashboard-stat-value">
                ${stats.featured}
            </strong>
            <span class="dashboard-stat-description">
                Proyectos destacados
            </span>
        </article>

        <article class="dashboard-stat">
            <span class="dashboard-stat-label">
                En desarrollo
            </span>
            <strong class="dashboard-stat-value">
                ${stats.inProgress}
            </strong>
            <span class="dashboard-stat-description">
                Proyectos activos
            </span>
        </article>

        <article class="dashboard-stat">
            <span class="dashboard-stat-label">
                Tecnologías
            </span>
            <strong class="dashboard-stat-value">
                ${stats.totalTechnologies}
            </strong>
            <span class="dashboard-stat-description">
                Tecnologías utilizadas
            </span>
        </article>
    `;
}


/* =========================================
   RECENT PROJECTS
========================================= */

/* Obtiene y muestra los proyectos más recientes del portafolio. */
function renderRecentProjects() {

    // Obtiene el contenedor destinado a los proyectos recientes.
    const container =
        document.getElementById(
            "recentProjects"
        );

    // Detiene la ejecución si el contenedor no existe.
    if (!container) {
        return;
    }

    // Obtiene los proyectos visibles y los ordena por fecha reciente.
    const projects =
        sortProjects(
            getVisibleProjects(),
            "recent"
        );

    // Muestra un mensaje cuando no existen proyectos disponibles.
    if (!projects.length) {
        container.innerHTML = `
            <div class="dashboard-project-item">
                <div class="dashboard-project-info">
                    <p class="dashboard-project-title">
                        No hay proyectos disponibles.
                    </p>
                </div>
            </div>
        `;
        return;
    }


    // Limita la lista a los cinco proyectos más recientes y genera su HTML.
    container.innerHTML =
        projects
            .slice(0, 5)
            .map(
                project =>
                    createProjectItem(
                        project
                    )
            )
            .join("");
}


/* =========================================
   PROJECT ITEM
========================================= */

/* Genera la tarjeta HTML correspondiente a un proyecto individual. */
function createProjectItem(project) {

    // Obtiene el título de presentación del proyecto.
    const title =
        getProjectDisplayTitle(
            project
        );

    // Obtiene la categoría del proyecto o utiliza un valor predeterminado.
    const category =
        project.categoria ||
        "Sin categoría";

    // Obtiene el año del proyecto o muestra un valor predeterminado.
    const year =
        project.anio ||
        "Sin fecha";

    // Convierte el estado interno del proyecto a un texto legible.
    const status =
        formatStatus(
            project.metadata?.estado
        );


    // Construye la estructura visual del proyecto dentro del dashboard.
    return `
        <article class="dashboard-project-item">

            <div
                class="dashboard-project-image"
                aria-hidden="true"
            >
                ${project.icono || "📁"}
            </div>

            <div class="dashboard-project-info">

                <h4 class="dashboard-project-title">
                    ${escapeHTML(title)}
                </h4>

                <div class="dashboard-project-meta">
                    <span>
                        ${escapeHTML(category)}
                    </span>
                    <span>
                        ${escapeHTML(String(year))}
                    </span>
                    ${project.featured
            ? `
                                <span>
                                    ⭐ Destacado
                                </span>
                              `
            : ""
        }
                </div>
            </div>

            <span class="dashboard-project-status">
                ${escapeHTML(status)}
            </span>

        </article>
    `;
}


/* =========================================
   STATUS
========================================= */

/* Convierte el identificador interno del estado en un texto legible. */
function formatStatus(status) {

    // Devuelve un texto predeterminado cuando no existe un estado.
    if (!status) {
        return "Sin estado";
    }

    // Reemplaza guiones por espacios y convierte cada palabra a formato de título.
    return status
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


/* =========================================
   SAFE HTML
========================================= */

/* Escapa caracteres especiales para evitar insertar HTML no deseado en el contenido generado. */
function escapeHTML(value = "") {

    // Convierte el valor recibido en texto y reemplaza caracteres HTML especiales.
    return value
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   NAVIGATION
========================================= */

/* Inicializa la navegación entre las diferentes secciones del dashboard. */
function initDashboardNavigation() {

    // Obtiene todos los elementos de navegación.
    const navItems =
        document.querySelectorAll(
            ".dashboard-nav-item"
        );

    // Obtiene todas las secciones disponibles del dashboard.
    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );

    // Obtiene los elementos donde se actualizarán el título y descripción.
    const pageTitle =
        document.getElementById(
            "dashboardPageTitle"
        );

    const pageDescription =
        document.getElementById(
            "dashboardPageDescription"
        );


    // Define el contenido correspondiente a cada sección del dashboard.
    const sectionContent = {
        dashboard: {
            title: "Dashboard",
            description:
                "Resumen general de tu portafolio profesional."
        },
        projects: {
            title: "Proyectos",
            description:
                "Gestiona y consulta los proyectos del portafolio."
        },
        skills: {
            title: "Skills",
            description:
                "Tecnologías y habilidades utilizadas en el portafolio."
        },
        analytics: {
            title: "Estadísticas",
            description:
                "Análisis del contenido y evolución del portafolio."
        },
        settings: {
            title: "Configuración",
            description:
                "Configuración del dashboard."
        }
    };


    // Registra el comportamiento de cada elemento de navegación.
    navItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                // Evita que el enlace realice su navegación predeterminada.
                event.preventDefault();

                // Obtiene la sección asociada al elemento seleccionado.
                const sectionId =
                    item.dataset.section;

                // Detiene la ejecución si el elemento no tiene una sección asociada.
                if (!sectionId) {
                    return;
                }


                // Elimina el estado activo de todos los elementos de navegación.
                navItems.forEach(navItem => {
                    navItem.classList.remove(
                        "active"
                    );
                });

                // Marca como activo el elemento seleccionado.
                item.classList.add(
                    "active"
                );


                // Muestra únicamente la sección seleccionada.
                sections.forEach(section => {
                    section.hidden =
                        section.id !== sectionId;
                });


                // Obtiene el contenido correspondiente a la sección seleccionada.
                const content =
                    sectionContent[
                    sectionId
                    ];

                // Actualiza el encabezado si existe información para la sección.
                if (content) {
                    pageTitle.textContent =
                        content.title;

                    pageDescription.textContent =
                        content.description;
                }


                // Actualiza el hash de la URL sin recargar la página.
                history.replaceState(
                    null,
                    "",
                    `#${sectionId}`
                );

                // Cierra el menú móvil después de seleccionar una sección.
                closeMobileMenu();
            }
        );
    });


    // Obtiene la sección indicada actualmente en el hash de la URL.
    const initialSection =
        window.location.hash
            .replace("#", "");


    // Si existe una sección válida en la URL, la selecciona automáticamente.
    if (
        initialSection &&
        sectionContent[initialSection]
    ) {

        // Busca el elemento de navegación correspondiente a la sección inicial.
        const initialItem =
            document.querySelector(
                `[data-section="${initialSection}"]`
            );

        // Simula el clic para activar la sección correspondiente.
        initialItem?.click();
    }
}


/* =========================================
   MOBILE MENU
========================================= */

/* Inicializa el botón encargado de mostrar u ocultar el menú lateral en móviles. */
function initMobileMenu() {

    // Obtiene el botón del menú móvil.
    const button =
        document.getElementById(
            "dashboardMenuButton"
        );

    // Obtiene la barra lateral del dashboard.
    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );

    // Detiene la ejecución si alguno de los elementos no existe.
    if (!button || !sidebar) {
        return;
    }


    // Alterna la visibilidad del sidebar cuando se pulsa el botón.
    button.addEventListener(
        "click",
        () => {

            // Guarda el nuevo estado del sidebar después de alternar la clase.
            const isOpen =
                sidebar.classList.toggle(
                    "open"
                );

            // Actualiza el atributo ARIA con el estado actual del menú.
            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    );
}


/* Cierra el menú lateral móvil y actualiza su estado de accesibilidad. */
function closeMobileMenu() {

    // Obtiene la barra lateral del dashboard.
    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );

    // Obtiene el botón que controla el menú móvil.
    const button =
        document.getElementById(
            "dashboardMenuButton"
        );

    // Detiene la ejecución si el sidebar no existe.
    if (!sidebar) {
        return;
    }

    // Elimina la clase que mantiene abierto el menú.
    sidebar.classList.remove(
        "open"
    );

    // Actualiza el estado ARIA del botón si está disponible.
    button?.setAttribute(
        "aria-expanded",
        "false"
    );
}