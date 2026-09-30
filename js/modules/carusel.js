let mediaList = [];

let currentIndex = 0;

let controlsInitialized = false;


/* =========================================
   CAROUSEL DATA
========================================= */

/* Establece los archivos multimedia del proyecto y reinicia la posición del carrusel. */
export function setCarousel(project) {

  // Normaliza la información multimedia disponible en el proyecto.
  mediaList = normalizeMedia(project);

  // Comienza siempre desde el primer elemento multimedia.
  currentIndex = 0;

  // Renderiza el contenido multimedia actual.
  renderMedia();

  // Actualiza la visibilidad de los botones de navegación.
  updateButtons();

}


/* =========================================
   NORMALIZE MEDIA
========================================= */

/* Obtiene la lista multimedia del proyecto utilizando las diferentes fuentes disponibles. */
function normalizeMedia(project) {

  // Devuelve una lista vacía si no existe un proyecto válido.
  if (!project) {

    return [];

  }

  // Utiliza directamente la lista multimedia del proyecto cuando contiene elementos.
  if (

    project.media &&

    project.media.length > 0

  ) {

    return project.media;

  }

  // Convierte las imágenes grandes del proyecto al formato utilizado por el carrusel.
  if (

    project.imagenLarge &&

    project.imagenLarge.length > 0

  ) {

    return project.imagenLarge.map(src => ({

      type: "image",

      src

    }));

  }

  // Utiliza la imagen de portada como último recurso multimedia.
  if (project.imagenPortada) {

    return [

      {

        type: "image",

        src: project.imagenPortada

      }

    ];

  }

  // Devuelve una lista vacía cuando el proyecto no tiene contenido multimedia.
  return [];

}


/* =========================================
   RENDER MEDIA
========================================= */

/* Renderiza en el DOM el elemento multimedia correspondiente a la posición actual. */
function renderMedia() {

  // Obtiene el contenedor principal del carrusel.
  const carouselTrack =

    document.getElementById("carouselTrack");

  // Detiene la ejecución si el contenedor no existe.
  if (!carouselTrack) return;

  // Limpia el contenido multimedia anterior.
  carouselTrack.innerHTML = "";

  // Muestra un mensaje cuando no existen elementos multimedia.
  if (mediaList.length === 0) {

    carouselTrack.innerHTML = `

      <div class="carousel-empty">

        Sin contenido multimedia

      </div>

    `;

    return;

  }

  // Obtiene el elemento multimedia correspondiente al índice actual.
  const media = mediaList[currentIndex];

  // Renderiza un iframe cuando el elemento corresponde a un video.
  if (media.type === "video") {

    carouselTrack.innerHTML = `

      <div class="carousel-item">

        <iframe

          class="carousel-video"

          src="${media.src}"

          title="Video del proyecto"

          frameborder="0"

          allowfullscreen

        ></iframe>

      </div>

    `;

    return;

  }

  // Renderiza una imagen cuando el elemento multimedia no es un video.
  carouselTrack.innerHTML = `

    <div class="carousel-item">

      <img

        class="carousel-image"

        src="${media.src}"

        alt="Imagen del proyecto"

        loading="lazy"

      />

    </div>

  `;

}


/* =========================================
   NEXT MEDIA
========================================= */

/* Avanza al siguiente elemento multimedia del carrusel. */
export function nextMedia() {

  // No realiza cambios cuando existe uno o ningún elemento multimedia.
  if (mediaList.length <= 1) return;

  // Avanza una posición dentro de la lista.
  currentIndex++;

  // Regresa al primer elemento cuando se alcanza el final de la lista.
  if (currentIndex >= mediaList.length) {

    currentIndex = 0;

  }

  // Renderiza el nuevo elemento multimedia.
  renderMedia();

  // Actualiza los botones de navegación.
  updateButtons();

}


/* =========================================
   PREVIOUS MEDIA
========================================= */

/* Retrocede al elemento multimedia anterior del carrusel. */
export function prevMedia() {

  // No realiza cambios cuando existe uno o ningún elemento multimedia.
  if (mediaList.length <= 1) return;

  // Retrocede una posición dentro de la lista.
  currentIndex--;

  // Regresa al último elemento cuando se alcanza el inicio de la lista.
  if (currentIndex < 0) {

    currentIndex = mediaList.length - 1;

  }

  // Renderiza el nuevo elemento multimedia.
  renderMedia();

  // Actualiza los botones de navegación.
  updateButtons();

}


/* =========================================
   NAVIGATION BUTTONS
========================================= */

/* Controla la visibilidad de los botones según la cantidad de elementos multimedia. */
function updateButtons() {

  // Obtiene el botón para retroceder.
  const prevButton =

    document.querySelector(".carousel-prev");

  // Obtiene el botón para avanzar.
  const nextButton =

    document.querySelector(".carousel-next");

  // Determina si existen suficientes elementos para utilizar la navegación.
  const hasMultipleMedia =

    mediaList.length > 1;

  // Muestra u oculta el botón anterior según la cantidad de contenido.
  if (prevButton) {

    prevButton.style.display =

      hasMultipleMedia ? "flex" : "none";

  }

  // Muestra u oculta el botón siguiente según la cantidad de contenido.
  if (nextButton) {

    nextButton.style.display =

      hasMultipleMedia ? "flex" : "none";

  }

}


/* =========================================
   CAROUSEL CONTROLS
========================================= */

/* Inicializa los eventos de los botones de navegación del carrusel. */
export function initCarouselControls() {

  // Evita registrar los eventos de navegación más de una vez.
  if (controlsInitialized) return;

  // Obtiene el botón para retroceder.
  const prevButton =

    document.querySelector(".carousel-prev");

  // Obtiene el botón para avanzar.
  const nextButton =

    document.querySelector(".carousel-next");

  // Asigna la función de retroceso al botón anterior.
  if (prevButton) {

    prevButton.addEventListener(

      "click",

      prevMedia

    );

  }

  // Asigna la función de avance al botón siguiente.
  if (nextButton) {

    nextButton.addEventListener(

      "click",

      nextMedia

    );

  }

  // Marca los controles como inicializados.
  controlsInitialized = true;

}