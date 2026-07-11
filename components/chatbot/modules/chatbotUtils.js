export function normalizeText(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function matchesKeyword( message, keyword) {
  const normalizedMessage =
    normalizeText(message);

  const normalizedKeyword =
    normalizeText(keyword);

  if (
    normalizedMessage ===
    normalizedKeyword
  ) {
    return true;
  }

  if (
    normalizedKeyword.includes(" ")
  ) {
    return normalizedMessage.includes(
      normalizedKeyword
    );
  }

  const words =
    normalizedMessage.split(/\s+/);

  return words.includes(
    normalizedKeyword
  );
}

export function isAffirmative(message) {
  const normalizedMessage =
    normalizeText(message);

  return [
    "si",
    "sí",
    "simon",
    "claro",
    "va",
    "ok",
    "dale",
    "por supuesto"
  ].some(word =>
    normalizedMessage.includes(
      normalizeText(word)
    )
  );
}

export function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}