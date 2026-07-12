import {
  normalizeText
} from "../chatbotUtils.js";

export function isComparisonRequest(message) {
  const comparisonKeywords = [
    "compara",
    "comparar",
    "comparalos",
    "comparalos",
    "comparacion",
    "diferencias",
    "diferencia entre",
    "cual de los dos",
    "cual es mejor",
    "entre ambos",
    "entre los dos"
  ];

  return comparisonKeywords.some(
    keyword =>
      message.includes(
        normalizeText(keyword)
      )
  );
}

export function extractProjectIndexes(message) {
  const indexes = [];

  const addIndex = index => {
    if (
      index >= 0 &&
      !indexes.includes(index)
    ) {
      indexes.push(index);
    }
  };

  /* ==============================
     REFERENCIAS CON NÚMEROS
  ============================== */

  const numericPatterns = [
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?1\b/g,
      index: 0
    },
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?2\b/g,
      index: 1
    },
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?3\b/g,
      index: 2
    },
    {
      regex:
        /\b(?:proyecto\s*)?(?:numero\s*)?(?:el\s*)?4\b/g,
      index: 3
    }
  ];

  numericPatterns.forEach(
    ({ regex, index }) => {
      if (regex.test(message)) {
        addIndex(index);
      }
    }
  );

  /* ==============================
     REFERENCIAS ESCRITAS
  ============================== */

  const wordReferences = [
    {
      patterns: [
        "proyecto uno",
        "primer proyecto",
        "el primero",
        "primero"
      ],
      index: 0
    },
    {
      patterns: [
        "proyecto dos",
        "segundo proyecto",
        "el segundo",
        "segundo"
      ],
      index: 1
    },
    {
      patterns: [
        "proyecto tres",
        "tercer proyecto",
        "el tercero",
        "tercero"
      ],
      index: 2
    },
    {
      patterns: [
        "proyecto cuatro",
        "cuarto proyecto",
        "el cuarto",
        "cuarto"
      ],
      index: 3
    }
  ];

  wordReferences.forEach(reference => {
    const matches =
      reference.patterns.some(pattern =>
        message.includes(
          normalizeText(pattern)
        )
      );

    if (matches) {
      addIndex(reference.index);
    }
  });

  return indexes;
}

export function refersToPreviousProjects(message) {
  const contextualPatterns = [
    "comparalos",
    "compara esos",
    "compara ambos",
    "entre ellos",
    "entre los dos",
    "cual de esos",
    "cual de los dos",
    "que diferencias tienen"
  ];

  return contextualPatterns.some(
    pattern =>
      message.includes(
        normalizeText(pattern)
      )
  );
}

export function matchesAnyPattern(message,patterns) {
  return patterns.some(pattern =>
    message.includes(
      normalizeText(pattern)
    )
  );
}

export function asksForMoreTechnologies(message) {
  const patterns = [
    "cual usa mas tecnologias",
    "cual tiene mas tecnologias",
    "cual utiliza mas tecnologias",
    "cual de los dos usa mas",
    "quien usa mas tecnologias",
    "mas tecnologias"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

export function asksForMoreComplexity(message) {
  const patterns = [
    "cual es mas complejo",
    "cual fue mas complejo",
    "cual es mas dificil",
    "cual fue mas dificil",
    "mayor complejidad",
    "mas complejo",
    "mas dificil"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

export function asksForMoreRecent(message) {
  const patterns = [
    "cual es mas reciente",
    "cual fue mas reciente",
    "cual es mas nuevo",
    "cual fue el ultimo",
    "cual hiciste despues",
    "mas reciente"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

export function asksForRecruiterRecommendation(message) {
  const patterns = [
    "mejor para un reclutador",
    "mejor para reclutadores",
    "cual mostrarias a una empresa",
    "cual mostrarias en una entrevista",
    "cual sirve mas para conseguir trabajo",
    "cual demuestra mas experiencia"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}

export function asksForGeneralRecommendation(message) {
  const patterns = [
    "cual recomiendas",
    "cual recomendarias",
    "cual es mejor",
    "con cual te quedas",
    "cual mostrarias",
    "elige uno"
  ];

  return matchesAnyPattern(
    message,
    patterns
  );
}