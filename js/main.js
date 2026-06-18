import {
  renderNavbar,
  initNavbarMobile
} from "../components/navbar/navbar.js";

import { initHeroParallax } from "../components/hero/hero.js";
import { initScrollReveal } from "./modules/scrollReveal.js";

import { loadProjects } from "../components/projects/proyects.js";

import {
  openProjectModal,
  closeProjectModal,
  setProjectsData
} from "../components/modals/modal.js";

import { nextMedia, prevMedia } from "./modules/carusel.js";

import { initChatbot } from "../components/chatbot/chatbot.js";

import "../components/contact/contact.js";

import { initFooterClock } from "../components/footer/footer.js";

import { initScrollFeatures} from "./modules/scroll.js";

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("MAIN INICIADO 🚀");

  renderNavbar();
  initNavbarMobile();
  initHeroParallax();
  initScrollReveal();
  initChatbot();
  initFooterClock();
  initScrollFeatures();

  const nextButton = document.querySelector(".carousel-next");
  const prevButton = document.querySelector(".carousel-prev");

  if (nextButton) {
    nextButton.addEventListener("click", nextMedia);
  }

  if (prevButton) {
    prevButton.addEventListener("click", prevMedia);
  }

  try {
    const res = await fetch("./data/proyectos.json");
    const data = await res.json();

    console.log("DATA:", data);

    setProjectsData(data);
    loadProjects();
  } catch (error) {
    console.error("Error cargando proyectos:", error);
  }
});