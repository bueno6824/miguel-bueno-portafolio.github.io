// scroll.js
export { };

// =======================
// INICIALIZACIÓN
// =======================
const initScroll = () => {

    // Animaciones al hacer scroll
    const elementos = document.querySelectorAll(
        '.seccion-inicio, .seccion-acerca, .tarjeta-proyecto, .tarjeta-herramienta'
    );

    const mostrar = () => {
        elementos.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            }
        });
    };

    elementos.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = '0.6s ease';
    });

    window.addEventListener('scroll', mostrar);
    mostrar();

    // =======================
    // BOTÓN IR ARRIBA
    // =======================
    const btnArriba = document.getElementById('btn-ir-arriba');
    const footer = document.querySelector('footer');

    if (!btnArriba || !footer) return;

    // Mostrar / ocultar botón
    window.addEventListener('scroll', () => {
        btnArriba.classList.toggle('visible', window.scrollY > 300);
    });

    // Click
    btnArriba.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Evitar tapar el footer
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                btnArriba.classList.toggle('footer-visible', entry.isIntersecting);
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(footer);
};

// En módulos ES esto es suficiente
initScroll();
