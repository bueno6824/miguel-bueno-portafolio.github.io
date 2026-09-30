import {
  setCarousel,
  initCarouselControls
} from "../../js/modules/carusel.js";

// Almacena la lista actual de proyectos disponible para el modal
let currentProjects = [];

// Guarda el identificador del proyecto actualmente abierto
let currentProjectId = null;

// Controla si los eventos de navegación del modal ya fueron inicializados
let modalNavigationInitialized = false;


// Guarda los datos de proyectos recibidos por el módulo
export function setProjectsData(data) {

  currentProjects = data;

}

// Devuelve la lista actual de proyectos almacenada
export function getProjectsData() {

  return currentProjects;

}

// Abre el modal y carga toda la información del proyecto seleccionado
export function openProjectModal(id) {

  // Busca el proyecto correspondiente al identificador recibido
  const project =
    currentProjects.find(
      item => item.id === id
    );

  // Detiene la ejecución si el proyecto no existe
  if (!project) {
    console.warn(
      `No se encontró el proyecto: ${id}`
    );
    return;
  }

  // Obtiene el elemento principal del modal
  const modal =
    document.getElementById(
      "projectModal"
    );

  // Detiene la ejecución si el modal no está disponible
  if (!modal) {
    console.warn(
      "No se encontró el modal de proyectos."
    );
    return;
  }

  /* ==============================
     OPEN MODAL
  ============================== */

  // Hace visible el modal del proyecto
  modal.classList.remove(
    "hidden"
  );

  // Evita el desplazamiento de la página mientras el modal está abierto
  document.body.classList.add(
    "modal-open"
  );

  /* ==============================
     CAROUSEL
  ============================== */

  // Inicializa los controles del carrusel
  initCarouselControls();

  // Carga los archivos multimedia del proyecto seleccionado en el carrusel
  setCarousel(project);

  /* ==============================
     BASIC INFORMATION
  ============================== */

  // Muestra el título principal del proyecto
  setTextContent(
    "modalTitle",
    project.titulo
  );

  // Muestra la descripción extensa del proyecto
  setTextContent(
    "modalDescription",
    project.descripcionLarga
  );

  // Muestra la categoría del proyecto
  setTextContent(
    "modalCategory",
    project.categoria || "Sin categoría"
  );

  // Muestra el nivel de complejidad del proyecto
  setTextContent(
    "modalLevel",
    project.nivel || "Sin nivel"
  );

  // Muestra el año del proyecto
  setTextContent(
    "modalYear",
    project.año || "Sin año"
  );

  /* ==============================
     PROJECT SUMMARY
  ============================== */

  // Muestra el rol desempeñado en el proyecto
  setTextContent(
    "modalRole",
    project.rol
  );

  // Muestra el estado actual del proyecto con formato legible
  setTextContent(
    "modalStatus",
    project.estado.replace('-', ' ').toUpperCase()
  );

  // Muestra la duración del proyecto
  setTextContent(
    "modalDuration",
    project.duracion
  );

  // Aplica al bloque de estado la clase o atributo correspondiente
  setProjectStatus(
    project.estado
  );

  // Controla la visibilidad del bloque del rol
  toggleDetailBlock(
    "modalRoleBlock",
    project.rol
  );

  // Controla la visibilidad del bloque del estado
  toggleDetailBlock(
    "modalStatusBlock",
    project.estado
  );

  // Controla la visibilidad del bloque de duración
  toggleDetailBlock(
    "modalDurationBlock",
    project.duracion
  );

  /* ==============================
     STACK
  ============================== */

  // Renderiza las tecnologías utilizadas en el proyecto
  renderStack(
    project.stack
  );

  /* ==============================
     CASE STUDY TEXT
  ============================== */

  // Muestra el objetivo principal del proyecto
  setTextContent(
    "modalObjective",
    project.objetivo
  );

  // Muestra el problema que aborda el proyecto
  setTextContent(
    "modalProblem",
    project.problema
  );

  // Muestra la solución implementada
  setTextContent(
    "modalSolution",
    project.solucion
  );

  // Muestra la participación realizada en el proyecto
  setTextContent(
    "modalParticipation",
    project.participacion
  );

  /* ==============================
     CASE STUDY LISTS
  ============================== */

  // Renderiza la lista de características principales
  renderList(
    "modalFeatures",
    project.caracteristicas
  );

  // Renderiza la lista de retos encontrados durante el desarrollo
  renderList(
    "modalChallenges",
    project.retos
  );

  // Renderiza la lista de aprendizajes obtenidos
  renderList(
    "modalLearnings",
    project.aprendizajes
  );

  /* ==============================
     CASE STUDY VISIBILITY
  ============================== */

  // Controla la visibilidad del bloque del objetivo
  toggleDetailBlock(
    "modalObjectiveBlock",
    project.objetivo
  );

  // Controla la visibilidad del bloque del problema
  toggleDetailBlock(
    "modalProblemBlock",
    project.problema
  );

  // Controla la visibilidad del bloque de solución
  toggleDetailBlock(
    "modalSolutionBlock",
    project.solucion
  );

  // Controla la visibilidad del bloque de participación
  toggleDetailBlock(
    "modalParticipationBlock",
    project.participacion
  );

  // Controla la visibilidad del bloque de características
  toggleDetailBlock(
    "modalFeaturesBlock",
    project.caracteristicas
  );

  // Controla la visibilidad del bloque de retos
  toggleDetailBlock(
    "modalChallengesBlock",
    project.retos
  );

  // Controla la visibilidad del bloque de aprendizajes
  toggleDetailBlock(
    "modalLearningsBlock",
    project.aprendizajes
  );

  /* ==============================
     LINKS
  ============================== */

  // Configura el enlace hacia la demostración del proyecto
  setProjectLink(
    "modalDemo",
    project.demo
  );

  // Configura el enlace hacia el código fuente del proyecto
  setProjectLink(
    "modalCode",
    project.codigo
  );


  /* ==============================
   PROJECT NAVIGATION
  ============================== */

  // Guarda el identificador del proyecto actualmente abierto
  currentProjectId =
    project.id;

  // Inicializa los controles de navegación entre proyectos
  initModalProjectNavigation();

  // Actualiza los títulos y referencias de navegación
  updateModalProjectNavigation(
    project.id
  );


  /* ==============================
     ACCESSIBILITY
  ============================== */

  // Obtiene el botón utilizado para cerrar el modal
  const closeButton =
    modal.querySelector(
      ".modal-close"
    );

  // Coloca el foco en el botón de cierre para facilitar la navegación con teclado
  closeButton?.focus();
}

// Escucha las teclas utilizadas para controlar el modal mediante el teclado
document.addEventListener(
  "keydown",
  handleModalKeyboardNavigation
);

// Actualiza el contenido de un elemento HTML mediante su identificador
function setTextContent(
  elementId,
  value
) {

  // Busca el elemento que recibirá el contenido
  const element =
    document.getElementById(
      elementId
    );

  // Detiene la función si el elemento no existe
  if (!element) return;

  // Asigna el valor recibido o una cadena vacía si no existe
  element.textContent =
    value ?? "";
}

// Renderiza las tecnologías utilizadas por el proyecto
function renderStack(
  technologies = []
) {

  // Obtiene el contenedor donde se mostrarán las tecnologías
  const stackContainer =
    document.getElementById(
      "modalStack"
    );

  // Detiene la función si el contenedor no existe
  if (!stackContainer) {
    return;
  }

  // Limpia las tecnologías mostradas anteriormente
  stackContainer.innerHTML = "";

  // Comprueba si existen tecnologías válidas para mostrar
  if (
    !Array.isArray(technologies) ||
    !technologies.length
  ) {

    // Crea un mensaje cuando no hay tecnologías especificadas
    const emptyMessage =
      document.createElement(
        "span"
      );

    emptyMessage.textContent =
      "Tecnologías no especificadas";

    stackContainer.appendChild(
      emptyMessage
    );

    return;
  }

  // Recorre las tecnologías válidas y crea una etiqueta para cada una
  technologies
    .filter(Boolean)
    .forEach(technology => {

      // Crea el elemento visual de la tecnología
      const badge =
        document.createElement(
          "span"
        );

      // Coloca el nombre de la tecnología dentro de la etiqueta
      badge.textContent =
        technology;

      // Agrega la etiqueta al contenedor de tecnologías
      stackContainer.appendChild(
        badge
      );
    });
}

// Renderiza una lista de elementos dentro de un contenedor HTML
function renderList(
  elementId,
  items = []
) {

  // Obtiene el elemento donde se mostrará la lista
  const list =
    document.getElementById(
      elementId
    );

  // Detiene la función si el elemento no existe
  if (!list) return;

  // Limpia los elementos existentes antes de renderizar la nueva lista
  list.innerHTML = "";

  // Comprueba que los datos recibidos sean una lista
  if (!Array.isArray(items)) {
    return;
  }

  // Recorre los elementos válidos de la lista
  items
    .filter(Boolean)
    .forEach(item => {

      // Crea un nuevo elemento de lista
      const listItem =
        document.createElement(
          "li"
        );

      // Coloca el contenido del elemento dentro de la lista
      listItem.textContent =
        item;

      // Agrega el elemento al contenedor
      list.appendChild(
        listItem
      );
    });
}

// Controla la visibilidad de un bloque según si tiene contenido
function toggleDetailBlock(
  blockId,
  content
) {

  // Obtiene el bloque que se desea mostrar u ocultar
  const block =
    document.getElementById(
      blockId
    );

  // Detiene la función si el bloque no existe
  if (!block) return;

  // Determina si existe contenido válido, ya sea una lista o un valor individual
  const hasContent =
    Array.isArray(content)
      ? content.some(item =>
        Boolean(
          String(item || "")
            .trim()
        )
      )
      : Boolean(
        String(content || "")
          .trim()
      );

  // Oculta el bloque cuando no contiene información válida
  block.classList.toggle(
    "hidden",
    !hasContent
  );
}

// Configura un enlace del proyecto y controla su disponibilidad
function setProjectLink(
  elementId,
  url
) {

  // Obtiene el elemento que funcionará como enlace
  const link =
    document.getElementById(
      elementId
    );

  // Detiene la función si el enlace no existe
  if (!link) return;

  // Limpia y normaliza la URL recibida
  const normalizedUrl =
    String(url || "").trim();

  // Comprueba que exista una URL válida diferente de "#"
  const hasValidUrl =
    normalizedUrl &&
    normalizedUrl !== "#";

  // Configura el enlace cuando existe una URL válida
  if (hasValidUrl) {

    link.href =
      normalizedUrl;

    link.classList.remove(
      "hidden"
    );

    link.removeAttribute(
      "aria-disabled"
    );

    link.removeAttribute(
      "tabindex"
    );

    return;
  }

  // Elimina el destino del enlace cuando no existe una URL válida
  link.removeAttribute(
    "href"
  );

  // Oculta el enlace no disponible
  link.classList.add(
    "hidden"
  );

  // Indica mediante accesibilidad que el enlace está deshabilitado
  link.setAttribute(
    "aria-disabled",
    "true"
  );

  // Evita que el enlace deshabilitado sea seleccionado mediante teclado
  link.setAttribute(
    "tabindex",
    "-1"
  );
}

// Cierra el modal del proyecto actualmente abierto
export function closeProjectModal() {

  // Obtiene el elemento principal del modal
  const modal =
    document.getElementById(
      "projectModal"
    );

  // Detiene la función si el modal no existe
  if (!modal) return;

  // Oculta el modal
  modal.classList.add(
    "hidden"
  );

  // Permite nuevamente el desplazamiento de la página
  document.body.classList.remove(
    "modal-open"
  );

  // Notifica al resto de la aplicación que el modal fue cerrado
  window.dispatchEvent(
    new CustomEvent(
      "projectModalClosed"
    )
  );
}

// Configura el estado visual del proyecto mediante un atributo data
function setProjectStatus(
  status
) {

  // Obtiene el bloque que contiene el estado del proyecto
  const statusBlock =
    document.getElementById(
      "modalStatusBlock"
    );

  // Detiene la función si el bloque no existe
  if (!statusBlock) return;

  // Normaliza el texto del estado para utilizarlo como identificador visual
  const normalizedStatus =
    String(status || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(/\s+/g, "-");

  // Guarda el estado normalizado en un atributo data
  statusBlock.dataset.status =
    normalizedStatus;
}

// Obtiene los proyectos anterior y siguiente respecto al proyecto actual
function getProjectNavigation(
  projectId
) {

  // Comprueba que existan proyectos disponibles
  if (!currentProjects.length) {
    return null;
  }

  // Busca la posición del proyecto actual dentro de la lista
  const currentIndex =
    currentProjects.findIndex(
      project =>
        project.id === projectId
    );

  // Detiene la función si el proyecto no se encuentra
  if (currentIndex === -1) {
    return null;
  }

  // Calcula el índice del proyecto anterior y vuelve al último cuando se encuentra al inicio
  const previousIndex =
    currentIndex === 0
      ? currentProjects.length - 1
      : currentIndex - 1;

  // Calcula el índice del proyecto siguiente y vuelve al primero cuando se encuentra al final
  const nextIndex =
    currentIndex ===
      currentProjects.length - 1
      ? 0
      : currentIndex + 1;

  // Devuelve las referencias a los proyectos anterior y siguiente
  return {
    previous:
      currentProjects[previousIndex],
    next:
      currentProjects[nextIndex]
  };
}

// Actualiza los botones y títulos de navegación del modal
function updateModalProjectNavigation(
  projectId
) {

  // Obtiene los proyectos anterior y siguiente
  const navigation =
    getProjectNavigation(
      projectId
    );

  // Obtiene el botón para navegar al proyecto anterior
  const previousButton =
    document.getElementById(
      "modalPreviousProject"
    );

  // Obtiene el botón para navegar al proyecto siguiente
  const nextButton =
    document.getElementById(
      "modalNextProject"
    );

  // Obtiene el elemento donde se mostrará el título anterior
  const previousTitle =
    document.getElementById(
      "modalPreviousProjectTitle"
    );

  // Obtiene el elemento donde se mostrará el título siguiente
  const nextTitle =
    document.getElementById(
      "modalNextProjectTitle"
    );

  // Detiene la función si no existe navegación o alguno de los botones necesarios
  if (
    !navigation ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  // Guarda el identificador del proyecto anterior en el botón correspondiente
  previousButton.dataset.projectId =
    navigation.previous.id;

  // Guarda el identificador del proyecto siguiente en el botón correspondiente
  nextButton.dataset.projectId =
    navigation.next.id;

  // Actualiza el título del proyecto anterior
  if (previousTitle) {
    previousTitle.textContent =
      removeProjectEmoji(
        navigation.previous.titulo
      );
  }

  // Actualiza el título del proyecto siguiente
  if (nextTitle) {
    nextTitle.textContent =
      removeProjectEmoji(
        navigation.next.titulo
      );
  }
}

// Inicializa los eventos de navegación del modal una sola vez
function initModalProjectNavigation() {

  // Evita registrar los mismos eventos más de una vez
  if (modalNavigationInitialized) {
    return;
  }

  // Obtiene el botón para navegar al proyecto anterior
  const previousButton =
    document.getElementById(
      "modalPreviousProject"
    );

  // Obtiene el botón para navegar al proyecto siguiente
  const nextButton =
    document.getElementById(
      "modalNextProject"
    );

  // Asocia el evento de clic del botón anterior
  previousButton?.addEventListener(
    "click",
    handleModalProjectNavigation
  );

  // Asocia el evento de clic del botón siguiente
  nextButton?.addEventListener(
    "click",
    handleModalProjectNavigation
  );

  // Marca la navegación como inicializada
  modalNavigationInitialized = true;
}

// Procesa la navegación entre proyectos mediante los botones del modal
function handleModalProjectNavigation(
  event
) {

  // Obtiene el identificador del proyecto almacenado en el botón presionado
  const projectId =
    event.currentTarget
      .dataset.projectId;

  // Detiene la función si el botón no contiene un identificador
  if (!projectId) return;

  // Abre el proyecto seleccionado
  openProjectModal(
    projectId
  );

  // Regresa el contenido del modal a la parte superior
  scrollModalToTop();
}

// Desplaza suavemente el contenido interno del modal hasta el inicio
function scrollModalToTop() {

  // Obtiene el contenedor desplazable del contenido del modal
  const modalContent =
    document.querySelector(
      "#projectModal .modal-content"
    );

  // Realiza el desplazamiento suave hacia la parte superior
  modalContent?.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Elimina los emojis u otros caracteres iniciales del título del proyecto
function removeProjectEmoji(
  title
) {

  // Devuelve el título sin caracteres especiales al inicio
  return String(title || "")
    .replace(
      /^[^\p{L}\p{N}]+/u,
      ""
    )
    .trim();
}

// Gestiona la navegación del modal mediante el teclado
function handleModalKeyboardNavigation(
  event
) {

  // Obtiene el modal actual
  const modal =
    document.getElementById(
      "projectModal"
    );

  // Comprueba si el modal está actualmente visible
  const isModalOpen =
    modal &&
    !modal.classList.contains(
      "hidden"
    );

  // No realiza ninguna acción si el modal está cerrado
  if (!isModalOpen) return;

  // Cierra el modal al presionar Escape
  if (event.key === "Escape") {
    closeProjectModal();
    return;
  }

  // Navega al proyecto anterior con la flecha izquierda
  if (event.key === "ArrowLeft") {
    navigateModalProject(
      "previous"
    );
    return;
  }

  // Navega al proyecto siguiente con la flecha derecha
  if (event.key === "ArrowRight") {
    navigateModalProject(
      "next"
    );
  }
}

// Navega hacia el proyecto anterior o siguiente según la dirección indicada
function navigateModalProject(
  direction
) {

  // Obtiene los proyectos disponibles para navegación
  const navigation =
    getProjectNavigation(
      currentProjectId
    );

  // Detiene la función si no existe información de navegación
  if (!navigation) return;

  // Selecciona el proyecto de destino según la dirección recibida
  const targetProject =
    direction === "previous"
      ? navigation.previous
      : navigation.next;

  // Abre el proyecto de destino
  openProjectModal(
    targetProject.id
  );

  // Regresa el contenido del modal a la parte superior
  scrollModalToTop();
}