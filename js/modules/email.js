import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";


// Inicializa EmailJS utilizando la clave pública del proyecto.
emailjs.init({

  publicKey: "FCsVdDppCH38FJojE"

});


// Identificador del servicio configurado en EmailJS.
const SERVICE_ID = "service_4sb9uwe";

// Identificador de la plantilla utilizada para enviar el correo.
const TEMPLATE_ID = "template_s937e0i";

// Tiempo mínimo entre envíos permitidos, expresado en milisegundos.
const RATE_LIMIT_TIME = 60000;


// Envía los datos del formulario mediante el servicio de EmailJS.
export async function enviarEmailDesdeForm(form) {

  // Envía el formulario utilizando el servicio y la plantilla configurados.
  return emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

}


// Comprueba si ha pasado suficiente tiempo desde el último envío.
export function puedeEnviar() {

  // Obtiene de localStorage el momento del último envío registrado.
  const lastSent = localStorage.getItem("lastEmailSent");

  // Bloquea el envío si todavía se encuentra dentro del intervalo establecido.
  if (lastSent && Date.now() - Number(lastSent) < RATE_LIMIT_TIME) {

    return false;

  }

  // Guarda el momento actual como referencia para el siguiente intento de envío.
  localStorage.setItem("lastEmailSent", Date.now());

  // Indica que el envío está permitido.
  return true;

}