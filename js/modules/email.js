import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

emailjs.init({
  publicKey: "FCsVdDppCH38FJojE"
});

const SERVICE_ID = "service_4sb9uwe";
const TEMPLATE_ID = "template_s937e0i";
const RATE_LIMIT_TIME = 60000;

export async function enviarEmailDesdeForm(form) {
  return emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
}

export function puedeEnviar() {
  const lastSent = localStorage.getItem("lastEmailSent");

  if (lastSent && Date.now() - Number(lastSent) < RATE_LIMIT_TIME) {
    return false;
  }

  localStorage.setItem("lastEmailSent", Date.now());
  return true;
}