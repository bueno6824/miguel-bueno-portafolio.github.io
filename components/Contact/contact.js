import {
  enviarEmailDesdeForm,
  puedeEnviar
} from "../../js/modules/email.js";

console.log("contact.js cargado correctamente 🚀");

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const btnEnviar = document.getElementById("btnEnviar");

  console.log("FORM CONTACT:", contactForm);

  if (!contactForm) return;

  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector(".error-message");

    formGroup.classList.add("error");
    errorMessage.textContent = message;
  }

  function clearError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector(".error-message");

    formGroup.classList.remove("error");
    errorMessage.textContent = "";
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validateContactForm() {
    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const subject = document.getElementById("contactSubject");
    const message = document.getElementById("contactMessage");

    let isValid = true;

    if (name.value.trim() === "") {
      showError(name, "El nombre es obligatorio.");
      isValid = false;
    } else {
      clearError(name);
    }

    if (email.value.trim() === "") {
      showError(email, "El email es obligatorio.");
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Escribe un email válido.");
      isValid = false;
    } else {
      clearError(email);
    }

    if (subject.value.trim() === "") {
      showError(subject, "El asunto es obligatorio.");
      isValid = false;
    } else {
      clearError(subject);
    }

    if (message.value.trim().length < 10) {
      showError(message, "El mensaje debe tener al menos 10 caracteres.");
      isValid = false;
    } else {
      clearError(message);
    }

    return isValid;
  }

  function setLoadingState(isLoading) {
    if (!btnEnviar) return;

    btnEnviar.disabled = isLoading;

    btnEnviar.innerHTML = isLoading
      ? "Enviando..."
      : "Enviar mensaje 🚀";
  }

  function cleanForm() {
    contactForm.reset();

    const formGroups = contactForm.querySelectorAll(".form-group");

    formGroups.forEach(group => {
      group.classList.remove("error");

      const errorMessage = group.querySelector(".error-message");
      if (errorMessage) errorMessage.textContent = "";
    });
  }

  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    console.log("Formulario detenido correctamente ✅");

    const honeypot = contactForm.querySelector('input[name="website"]');

    if (honeypot && honeypot.value !== "") return;

    if (!validateContactForm()) return;

    if (!puedeEnviar()) {
      Swal.fire({
        icon: "warning",
        title: "Espera un momento",
        text: "Puedes enviar otro mensaje en 1 minuto.",
        confirmButtonText: "Entendido"
      });

      return;
    }

    setLoadingState(true);

    try {
      await enviarEmailDesdeForm(contactForm);

      Swal.fire({
        icon: "success",
        title: "Mensaje enviado",
        text: "Gracias por escribirme. Te responderé lo antes posible.",
        confirmButtonText: "Perfecto 🚀"
      });

      cleanForm();
    } catch (error) {
      console.error("Error EmailJS:", error);

      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: "Ocurrió un problema. Inténtalo nuevamente.",
        confirmButtonText: "Cerrar"
      });
    } finally {
      setLoadingState(false);
    }
  });
});