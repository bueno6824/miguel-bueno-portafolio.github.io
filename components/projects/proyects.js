import { getProjectsData } from "../modals/modal.js";

export function loadProjects() {

  const projectsData = getProjectsData(); // 👈 CLAVE

  const container = document.getElementById("projectsGrid");
  if (!container) return;

  if (!projectsData) return;
console.log(projectsData)
  container.innerHTML = projectsData.map(proyecto => `
    <div class="card project-card reveal active">
      <div class="project-image">
        <img src="${proyecto.imagenPortada}" alt="${proyecto.titulo}">
      </div>

      <h3>${proyecto.titulo}</h3>

      <p>${proyecto.descripcionCorta}</p>

      <div class="badges">
        ${(proyecto.stack || []).map(t => `<span>${t}</span>`).join("")}
      </div>

      <div class="project-links">
        <button class="btn secondary" onclick="openProjectModal('${proyecto.id}')">
          Ver más
        </button>
      </div>

    </div>
  `).join('');
}