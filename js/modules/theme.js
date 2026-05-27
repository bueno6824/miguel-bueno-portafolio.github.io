// darkmode.js
export { };

const toggleDark = document.getElementById("toggle_dark");
const icon = toggleDark?.querySelector(".theme-icon");
const root = document.documentElement;

let mode = localStorage.getItem("theme") || "auto";

const setVisualTheme = (theme) => {
    root.classList.toggle("dark", theme === "dark");

    if (theme === "dark") {
        root.style.setProperty("--luz-global", "0.85");
        root.style.setProperty("--tono-calido", "15deg");
        icon && (icon.textContent = "🌙");
    }

    if (theme === "light") {
        root.style.setProperty("--luz-global", "1");
        root.style.setProperty("--tono-calido", "0deg");
        icon && (icon.textContent = "☀️");
    }

    document.dispatchEvent(new Event("themeChanged"));
};

const applyAutoTheme = () => {
    const hour = new Date().getHours();
    const isDay = hour >= 7 && hour < 19;
    setVisualTheme(isDay ? "light" : "dark");
    icon && (icon.textContent = "🕑");
};

const init = () => {
    if (mode === "auto") applyAutoTheme();
    else setVisualTheme(mode);
};

init();

toggleDark?.addEventListener("click", () => {
    mode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    localStorage.setItem("theme", mode);

    if (mode === "auto") applyAutoTheme();
    else setVisualTheme(mode);
});

setInterval(() => {
    if (mode === "auto") applyAutoTheme();
}, 60_000);
