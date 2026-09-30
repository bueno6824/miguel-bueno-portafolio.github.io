// Inicializa y mantiene actualizado el reloj y la fecha del footer.
export function initFooterClock() {

  // Obtiene el elemento donde se mostrará la hora.
  const timeElement = document.getElementById("footer-time");

  // Obtiene el elemento donde se mostrará la fecha.
  const dateElement = document.getElementById("footer-date");

  // Detiene la ejecución si alguno de los elementos no existe.
  if (!timeElement || !dateElement) return;

  // Actualiza la hora y la fecha mostradas en el footer.
  function updateClock() {

    // Obtiene la fecha y hora actuales.
    const now = new Date();

    // Formatea la hora utilizando la configuración regional de México.
    const time = now.toLocaleTimeString("es-MX", {

      // Muestra la hora con dos dígitos.
      hour: "2-digit",

      // Muestra los minutos con dos dígitos.
      minute: "2-digit",

      // Muestra los segundos con dos dígitos.
      second: "2-digit"

    });

    // Formatea la fecha utilizando la configuración regional de México.
    const date = now.toLocaleDateString("es-MX", {

      // Incluye el nombre completo del día de la semana.
      weekday: "long",

      // Muestra el día con dos dígitos.
      day: "2-digit",

      // Incluye el nombre completo del mes.
      month: "long",

      // Incluye el año con formato numérico.
      year: "numeric"

    });

    // Actualiza el contenido del elemento que muestra la hora.
    timeElement.textContent = time;

    // Actualiza el contenido del elemento que muestra la fecha.
    dateElement.textContent = date;

  }

  // Ejecuta una primera actualización inmediatamente.
  updateClock();

  // Actualiza el reloj cada segundo.
  setInterval(updateClock, 1000);

}