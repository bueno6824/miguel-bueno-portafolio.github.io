let mediaList = [];
let currentIndex = 0;
let controlsInitialized = false;

export function setCarousel(project) {
  mediaList = normalizeMedia(project);
  currentIndex = 0;

  renderMedia();
  updateButtons();
}

function normalizeMedia(project) {
  if (!project) {
    return [];
  }

  if (
    project.media &&
    project.media.length > 0
  ) {
    return project.media;
  }

  if (
    project.imagenLarge &&
    project.imagenLarge.length > 0
  ) {
    return project.imagenLarge.map(src => ({
      type: "image",
      src
    }));
  }

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
  const carouselTrack =
    document.getElementById("carouselTrack");

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

  const media = mediaList[currentIndex];

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

export function nextMedia() {
  if (mediaList.length <= 1) return;

  currentIndex++;

  if (currentIndex >= mediaList.length) {
    currentIndex = 0;
  }

  renderMedia();
  updateButtons();
}

export function prevMedia() {
  if (mediaList.length <= 1) return;

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = mediaList.length - 1;
  }

  renderMedia();
  updateButtons();
}

function updateButtons() {
  const prevButton =
    document.querySelector(".carousel-prev");

  const nextButton =
    document.querySelector(".carousel-next");

  const hasMultipleMedia =
    mediaList.length > 1;

  if (prevButton) {
    prevButton.style.display =
      hasMultipleMedia ? "flex" : "none";
  }

  if (nextButton) {
    nextButton.style.display =
      hasMultipleMedia ? "flex" : "none";
  }
}

export function initCarouselControls() {
  if (controlsInitialized) return;

  const prevButton =
    document.querySelector(".carousel-prev");

  const nextButton =
    document.querySelector(".carousel-next");

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

  controlsInitialized = true;
}