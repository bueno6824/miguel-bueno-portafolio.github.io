let mediaList = [];
let currentIndex = 0;

const carouselTrack =
  document.getElementById("carouselTrack");

const prevButton =
  document.querySelector(".carousel-prev");

const nextButton =
  document.querySelector(".carousel-next");

export function setCarousel(project) {
  mediaList = normalizeMedia(project);

  currentIndex = 0;

  renderMedia();

  updateButtons();
}

function normalizeMedia(project) {

  // 🚀 Prioridad máxima:
  // usar media si existe

  if (
    project.media &&
    project.media.length > 0
  ) {
    return project.media;
  }

  // 🚀 Compatibilidad con imagenLarge

  if (
    project.imagenLarge &&
    project.imagenLarge.length > 0
  ) {
    return project.imagenLarge.map(src => ({
      type: "image",
      src
    }));
  }

  // 🚀 Fallback a portada

  if (project.imagenPortada) {
    return [
      {
        type: "image",
        src: project.imagenPortada
      }
    ];
  }

  return [];
}

function renderMedia() {

  if (!carouselTrack) return;

  carouselTrack.innerHTML = "";

  if (mediaList.length === 0) {

    carouselTrack.innerHTML = `
      <div class="carousel-empty">
        Sin contenido multimedia
      </div>
    `;

    return;
  }

  const media =
    mediaList[currentIndex];

  // 🚀 Video

  if (media.type === "video") {

    carouselTrack.innerHTML = `
      <iframe
        class="carousel-video"
        src="${media.src}"
        title="Video del proyecto"
        frameborder="0"
        allowfullscreen
      >
      </iframe>
    `;

    return;
  }

  // 🚀 Imagen

  carouselTrack.innerHTML = `
    <img
      class="carousel-image"
      src="${media.src}"
      alt="Imagen del proyecto"
      loading="lazy"
    />
  `;
}

export function nextMedia() {

  if (mediaList.length <= 1)
    return;

  currentIndex++;

  if (
    currentIndex >=
    mediaList.length
  ) {
    currentIndex = 0;
  }

  renderMedia();

  updateButtons();
}

export function prevMedia() {

  if (mediaList.length <= 1)
    return;

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex =
      mediaList.length - 1;
  }

  renderMedia();

  updateButtons();
}

function updateButtons() {

  const hasMultipleMedia =
    mediaList.length > 1;

  if (prevButton) {
    prevButton.style.display =
      hasMultipleMedia
        ? "flex"
        : "none";
  }

  if (nextButton) {
    nextButton.style.display =
      hasMultipleMedia
        ? "flex"
        : "none";
  }
}

export function initCarouselControls() {

  if (prevButton) {

    prevButton.addEventListener(
      "click",
      prevMedia
    );
  }

  if (nextButton) {

    nextButton.addEventListener(
      "click",
      nextMedia
    );
  }
}