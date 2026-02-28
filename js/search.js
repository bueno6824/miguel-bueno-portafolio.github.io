// search.js
import { fuzzyMatch } from "./fuzzy.js";
import { proyectosGlobal } from "./proyectos.js";

import { renderizarProyectos } from "./proyectos.js";

const input = document.getElementById("buscadorProyectos");
const mensajeSinResultados = document.getElementById("sinResultados");

input?.addEventListener("input", () => {
    const query = input.value.trim();

    if (!query) {
        renderizarProyectos(proyectosGlobal);
        mensajeSinResultados.classList.add("oculto");
        return;
    }

    const resultados = proyectosGlobal
        .map(proyecto => {
            const texto =
                proyecto.titulo +
                " " +
                proyecto.descripcionCorta +
                " " +
                proyecto.stack.join(" ");

            const score = fuzzyMatch(query, texto);

            return { proyecto, score };
        })
        .filter(r => r.score !== Infinity)
        .sort((a, b) => a.score - b.score)
        .map(r => r.proyecto);

    renderizarProyectos(resultados);

    if (resultados.length === 0) {
        mensajeSinResultados.classList.remove("oculto");
    } else {
        mensajeSinResultados.classList.add("oculto");
    }
});