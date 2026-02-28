// navbar.js
export { }; // si no exporta nada específico, esto indica que es un módulo


// Cerrar menú al dar click en un enlace
const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('menu-principal');
        const bsCollapse = bootstrap.Collapse.getInstance(menu);
        if (bsCollapse) bsCollapse.hide();
    });
});

// ScrollSpy
window.addEventListener("load", () => {
    new bootstrap.ScrollSpy(document.body, {
        target: ".navbar",
        offset: 130
    });
});

// Navbar fondo y ocultar al hacer scroll
const header = document.querySelector(".header");
const progressBar = document.getElementById("scroll-progress");
let lastScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    // Fondo al hacer scroll
    if (currentScroll > 120) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    // Ocultar / mostrar navbar
    if (currentScroll > lastScroll && currentScroll > 120) header.classList.add("oculto");
    else header.classList.remove("oculto");

    lastScroll = currentScroll;

    // Barra de progreso
    const scrollTop = document.documentElement.scrollTop;
    const alturaTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progreso = (scrollTop / alturaTotal) * 100;
    progressBar.style.width = progreso + "%";
});
