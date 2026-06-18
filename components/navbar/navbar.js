import { navLinks }
from './navbarData.js'

export function renderNavbar() {

  const navbarLinks =
    document.getElementById('navbarLinks')

  if (!navbarLinks) return

  navbarLinks.innerHTML = ''

  navLinks.forEach(link => {

    const li = document.createElement('li')

    li.classList.add('custom-navbar-item')

    li.innerHTML = `
      <a
        href="${link.href}"
        class="custom-navbar-link"
      >
        ${link.name}
      </a>
    `

    navbarLinks.appendChild(li)

  })

}

export function initNavbarMobile() {
  const menuButton = document.getElementById("menuButton");
  const navbarLinks = document.getElementById("navbarLinks");

  if (!menuButton || !navbarLinks) return;

  menuButton.addEventListener("click", () => {
    navbarLinks.classList.toggle("active");
  });

  navbarLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navbarLinks.classList.remove("active");
    });
  });
}