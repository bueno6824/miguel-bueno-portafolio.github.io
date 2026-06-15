import {
  setCarousel,
  initCarouselControls
} from "../../js/modules/carousel.js";

let currentProjects = [];

export function setProjectsData(data) {
  currentProjects = data;
  console.log("setproyectdata 🚀");
}

export function getProjectsData() {
  console.log("getProjectsData 🚀");
  return currentProjects;
}

export function openProjectModal(id) {
  const project = currentProjects.find(p => p.id === id);

  if (!project) return;

  const modal = document.getElementById("projectModal");

  modal.classList.remove("hidden");

  // 🚀 Carrusel
  setCarousel(project);

  document.getElementById("modalTitle").textContent =
    project.titulo;

  document.getElementById("modalDescription").textContent =
    project.descripcionLarga;

  document.getElementById("modalStack").innerHTML =
    (project.stack || [])
      .map(t => `<span>${t}</span>`)
      .join("");

  document.getElementById("modalDemo").href =
    project.demo;

  document.getElementById("modalCode").href =
    project.codigo;
}

export function closeProjectModal() {
  document
    .getElementById("projectModal")
    .classList.add("hidden");
}

// 🚀 Inicializa botones
initCarouselControls();