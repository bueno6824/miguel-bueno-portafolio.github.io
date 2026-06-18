export function initFooterClock() {
  const timeElement = document.getElementById("footer-time");
  const dateElement = document.getElementById("footer-date");

  if (!timeElement || !dateElement) return;

  function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const date = now.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    timeElement.textContent = time;
    dateElement.textContent = date;
  }

  updateClock();
  setInterval(updateClock, 1000);
}