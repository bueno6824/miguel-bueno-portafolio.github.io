// scroll.js
export { };

// =======================
// INICIALIZACIÓN
// =======================
const initScroll = () => {

    // =======================
    // ANIMACIONES AL HACER SCROLL (OPTIMIZADO)
    // =======================

    const elementos = document.querySelectorAll(
        '.seccion-inicio, .seccion-acerca, .tarjeta-proyecto, .tarjeta-herramienta'
    );

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // deja de observar después de animar
            }
        });
    }, {
        threshold: 0.15
    });

    elementos.forEach(el => observer.observe(el));

    // =======================
    // BOTÓN IR ARRIBA
    // =======================

    const btnArriba = document.getElementById('btn-ir-arriba');
    const footer = document.querySelector('footer');

    if (!btnArriba || !footer) return;

    // Scroll optimizado con requestAnimationFrame
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                btnArriba.classList.toggle('visible', window.scrollY > 300);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Click para subir
    btnArriba.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =======================
    // EVITAR QUE EL BOTÓN TAPE EL FOOTER
    // =======================

    const footerObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                btnArriba.classList.toggle('footer-visible', entry.isIntersecting);
            });
        },
        { threshold: 0.1 }
    );

    footerObserver.observe(footer);
};

initScroll();