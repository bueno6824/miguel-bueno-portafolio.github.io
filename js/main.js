import {
  renderNavbar,
  initNavbarMobile
} from '../components/navbar/navbar.js';

import { initHeroParallax } from '../components/hero/hero.js';
import { initScrollReveal } from './modules/scrollReveal.js';

import { loadProjects } from "../components/projects/proyects.js";
import { openProjectModal, closeProjectModal, setProjectsData} from "../components/modals/modal.js";

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

renderNavbar();
initNavbarMobile();
initHeroParallax();
initScrollReveal();

document.addEventListener("DOMContentLoaded", async () => {

  console.log("MAIN INICIADO 🚀");

  const res = await fetch("./data/proyectos.json");
  const data = await res.json();

  console.log("DATA:", data);

  setProjectsData(data);   // 👈 modal recibe data
  loadProjects();          // 👈 render cards

});

import { nextMedia, prevMedia } from "../js/modules/carusel.js";
document.addEventListener("DOMContentLoaded", async () => {

  // 👇 BOTONES DEL CARRUSEL (IMPORTANTE)
  document.querySelector(".carousel-next")
    .addEventListener("click", nextMedia);

  document.querySelector(".carousel-prev")
    .addEventListener("click", prevMedia);

});