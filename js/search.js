import { fuzzyMatch, normalize } from "./fuzzy.js";
import { proyectosGlobal, renderizarProyectos } from "./proyectos.js";

const input = document.getElementById("buscadorProyectos");
const mensajeSinResultados = document.getElementById("sinResultados");
const botonesFiltro = document.querySelectorAll(".filtro-btn");

let categoriaActiva = "todos";
let queryActual = "";

function aplicarFiltrosYBusqueda() {
    let resultado = proyectosGlobal;

    if (categoriaActiva !== "todos") {
        resultado = resultado.filter(p =>
            normalize(p.categoria) === normalize(categoriaActiva)
        );
    }

    if (queryActual.length >= 2) {
        resultado = resultado
            .map(proyecto => {
                let score = 0;
                let coincidencia = false;

                const scoreTitulo = fuzzyMatch(queryActual, proyecto.titulo);
                if (scoreTitulo !== Infinity) {
                    score += scoreTitulo * 1;
                    coincidencia = true;
                }

                const scoreStack = fuzzyMatch(queryActual, proyecto.stack.join(" "));
                if (scoreStack !== Infinity) {
                    score += scoreStack * 2;
                    coincidencia = true;
                }

                const scoreDesc = fuzzyMatch(queryActual, proyecto.descripcionCorta);
                if (scoreDesc !== Infinity) {
                    score += scoreDesc * 3;
                    coincidencia = true;
                }

                return coincidencia ? { proyecto, score } : null;
            })
            .filter(Boolean)
            .sort((a, b) => a.score - b.score)
            .map(r => r.proyecto);
    }

    renderizarProyectos(resultado);

    mensajeSinResultados.classList.toggle(
        "oculto",
        resultado.length !== 0
    );
}

function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

input?.addEventListener("input", debounce((e) => {
    queryActual = e.target.value.trim();
    aplicarFiltrosYBusqueda();
}, 250));

botonesFiltro.forEach(btn => {
    btn.addEventListener("click", function () {

        botonesFiltro.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        categoriaActiva = this.dataset.categoria;
        aplicarFiltrosYBusqueda();
    });
});