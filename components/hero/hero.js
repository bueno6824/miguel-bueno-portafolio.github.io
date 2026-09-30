// Inicializa el efecto de parallax de los elementos tecnológicos flotantes del Hero.
export function initHeroParallax() {

  // Obtiene la sección principal del Hero.
  const hero =
    document.querySelector('.hero')

  // Detiene la función si la sección Hero no existe.
  if (!hero) return

  // Escucha el movimiento del cursor dentro de la sección Hero.
  hero.addEventListener('mousemove', (e) => {

    // Obtiene todos los elementos tecnológicos que participan en el efecto flotante.
    const techs =
      document.querySelectorAll('.floating-tech')

    // Calcula la posición horizontal relativa del cursor respecto al ancho de la ventana.
    const x =
      e.clientX / window.innerWidth

    // Calcula la posición vertical relativa del cursor respecto al alto de la ventana.
    const y =
      e.clientY / window.innerHeight

    // Recorre cada elemento tecnológico para aplicar un desplazamiento diferente.
    techs.forEach((tech, index) => {

      // Calcula la velocidad de desplazamiento según la posición del elemento.
      const speed =
        (index + 1) * 15

      // Aplica una transformación de posición basada en el movimiento del cursor.
      tech.style.transform = `
        translate(
          ${x * speed}px,
          ${y * speed}px
        )
      `
    })

  })
}

// Actualiza el contador de proyectos mostrado en el Hero y en la sección About.
export function updateHeroProjectCount(

  projects

) {

  // Obtiene la cantidad de proyectos cuando se recibe un arreglo válido.
  const projectCount =
    Array.isArray(projects)
      ? projects.length
      : 0;

  // Agrega el símbolo "+" al número mostrado visualmente.
  const formattedCount =
    `${projectCount}+`;

  // Obtiene el elemento del contador de proyectos del Hero.
  const heroCount =
    document.getElementById(
      "heroProjectCount"
    );

  // Obtiene el elemento del contador de proyectos de la sección About.
  const aboutCount =
    document.getElementById(
      "aboutProjectCount"
    );

  // Actualiza el contador del Hero si el elemento existe.
  if (heroCount) {

    heroCount.textContent =
      formattedCount;

  }

  // Actualiza el contador de la sección About si el elemento existe.
  if (aboutCount) {

    aboutCount.textContent =
      formattedCount;

  }

}