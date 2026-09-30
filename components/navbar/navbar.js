import { navLinks }
  from './navbarData.js'

// Renderiza dinámicamente los enlaces de navegación dentro de la navbar
export function renderNavbar() {

  // Obtiene el contenedor donde se mostrarán los enlaces
  const navbarLinks =
    document.getElementById('navbarLinks')

  // Detiene la función si el contenedor no existe
  if (!navbarLinks) return

  // Limpia los enlaces existentes antes de volver a renderizarlos
  navbarLinks.innerHTML = ''

  // Recorre la lista de enlaces definida en navbarData.js
  navLinks.forEach(link => {

    // Crea un elemento <li> para cada enlace
    const li = document.createElement('li')

    // Agrega la clase correspondiente al elemento de navegación
    li.classList.add('custom-navbar-item')

    // Genera dinámicamente el enlace utilizando sus datos
    li.innerHTML = `

      <a

        href="${link.href}"

        class="custom-navbar-link"

      >

        ${link.name}

      </a>

    `

    // Agrega el elemento creado al contenedor de navegación
    navbarLinks.appendChild(li)

  })

}

// Inicializa el comportamiento del menú de navegación en dispositivos móviles
export function initNavbarMobile() {

  // Obtiene el botón utilizado para abrir y cerrar el menú
  const menuButton = document.getElementById("menuButton");

  // Obtiene el contenedor de los enlaces de navegación
  const navbarLinks = document.getElementById("navbarLinks");

  // Detiene la función si alguno de los elementos necesarios no existe
  if (!menuButton || !navbarLinks) return;

  // Alterna la clase active al hacer clic en el botón del menú
  menuButton.addEventListener("click", () => {

    navbarLinks.classList.toggle("active");

  });

  // Agrega el comportamiento de cierre a cada enlace del menú
  navbarLinks.querySelectorAll("a").forEach(link => {

    // Cierra el menú después de seleccionar un enlace
    link.addEventListener("click", () => {

      navbarLinks.classList.remove("active");

    });

  });

}