export { };

let herramientasGlobal = null;

fetch("js/herramientas.json")
    .then(res => res.json())
    .then(data => {
        herramientasGlobal = data;
        renderizarHerramientas();
    });

function renderizarHerramientas() {
    Object.keys(herramientasGlobal).forEach(categoria => {

        const contenedor = document.getElementById(categoria);

        herramientasGlobal[categoria].forEach(h => {

            contenedor.innerHTML += `
        <div class="skill">
          <div class="skill-info">
            <i class="${h.icono}"></i>
            <span>${h.nombre}</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" data-nivel="${h.nivel}"></div>
          </div>
        </div>
      `;

        });

    });

    activarAnimacionScroll();
}

function activarAnimacionScroll() {

    const skills = document.querySelectorAll(".skill-progress");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nivel = entry.target.dataset.nivel;
                entry.target.style.width = nivel + "%";
            }
        });
    }, { threshold: 0.5 });

    skills.forEach(skill => observer.observe(skill));
}