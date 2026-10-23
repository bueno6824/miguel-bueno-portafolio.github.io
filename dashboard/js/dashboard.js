import {
    initProjectService,
    getVisibleProjects,
    getProjectStats,
    sortProjects,
    getProjectDisplayTitle
} from "../../js/services/projectService.js";

import {
    openProjectModal,
    closeProjectModal,
    setProjectsData
} from "../../components/modals/modal.js";

import { loadProjectModal } from "../../components/modals/loadProjectModal.js";


window.closeProjectModal = closeProjectModal;


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

// Inicializa y prepara los datos necesarios para el dashboard
async function initDashboardData() {
    try {

        await loadProjectModal();
        // Inicializa el servicio de proyectos
        await initProjectService();

        // Obtiene los proyectos que están marcados como visibles
        const projects = getVisibleProjects();

        // Guarda los proyectos para utilizarlos en el dashboard
        setProjectsData(projects);

        // Renderiza las estadísticas del dashboard
        renderDashboardStats();

        // Renderiza la lista de proyectos recientes
        renderRecentProjects();

        // Inicializa las interacciones de los proyectos recientes
        initRecentProjectsInteraction();

    } catch (error) {

        // Muestra en consola cualquier error durante la inicialización
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

    /* Obtiene el contenedor donde se mostrarán
       las estadísticas del dashboard */
    const container =
        document.getElementById(
            "dashboardStats"
        );

    /* Detiene la función si el contenedor
       no existe en la página */
    if (!container) {
        return;
    }

    /* Obtiene las estadísticas generales
       de los proyectos */
    const stats =
        getProjectStats();

    /* Define las tarjetas de estadísticas
       que se mostrarán en el dashboard */
    const cards = [
        {
            /* Icono representativo de los proyectos */
            icon: "📁",

            /* Nombre de la estadística */
            label: "Proyectos",

            /* Valor obtenido del servicio de proyectos */
            value: stats.total,

            /* Descripción secundaria */
            description: "Proyectos visibles"
        },

        {
            /* Icono para proyectos destacados */
            icon: "⭐",

            /* Nombre de la estadística */
            label: "Destacados",

            /* Cantidad de proyectos destacados */
            value: stats.featured,

            /* Descripción secundaria */
            description: "Proyectos destacados"
        },

        {
            /* Icono para proyectos activos */
            icon: "🚀",

            /* Nombre de la estadística */
            label: "En desarrollo",

            /* Cantidad de proyectos en desarrollo */
            value: stats.inProgress,

            /* Descripción secundaria */
            description: "Proyectos activos"
        },

        {
            /* Icono para tecnologías */
            icon: "🛠️",

            /* Nombre de la estadística */
            label: "Tecnologías",

            /* Cantidad total de tecnologías utilizadas */
            value: stats.totalTechnologies,

            /* Descripción secundaria */
            description: "Tecnologías utilizadas"
        }
    ];

    /* Genera el HTML de cada tarjeta y lo inserta
       dentro del contenedor del dashboard */
    container.innerHTML =
        cards
            .map(card => `
                <article class="dashboard-stat">

                    <div class="dashboard-stat-top">

                        <span class="dashboard-stat-label">
                            ${card.label}
                        </span>

                        <span
                            class="dashboard-stat-icon"
                            aria-hidden="true"
                        >
                            ${card.icon}
                        </span>

                    </div>

                    <strong class="dashboard-stat-value">
                        ${card.value}
                    </strong>

                    <span class="dashboard-stat-description">
                        ${card.description}
                    </span>

                </article>
            `)
            .join("");
}


/* =========================================
   RECENT PROJECTS
========================================= */

/*
 * Renderiza la lista de proyectos más recientes
 * dentro del dashboard.
 */
function renderRecentProjects() {

    /* Obtiene el contenedor donde se mostrarán
       los proyectos recientes */
    const container =
        document.getElementById("recentProjects");

    /* Detiene la función si el contenedor
       no existe en la página */
    if (!container) return;

    /* Obtiene los proyectos visibles y los ordena
       desde el más reciente */
    const projects = sortProjects(
        getVisibleProjects(),
        "recent"
    );

    /* Muestra un estado vacío cuando no existen
       proyectos disponibles */
    if (!projects.length) {
        container.innerHTML = `
            <div class="dashboard-empty-state">
                <span class="dashboard-empty-icon">📁</span>
                <p>No hay proyectos disponibles.</p>
            </div>
        `;
        return;
    }

    /* Toma los cinco proyectos más recientes,
       genera su HTML y lo inserta en el contenedor */
    container.innerHTML = projects
        .slice(0, 5)
        .map(createProjectItem)
        .join("");
}

/*
 * Inicializa la interacción con los proyectos recientes
 * mediante clic y teclado.
 */
function initRecentProjectsInteraction() {

    /* Obtiene el contenedor de proyectos recientes */
    const container =
        document.getElementById("recentProjects");

    /* Detiene la inicialización si el contenedor
       no existe en la página */
    if (!container) return;

    /* Detecta clics sobre los proyectos recientes */
    container.addEventListener("click", event => {

        /* Busca el elemento de proyecto más cercano
           al elemento donde ocurrió el clic */
        const projectItem =
            event.target.closest(
                ".dashboard-project-item"
            );

        /* Ignora el evento si no se hizo clic
           sobre un proyecto */
        if (!projectItem) return;

        /* Abre el proyecto seleccionado utilizando
           su identificador almacenado en data-project-id */
        openDashboardProject(
            projectItem.dataset.projectId
        );
    });

    /* Permite abrir los proyectos utilizando
       las teclas Enter o Espacio */
    container.addEventListener("keydown", event => {

        /* Ignora cualquier tecla diferente de Enter
           o Espacio */
        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        /* Busca el proyecto relacionado con
           el elemento que recibió el evento */
        const projectItem =
            event.target.closest(
                ".dashboard-project-item"
            );

        /* Ignora el evento si no corresponde
           a un proyecto */
        if (!projectItem) return;

        /* Evita el comportamiento predeterminado
           de la tecla Espacio */
        event.preventDefault();

        /* Abre el proyecto seleccionado */
        openDashboardProject(
            projectItem.dataset.projectId
        );
    });
}

// Abre el modal del proyecto seleccionado desde el dashboard
function openDashboardProject(projectId) {

    // Busca el proyecto visible cuyo ID coincida con el recibido
    const project =
        getVisibleProjects().find(
            item =>
                String(item.id) ===
                String(projectId)
        );

    // Verifica que el proyecto exista antes de abrirlo
    if (!project) {
        console.warn(
            `No se encontró el proyecto con ID: ${projectId}`
        );
        return;
    }

    // Abre el modal utilizando el ID del proyecto encontrado
    openProjectModal(project.id);
}




/* =========================================
   PROJECT ITEM
========================================= */

/*
 * Genera el HTML de un proyecto individual
 * para mostrarlo dentro del dashboard.
 */
function createProjectItem(project) {

    /* Obtiene el título formateado del proyecto */
    const title =
        getProjectDisplayTitle(project);

    /* Obtiene la categoría del proyecto o utiliza
       un texto alternativo si no está definida */
    const category =
        project.categoria || "Sin categoría";

    /* Obtiene el año del proyecto o muestra
       un texto alternativo si no existe */
    const year =
        project.anio || "Sin fecha";

    /* Obtiene y formatea el estado del proyecto */
    const status =
        formatStatus(
            project.metadata?.estado
        );

    /* Construye la estructura HTML del proyecto */
    return `
        <article
            class="dashboard-project-item"
            data-project-id="${escapeHTML(String(project.id))}"
            tabindex="0"
            role="button"
            aria-label="Abrir proyecto ${escapeHTML(project.titulo)}"
        >

            <!-- Icono representativo del proyecto -->
            <div class="dashboard-project-icon">
                ${project.icono || "📁"}
            </div>

            <!-- Información principal del proyecto -->
            <div class="dashboard-project-info">

                <!-- Título del proyecto -->
                <h3 class="dashboard-project-title">
                    ${escapeHTML(title)}
                </h3>

                <!-- Categoría y año del proyecto -->
                <div class="dashboard-project-meta">
                    <span>
                        ${escapeHTML(category)}
                    </span>

                    <span>•</span>

                    <span>
                        ${escapeHTML(String(year))}
                    </span>
                </div>

            </div>

            <!-- Estado actual del proyecto -->
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