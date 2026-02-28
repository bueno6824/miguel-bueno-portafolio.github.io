// fuzzy.js
export function fuzzyMatch(query, text) {
    query = normalize(query);
    text = normalize(text);

    let score = 0;
    let ti = 0;

    for (let qi = 0; qi < query.length; qi++) {
        const qChar = query[qi];

        while (ti < text.length && text[ti] !== qChar) {
            ti++;
            score += 1;
        }

        if (ti === text.length) {
            return Infinity; // no match
        }

        ti++;
    }

    return score;
}

function normalize(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
