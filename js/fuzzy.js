export function fuzzyMatch(query, text) {
    query = normalize(query);
    text = normalize(text);

    if (text.includes(query)) {
        return 0; // coincidencia exacta tiene prioridad máxima
    }

    let score = 0;
    let ti = 0;

    for (let qi = 0; qi < query.length; qi++) {
        const qChar = query[qi];

        while (ti < text.length && text[ti] !== qChar) {
            ti++;
            score++;
        }

        if (ti === text.length) {
            return Infinity;
        }

        ti++;
    }

    return score;
}


export function normalize(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}