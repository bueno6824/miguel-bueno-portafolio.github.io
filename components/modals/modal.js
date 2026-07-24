import {
  setCarousel,
  initCarouselControls
} from "../../js/modules/carusel.js";

let currentProjects = [];

export function setProjectsData(data) {
  currentProjects = data;
  
}

export function getProjectsData() {
  return currentProjects;
}

export function openProjectModal(id) {
  const project =
    currentProjects.find(
      item => item.id === id
    );

  if (!project) {
    console.warn(
      `No se encontró el proyecto: ${id}`
    );

    return;
  }

  const modal =
    document.getElementById(
      "projectModal"
    );

  if (!modal) {
    console.warn(
      "No se encontró el modal de proyectos."
    );

    return;
  }

  /* ==============================
     OPEN MODAL
  ============================== */

  modal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "modal-open"
  );

  /* ==============================
     CAROUSEL
  ============================== */

  initCarouselControls();

  setCarousel(project);

  /* ==============================
     BASIC INFORMATION
  ============================== */

  setTextContent(
    "modalTitle",
    project.titulo
  );

  setTextContent(
    "modalDescription",
    project.descripcionLarga
  );

  setTextContent(
    "modalCategory",
    project.categoria || "Sin categoría"
  );

  setTextContent(
    "modalLevel",
    project.nivel || "Sin nivel"
  );

  setTextContent(
    "modalYear",
    project.año || "Sin año"
  );

  /* ==============================
     PROJECT SUMMARY
  ============================== */

  setTextContent(
    "modalRole",
    project.rol
  );

  setTextContent(
    "modalStatus",
    project.estado
  );

  setTextContent(
    "modalDuration",
    project.duracion
  );

  setProjectStatus(
    project.estado
  );

  toggleDetailBlock(
    "modalRoleBlock",
    project.rol
  );

  toggleDetailBlock(
    "modalStatusBlock",
    project.estado
  );

  toggleDetailBlock(
    "modalDurationBlock",
    project.duracion
  );

  /* ==============================
     STACK
  ============================== */

  renderStack(
    project.stack
  );

  /* ==============================
     CASE STUDY TEXT
  ============================== */

  setTextContent(
    "modalObjective",
    project.objetivo
  );

  setTextContent(
    "modalProblem",
    project.problema
  );

  setTextContent(
    "modalSolution",
    project.solucion
  );

  setTextContent(
    "modalParticipation",
    project.participacion
  );

  /* ==============================
     CASE STUDY LISTS
  ============================== */

  renderList(
    "modalFeatures",
    project.caracteristicas
  );

  renderList(
    "modalChallenges",
    project.retos
  );

  renderList(
    "modalLearnings",
    project.aprendizajes
  );

  /* ==============================
     CASE STUDY VISIBILITY
  ============================== */

  toggleDetailBlock(
    "modalObjectiveBlock",
    project.objetivo
  );

  toggleDetailBlock(
    "modalProblemBlock",
    project.problema
  );

  toggleDetailBlock(
    "modalSolutionBlock",
    project.solucion
  );

  toggleDetailBlock(
    "modalParticipationBlock",
    project.participacion
  );

  toggleDetailBlock(
    "modalFeaturesBlock",
    project.caracteristicas
  );

  toggleDetailBlock(
    "modalChallengesBlock",
    project.retos
  );

  toggleDetailBlock(
    "modalLearningsBlock",
    project.aprendizajes
  );

  /* ==============================
     LINKS
  ============================== */

  setProjectLink(
    "modalDemo",
    project.demo
  );

  setProjectLink(
    "modalCode",
    project.codigo
  );

  /* ==============================
     ACCESSIBILITY
  ============================== */

  const closeButton =
    modal.querySelector(
      ".modal-close"
    );

  closeButton?.focus();
}

function setTextContent(
  elementId,
  value
) {
  const element =
    document.getElementById(
      elementId
    );

  if (!element) return;

  element.textContent =
    value ?? "";
}

function renderStack(
  technologies = []
) {
  const stackContainer =
    document.getElementById(
      "modalStack"
    );

  if (!stackContainer) {
    return;
  }

  stackContainer.innerHTML = "";

  if (
    !Array.isArray(technologies) ||
    !technologies.length
  ) {
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

  technologies
    .filter(Boolean)
    .forEach(technology => {
      const badge =
        document.createElement(
          "span"
        );

      badge.textContent =
        technology;

      stackContainer.appendChild(
        badge
      );
    });
}

function renderList(
  elementId,
  items = []
) {
  const list =
    document.getElementById(
      elementId
    );

  if (!list) return;

  list.innerHTML = "";

  if (!Array.isArray(items)) {
    return;
  }

  items
    .filter(Boolean)
    .forEach(item => {
      const listItem =
        document.createElement(
          "li"
        );

      listItem.textContent =
        item;

      list.appendChild(
        listItem
      );
    });
}

function toggleDetailBlock(
  blockId,
  content
) {
  const block =
    document.getElementById(
      blockId
    );

  if (!block) return;

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

  block.classList.toggle(
    "hidden",
    !hasContent
  );
}

function setProjectLink(
  elementId,
  url
) {
  const link =
    document.getElementById(
      elementId
    );

  if (!link) return;

  const normalizedUrl =
    String(url || "").trim();

  const hasValidUrl =
    normalizedUrl &&
    normalizedUrl !== "#";

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

  link.removeAttribute(
    "href"
  );

  link.classList.add(
    "hidden"
  );

  link.setAttribute(
    "aria-disabled",
    "true"
  );

  link.setAttribute(
    "tabindex",
    "-1"
  );
}

export function closeProjectModal() {
  const modal =
    document.getElementById(
      "projectModal"
    );

  if (!modal) return;

  modal.classList.add(
    "hidden"
  );

  document.body.classList.remove(
    "modal-open"
  );

  window.dispatchEvent(
    new CustomEvent(
      "projectModalClosed"
    )
  );
}

function setProjectStatus(
  status
) {
  const statusBlock =
    document.getElementById(
      "modalStatusBlock"
    );

  if (!statusBlock) return;

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

  statusBlock.dataset.status =
    normalizedStatus;
}