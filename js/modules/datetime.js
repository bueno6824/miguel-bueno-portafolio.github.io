// datetime.js

// Mantiene el módulo como un módulo ES aunque no exporte funcionalidades.
export { };


// Obtiene el elemento donde se mostrará la hora.
const timeEl = document.getElementById("footer-time");

// Obtiene el elemento donde se mostrará la fecha.
const dateEl = document.getElementById("footer-date");


// Actualiza la hora y fecha mostradas en el footer.
const updateDateTime = () => {

    // Obtiene la fecha y hora actuales.
    const now = new Date();

    // Actualiza la hora utilizando el formato localizado de México.
    timeEl && (timeEl.textContent = now.toLocaleTimeString("es-MX", {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    }));

    // Actualiza la fecha utilizando el formato localizado de México.
    dateEl && (dateEl.textContent = now.toLocaleDateString("es-MX", {

        weekday: "short",

        day: "2-digit",

        month: "short",

        year: "numeric"

    }));

};


// Realiza una primera actualización inmediatamente al cargar el módulo.
updateDateTime();

// Actualiza la hora y fecha automáticamente cada segundo.
setInterval(updateDateTime, 1000);