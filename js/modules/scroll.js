/* Inicializa las funciones relacionadas con el desplazamiento de la página. */
export function initScrollFeatures() {

  // Obtiene la barra que muestra el progreso del desplazamiento.
  const progressBar =
    document.getElementById(
      "scroll-progress"
    );

  // Obtiene el botón utilizado para regresar al inicio de la página.
  const scrollButton =
    document.getElementById(
      "btn-ir-arriba"
    );

  // Actualiza el progreso del scroll y la visibilidad del botón de regreso.
  function updateScroll() {

    // Obtiene la cantidad de desplazamiento vertical actual.
    const scrollTop =
      document.documentElement.scrollTop;

    // Calcula la altura total desplazable de la página.
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // Convierte la posición actual del scroll en un porcentaje.
    const progress =
      (scrollTop / scrollHeight) * 100;

    // Actualiza el ancho de la barra de progreso.
    if (progressBar) {
      progressBar.style.width =
        `${progress}%`;
    }

    // Controla cuándo debe mostrarse el botón para regresar arriba.
    if (scrollButton) {

      // Muestra el botón después de superar los 400 píxeles de desplazamiento.
      if (scrollTop > 400) {

        scrollButton.classList.add(
          "show"
        );

      } else {

        // Oculta el botón cuando el usuario regresa a la parte superior.
        scrollButton.classList.remove(
          "show"
        );

      }

    }

  }

  // Actualiza el progreso cada vez que el usuario realiza scroll.
  window.addEventListener(
    "scroll",
    updateScroll
  );

  // Ejecuta una actualización inicial para establecer el estado correcto.
  updateScroll();

  // Configura el comportamiento del botón de regreso al inicio.
  if (scrollButton) {

    scrollButton.addEventListener(
      "click",
      () => {

        // Desplaza suavemente la página hasta la parte superior.
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }

}