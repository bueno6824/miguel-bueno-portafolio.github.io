export function fuzzyMatch(query, text) {
    query = normalize(query);
    text = normalize(text);

    // 🔥 mínimo 2 caracteres para evitar búsquedas basura
    if (!query || query.length < 2) return Infinity;

    // 🔥 Soporte para múltiples palabras (ej: "react api")
    const palabras = query.split(" ").filter(Boolean);

    let totalScore = 0;

    for (const palabra of palabras) {

        // Coincidencia directa exacta tiene prioridad máxima
        if (text.includes(palabra)) {
            continue;
        }

        let score = 0;
        let ti = 0;
        let lastMatchIndex = -1;

        for (let qi = 0; qi < palabra.length; qi++) {
            const qChar = palabra[qi];
            let found = false;

            while (ti < text.length) {
                if (text[ti] === qChar) {
                    found = true;

                    if (lastMatchIndex !== -1) {
                        const distancia = ti - lastMatchIndex;
                        score += distancia;
                    }

                    lastMatchIndex = ti;
                    ti++;
                    break;
                }

                ti++;
            }

            if (!found) return Infinity;
        }

        // 🔥 límite más agresivo por palabra
        const maxPermitido = palabra.length * 2.5;

        if (score > maxPermitido) {
            return Infinity;
        }

        totalScore += score;
    }

    return totalScore;
}


export function normalize(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
