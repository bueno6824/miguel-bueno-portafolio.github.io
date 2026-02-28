// datetime.js
export { };

const timeEl = document.getElementById("footer-time");
const dateEl = document.getElementById("footer-date");

const updateDateTime = () => {
    const now = new Date();

    timeEl && (timeEl.textContent = now.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }));

    dateEl && (dateEl.textContent = now.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    }));
};

updateDateTime();
setInterval(updateDateTime, 1000);
