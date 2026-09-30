import {

  renderNavbar,

  initNavbarMobile

} from "../components/navbar/navbar.js";

import {

  initHeroParallax,

  updateHeroProjectCount

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

import {

  initProjectService,

  getMainProjects

} from "./services/projectService.js";

import {

  renderProjectFilters

}

  from

  "../components/projects/projectFilters.js";

import {

  initProjectSearch

} from "../components/projects/projectSearch.js";

import {

  initProjectSort

} from "../components/projects/projectSort.js";

import {

  renderProjectStats

} from "../components/projects/projectStats.js";

import {

  renderProjectTimeline

} from "../components/projects/projectTimeline.js";

/*
 * Expone las funciones del modal en window
 * para que puedan ser utilizadas desde
 * otros elementos o eventos externos.
 */
window.openProjectModal =

  openProjectModal;

window.closeProjectModal =

  closeProjectModal;

/* ==============================
   CHATBOT LAZY LOADING
============================== */

/*
 * Indica si el chatbot ya fue cargado
 * y está listo para utilizarse.
 */
let chatbotLoaded = false;

/*
 * Evita iniciar varias cargas del chatbot
 * al mismo tiempo.
 */
let chatbotLoading = false;

/*
 * Obtiene el botón que activa la carga
 * del chatbot.
 */
const chatbotToggle =

  document.getElementById(

    "chatbotToggle"

  );

/**
 * Carga dinámicamente una hoja de estilos.
 *
 * Si la hoja ya existe en el documento,
 * reutiliza el elemento existente.
 */
function loadStylesheet(

  href,

  id

) {

  /*
   * Busca una hoja de estilos existente
   * utilizando su ID o su URL.
   */
  const existingStylesheet =

    id

      ? document.getElementById(id)

      : document.querySelector(

        `link[href="${href}"]`

      );

  /*
   * Si ya está cargada, devuelve
   * inmediatamente la referencia existente.
   */
  if (existingStylesheet) {

    return Promise.resolve(

      existingStylesheet

    );

  }

  /*
   * Crea una Promise que se resolverá
   * cuando la hoja de estilos termine de cargar.
   */
  return new Promise(

    (resolve, reject) => {

      /*
       * Crea dinámicamente el elemento link.
       */
      const link =

        document.createElement("link");

      link.rel = "stylesheet";

      link.href = href;

      /*
       * Asigna un ID cuando fue proporcionado
       * para poder identificar posteriormente
       * la hoja de estilos.
       */
      if (id) {

        link.id = id;

      }

      /*
       * Resuelve la Promise cuando el CSS
       * termina de cargarse correctamente.
       */
      link.addEventListener(

        "load",

        () => resolve(link),

        {

          once: true

        }

      );

      /*
       * Si ocurre un error, elimina el elemento
       * y rechaza la Promise con información
       * sobre el recurso que no pudo cargarse.
       */
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

      /*
       * Agrega la hoja de estilos al head
       * para iniciar su carga.
       */
      document.head.appendChild(

        link

      );

    }

  );

}

/**
 * Carga el chatbot únicamente cuando
 * el usuario intenta utilizarlo.
 *
 * Esto reduce la carga inicial de la página.
 */
async function loadChatbot() {

  /*
   * Evita cargar nuevamente el chatbot
   * si ya fue cargado o si actualmente
   * se encuentra en proceso de carga.
   */
  if (

    chatbotLoaded ||

    chatbotLoading

  ) {

    return;

  }

  chatbotLoading = true;

  try {

    /*
     * Carga en paralelo el CSS del chatbot
     * y su módulo JavaScript.
     */
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

    /*
     * Inicializa el chatbot indicando
     * que debe abrirse inmediatamente.
     */
    chatbotModule.initChatbot({

      openOnInit: true

    });

    chatbotLoaded = true;

  } catch (error) {

    /*
     * Registra cualquier error producido
     * durante la carga dinámica.
     */
    console.error(

      "No se pudo cargar el chatbot:",

      error

    );

  } finally {

    /*
     * Libera el bloqueo de carga para permitir
     * futuros intentos si fuera necesario.
     */
    chatbotLoading = false;

  }

}

/*
 * Inicia la carga del chatbot cuando el usuario
 * presiona su botón por primera vez.
 *
 * "once: true" evita registrar nuevamente
 * el mismo evento después del primer clic.
 */
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

/*
 * Espera a que todo el documento HTML
 * haya sido cargado antes de inicializar
 * los diferentes módulos de la aplicación.
 */
document.addEventListener(

  "DOMContentLoaded",

  async () => {

    /*
     * Inicializa la navegación principal.
     */
    renderNavbar();

    /*
     * Inicializa el comportamiento del menú
     * de navegación en dispositivos móviles.
     */
    initNavbarMobile();

    /*
     * Inicializa el efecto parallax del hero.
     */
    initHeroParallax();

    /*
     * Inicializa las animaciones de aparición
     * de los elementos al entrar en pantalla.
     */
    initScrollReveal();

    /*
     * Inicializa el reloj del footer.
     */
    initFooterClock();

    /*
     * Inicializa las funciones relacionadas
     * con scroll, progreso y botón de regreso.
     */
    initScrollFeatures();

    /*
     * Obtiene los controles de navegación
     * del carrusel multimedia.
     */
    const nextButton =

      document.querySelector(

        ".carousel-next"

      );

    const prevButton =

      document.querySelector(

        ".carousel-prev"

      );

    /*
     * Conecta los botones del carrusel
     * con sus respectivas funciones.
     */
    nextButton?.addEventListener(

      "click",

      nextMedia

    );

    prevButton?.addEventListener(

      "click",

      prevMedia

    );

    try {

      /*
       * Inicializa el servicio de proyectos
       * y carga los datos desde el repository.
       */
      await initProjectService();

      /*
       * Obtiene los proyectos principales
       * utilizando el orden definido por el servicio.
       */
      const projects =

        getMainProjects();

      /*
       * Si no existen proyectos disponibles,
       * muestra una advertencia y detiene
       * la inicialización dependiente de ellos.
       */
      if (!projects.length) {

        console.warn(

          "No se encontraron proyectos para cargar."

        );

        return;

      }

      /*
       * Comparte los proyectos con el sistema
       * del modal para permitir consultar
       * sus detalles posteriormente.
       */
      setProjectsData(

        projects

      );

      /*
       * Actualiza el contador de proyectos
       * mostrado en la sección hero.
       */
      updateHeroProjectCount(

        projects

      );

      /*
       * Renderiza las tarjetas de proyectos.
       */
      loadProjects(

        projects

      );

      /*
       * Renderiza las estadísticas generales
       * de los proyectos.
       */
      renderProjectStats();

      /*
       * Genera los filtros disponibles
       * según las categorías existentes.
       */
      renderProjectFilters();

      /*
       * Inicializa el buscador de proyectos.
       */
      initProjectSearch();

      /*
       * Inicializa el selector de ordenamiento
       * de proyectos.
       */
      initProjectSort();

      /*
       * Renderiza la línea de tiempo
       * agrupando los proyectos por año.
       */
      renderProjectTimeline();

    } catch (error) {

      /*
       * Captura y registra cualquier error
       * ocurrido durante la carga de proyectos.
       */
      console.error(

        "Error cargando proyectos:",

        error

      );

    }

  }

);