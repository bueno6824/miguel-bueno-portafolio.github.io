import {
  renderNavbar,
  initNavbarMobile
} from "../components/navbar/navbar.js";

import {
  initHeroParallax
} from "../components/hero/hero.js";

import {
  initScrollReveal
} from "./modules/scrollReveal.js";

import {
  loadProjects
} from "../components/projects/proyects.js";

import {
  openProjectModal,
  closeProjectModal,
  setProjectsData
} from "../components/modals/modal.js";

import {
  nextMedia,
  prevMedia
} from "./modules/carusel.js";

import "../components/contact/contact.js";

import {
  initFooterClock
} from "../components/footer/footer.js";

import {
  initScrollFeatures
} from "./modules/scroll.js";


window.openProjectModal =
  openProjectModal;

window.closeProjectModal =
  closeProjectModal;


/* ==============================
   CHATBOT LAZY LOADING
============================== */

let chatbotLoaded = false;
let chatbotLoading = false;

const chatbotToggle =
  document.getElementById(
    "chatbotToggle"
  );


function loadStylesheet(
  href,
  id
) {
  const existingStylesheet =
    id
      ? document.getElementById(id)
      : document.querySelector(
          `link[href="${href}"]`
        );

  if (existingStylesheet) {
    return Promise.resolve(
      existingStylesheet
    );
  }

  return new Promise(
    (resolve, reject) => {
      const link =
        document.createElement("link");

      link.rel = "stylesheet";
      link.href = href;

      if (id) {
        link.id = id;
      }

      link.addEventListener(
        "load",
        () => resolve(link),
        {
          once: true
        }
      );

      link.addEventListener(
        "error",
        () => {
          link.remove();

          reject(
            new Error(
              `No se pudo cargar ${href}`
            )
          );
        },
        {
          once: true
        }
      );

      document.head.appendChild(
        link
      );
    }
  );
}


async function loadChatbot() {
  if (
    chatbotLoaded ||
    chatbotLoading
  ) {
    return;
  }

  chatbotLoading = true;

  try {
    const [
      ,
      chatbotModule
    ] = await Promise.all([
      loadStylesheet(
        "components/chatbot/chatbot.css",
        "chatbotStyles"
      ),

      import(
        "../components/chatbot/chatbot.js"
      )
    ]);

    chatbotModule.initChatbot({
      openOnInit: true
    });

    chatbotLoaded = true;
  } catch (error) {
    console.error(
      "No se pudo cargar el chatbot:",
      error
    );
  } finally {
    chatbotLoading = false;
  }
}


chatbotToggle?.addEventListener(
  "click",
  loadChatbot,
  {
    once: true
  }
);


/* ==============================
   APP INIT
============================== */

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    renderNavbar();
    initNavbarMobile();
    initHeroParallax();
    initScrollReveal();
    initFooterClock();
    initScrollFeatures();

    const nextButton =
      document.querySelector(
        ".carousel-next"
      );

    const prevButton =
      document.querySelector(
        ".carousel-prev"
      );

    nextButton?.addEventListener(
      "click",
      nextMedia
    );

    prevButton?.addEventListener(
      "click",
      prevMedia
    );

    try {
      const response =
        await fetch(
          "./data/proyectos.json"
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      setProjectsData(data);
      loadProjects();
    } catch (error) {
      console.error(
        "Error cargando proyectos:",
        error
      );
    }
  }
);