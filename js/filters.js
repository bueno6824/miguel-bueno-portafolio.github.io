// filters.js
export { };

const botones = document.querySelectorAll('.filtro-btn');
const proyectos = document.querySelectorAll('.proyecto-card');

botones.forEach(btn => {
    btn.addEventListener('click', () => {
        // UI activa
        botones.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filtro = btn.dataset.filtro;

        proyectos.forEach(card => {
            if (card.classList.contains('destacado')) return;

            const tipo = card.dataset.tipo;

            if (filtro === 'all' || tipo === filtro) {
                card.classList.remove('oculto');
            } else {
                card.classList.add('oculto');
            }
        });

    });
});
