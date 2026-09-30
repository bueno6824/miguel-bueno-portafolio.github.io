// Obtiene el contenedor donde se mostrarán los enlaces de navegación.
const navbarLinks = document.getElementById('navbarLinks')

// Obtiene el botón utilizado para abrir o cerrar el menú móvil.
const menuButton = document.getElementById('menuButton')

// Recorre la lista de enlaces de navegación para generar cada elemento dinámicamente.
navLinks.forEach(link => {

  // Crea un elemento de lista para cada enlace.
  const li = document.createElement('li')

  // Genera el enlace utilizando la URL y el nombre definidos en navLinks.
  li.innerHTML = `

    <a href="${link.href}">

      ${link.name}

    </a>

  `

  // Agrega el elemento generado al contenedor de navegación.
  navbarLinks.appendChild(li)

})

// Alterna la clase active para mostrar u ocultar el menú móvil.
menuButton.addEventListener('click', () => {

  navbarLinks.classList.toggle('active')

})