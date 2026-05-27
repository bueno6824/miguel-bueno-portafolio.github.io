const navbarLinks = document.getElementById('navbarLinks')
const menuButton = document.getElementById('menuButton')

navLinks.forEach(link => {

  const li = document.createElement('li')

  li.innerHTML = `
    <a href="${link.href}">
      ${link.name}
    </a>
  `

  navbarLinks.appendChild(li)

})

menuButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})