/* Inicializa el sistema de animaciones de aparición al entrar en pantalla. */
export function initScrollReveal() {

  // Obtiene todos los elementos que utilizan alguna clase de animación de entrada.
  const revealElements = document.querySelectorAll(

    ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-zoom"

  );

  // Detiene la ejecución si no existen elementos que deban observarse.
  if (!revealElements.length) return;

  // Crea un observador para detectar cuándo los elementos entran en el área visible.
  const observer = new IntersectionObserver(

    entries => {

      // Recorre cada elemento detectado por el observador.
      entries.forEach(entry => {

        // Comprueba si el elemento está actualmente dentro del viewport.
        if (entry.isIntersecting) {

          // Activa la clase que inicia la animación CSS correspondiente.
          entry.target.classList.add("active");

          // Deja de observar el elemento después de mostrarlo.
          observer.unobserve(entry.target);

        }

      });

    },

    {

      // Define el porcentaje visible necesario para activar la animación.
      threshold: 0.15,

      // Ajusta el área de detección para activar la animación antes de que el elemento llegue al fondo del viewport.
      rootMargin: "0px 0px -60px 0px"

    }

  );

  // Registra cada elemento para detectar su entrada en el viewport.
  revealElements.forEach(element => {

    observer.observe(element);

  });

}