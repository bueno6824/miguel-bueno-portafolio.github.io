// darkmode.js

// Mantiene el archivo como un módulo ES aunque no exporte funcionalidades.
export { };


// Obtiene el botón utilizado para cambiar el tema.
const toggleDark = document.getElementById("toggle_dark");

// Obtiene el elemento visual donde se mostrará el icono del tema.
const icon = toggleDark?.querySelector(".theme-icon");

// Obtiene el elemento raíz del documento para aplicar la clase y variables globales.
const root = document.documentElement;

// Recupera la preferencia de tema guardada o utiliza el modo automático por defecto.
let mode = localStorage.getItem("theme") || "auto";


// Aplica visualmente el tema seleccionado y actualiza sus variables relacionadas.
const setVisualTheme = (theme) => {

    // Activa o desactiva la clase dark según el tema seleccionado.
    root.classList.toggle("dark", theme === "dark");

    // Configura las variables visuales correspondientes al modo oscuro.
    if (theme === "dark") {

        root.style.setProperty("--luz-global", "0.85");

        root.style.setProperty("--tono-calido", "15deg");

        // Actualiza el icono para representar el modo oscuro.
        icon && (icon.textContent = "🌙");

    }

    // Configura las variables visuales correspondientes al modo claro.
    if (theme === "light") {

        root.style.setProperty("--luz-global", "1");

        root.style.setProperty("--tono-calido", "0deg");

        // Actualiza el icono para representar el modo claro.
        icon && (icon.textContent = "☀️");

    }

    // Notifica al resto de la aplicación que el tema visual ha cambiado.
    document.dispatchEvent(new Event("themeChanged"));

};


// Determina el tema automáticamente utilizando la hora actual del día.
const applyAutoTheme = () => {

    // Obtiene la hora actual del sistema.
    const hour = new Date().getHours();

    // Considera como horario diurno el periodo entre las 07:00 y las 18:59.
    const isDay = hour >= 7 && hour < 19;

    // Aplica el tema claro durante el día y oscuro durante la noche.
    setVisualTheme(isDay ? "light" : "dark");

    // Muestra el icono de reloj para indicar que está activo el modo automático.
    icon && (icon.textContent = "🕑");

};


// Inicializa el tema utilizando la preferencia actualmente seleccionada.
const init = () => {

    // Utiliza el tema automático cuando esa es la preferencia guardada.
    if (mode === "auto") applyAutoTheme();

    // De lo contrario, aplica directamente el tema seleccionado.
    else setVisualTheme(mode);

};


// Ejecuta la inicialización del sistema de temas.
init();


// Cambia entre los modos automático, claro y oscuro cada vez que se pulsa el botón.
toggleDark?.addEventListener("click", () => {

    // Avanza al siguiente modo dentro del ciclo auto → claro → oscuro → auto.
    mode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";

    // Guarda la nueva preferencia en el almacenamiento local.
    localStorage.setItem("theme", mode);

    // Aplica el comportamiento correspondiente al modo seleccionado.
    if (mode === "auto") applyAutoTheme();

    // Aplica directamente el tema claro u oscuro cuando corresponde.
    else setVisualTheme(mode);

});


// Revisa periódicamente el tema automático para actualizarlo cuando cambie la hora.
setInterval(() => {

    // Solo actualiza el tema automáticamente cuando el modo seleccionado es auto.
    if (mode === "auto") applyAutoTheme();

}, 60_000);