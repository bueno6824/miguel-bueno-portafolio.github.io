export function initHeroParallax() {

  const hero =
    document.querySelector('.hero')

  if (!hero) return

  hero.addEventListener('mousemove', (e) => {

    const techs =
      document.querySelectorAll('.floating-tech')

    const x =
      e.clientX / window.innerWidth

    const y =
      e.clientY / window.innerHeight

    techs.forEach((tech, index) => {

      const speed =
        (index + 1) * 15

      tech.style.transform = `
        translate(
          ${x * speed}px,
          ${y * speed}px
        )
      `

    })

  })

}