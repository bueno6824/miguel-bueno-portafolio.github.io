// search.js
import { fuzzyMatch } from "./fuzzy.js";

export { };

const input = document.getElementById("buscadorProyectos");
const proyectos = [...document.querySelectorAll(".proyecto-card")];

input?.addEventListener("input", () => {
    const query = input.value.trim();

    if (!query) {
        proyectos.forEach(card => card.classList.remove("oculto"));
        return;
    }

    const resultados = proyectos.map(card => {
        const texto = card.innerText;
        const score = fuzzyMatch(query, texto);

        return { card, score };
    });

    resultados.forEach(({ card, score }) => {
        if (score === Infinity) {
            card.classList.add("oculto");
        } else {
            card.classList.remove("oculto");
        }
    });

    // 🔥 Ordena por relevancia
    resultados
        .filter(r => r.score !== Infinity)
        .sort((a, b) => a.score - b.score)
        .forEach(({ card }) => {
            card.parentNode.appendChild(card);
        });
});
