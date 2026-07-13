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
  const project = currentProjects.find(p => p.id === id);

  if (!project) return;

  const modal = document.getElementById("projectModal");

  modal.classList.remove("hidden");

  initCarouselControls();

  setCarousel(project);

  document.getElementById("modalTitle").textContent =
    project.titulo;

  document.getElementById("modalDescription").textContent =
    project.descripcionLarga;

  document.getElementById("modalStack").innerHTML =
    (project.stack || [])
      .map(t => `<span>${t}</span>`)
      .join("");
      
      document.getElementById("modalCategory")
  .textContent =
  project.categoria || "Frontend";

document.getElementById("modalLevel")
  .textContent =
  project.nivel || "Básico";

document.getElementById("modalYear")
  .textContent =
  project.año || "2026";

  document.getElementById("modalDemo").href =
    project.demo;

  document.getElementById("modalCode").href =
    project.codigo;
}

export function closeProjectModal() {
  document
    .getElementById("projectModal")
    .classList.add("hidden");
    
    window.dispatchEvent(
  new CustomEvent(
    "projectModalClosed"
  )
);
}