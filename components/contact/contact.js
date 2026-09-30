// Importa el cargador dinámico de SweetAlert.
import {
  loadSweetAlert
} from "../../js/modules/sweetAlertLoader.js";

// Importa las funciones encargadas de enviar el formulario
// y controlar el tiempo mínimo entre envíos.
import {
  enviarEmailDesdeForm,
  puedeEnviar
} from "../../js/modules/email.js";


// Espera a que todo el contenido HTML haya sido cargado.
document.addEventListener(
  "DOMContentLoaded",
  () => {

    // Obtiene el formulario de contacto.
    const contactForm =
      document.getElementById(
        "contactForm"
      );

    // Obtiene el botón utilizado para enviar el formulario.
    const btnEnviar =
      document.getElementById(
        "btnEnviar"
      );

    // Detiene la inicialización si el formulario no existe.
    if (!contactForm) return;

    // Muestra un mensaje de error asociado a un campo.
    function showError(
      input,
      message
    ) {
      // Obtiene el contenedor principal del campo.
      const formGroup =
        input.parentElement;

      // Busca el elemento destinado a mostrar el mensaje de error.
      const errorMessage =
        formGroup.querySelector(
          ".error-message"
        );

      // Agrega la clase que indica visualmente que existe un error.
      formGroup.classList.add(
        "error"
      );

      // Actualiza el texto del mensaje de error si existe.
      if (errorMessage) {
        errorMessage.textContent =
          message;
      }
    }

    // Elimina el estado de error de un campo.
    function clearError(input) {
      // Obtiene el contenedor principal del campo.
      const formGroup =
        input.parentElement;

      // Busca el elemento destinado al mensaje de error.
      const errorMessage =
        formGroup.querySelector(
          ".error-message"
        );

      // Elimina la clase visual de error.
      formGroup.classList.remove(
        "error"
      );

      // Limpia el mensaje de error si existe.
      if (errorMessage) {
        errorMessage.textContent =
          "";
      }
    }

    // Comprueba si una dirección de correo tiene un formato válido.
    function isValidEmail(email) {
      // Expresión regular utilizada para validar el formato básico del email.
      const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Devuelve true si el correo coincide con el formato esperado.
      return regex.test(email);
    }

    // Valida todos los campos obligatorios del formulario.
    function validateContactForm() {
      // Obtiene el campo donde se introduce el nombre.
      const name =
        document.getElementById(
          "contactName"
        );

      // Obtiene el campo donde se introduce el correo electrónico.
      const email =
        document.getElementById(
          "contactEmail"
        );

      // Obtiene el campo donde se introduce el asunto.
      const subject =
        document.getElementById(
          "contactSubject"
        );

      // Obtiene el campo donde se introduce el mensaje.
      const message =
        document.getElementById(
          "contactMessage"
        );

      // Indica inicialmente que el formulario es válido.
      let isValid = true;

      // Comprueba que el nombre no esté vacío.
      if (name.value.trim() === "") {
        showError(
          name,
          "El nombre es obligatorio."
        );

        isValid = false;
      } else {
        clearError(name);
      }

      // Comprueba que el correo no esté vacío.
      if (
        email.value.trim() === ""
      ) {
        showError(
          email,
          "El email es obligatorio."
        );

        isValid = false;

        // Comprueba que el correo tenga un formato válido.
      } else if (
        !isValidEmail(
          email.value.trim()
        )
      ) {
        showError(
          email,
          "Escribe un email válido."
        );

        isValid = false;
      } else {
        clearError(email);
      }

      // Comprueba que el asunto no esté vacío.
      if (
        subject.value.trim() === ""
      ) {
        showError(
          subject,
          "El asunto es obligatorio."
        );

        isValid = false;
      } else {
        clearError(subject);
      }

      // Comprueba que el mensaje tenga al menos 10 caracteres.
      if (
        message.value.trim().length <
        10
      ) {
        showError(
          message,
          "El mensaje debe tener al menos 10 caracteres."
        );

        isValid = false;
      } else {
        clearError(message);
      }

      // Devuelve el resultado final de la validación.
      return isValid;
    }

    // Cambia el estado visual del botón durante el envío.
    function setLoadingState(
      isLoading
    ) {
      // Detiene la función si el botón no existe.
      if (!btnEnviar) return;

      // Deshabilita o habilita el botón según el estado de carga.
      btnEnviar.disabled =
        isLoading;

      // Cambia el texto del botón para indicar si el mensaje está siendo enviado.
      btnEnviar.textContent =
        isLoading
          ? "Enviando..."
          : "Enviar mensaje 🚀";
    }

    // Limpia todos los campos y errores del formulario.
    function cleanForm() {
      // Restablece los valores originales del formulario.
      contactForm.reset();

      // Obtiene todos los grupos de campos del formulario.
      const formGroups =
        contactForm.querySelectorAll(
          ".form-group"
        );

      // Recorre cada grupo del formulario para eliminar sus errores.
      formGroups.forEach(group => {
        // Elimina la clase visual de error.
        group.classList.remove(
          "error"
        );

        // Busca el mensaje de error correspondiente al grupo.
        const errorMessage =
          group.querySelector(
            ".error-message"
          );

        // Limpia el mensaje de error si existe.
        if (errorMessage) {
          errorMessage.textContent =
            "";
        }
      });
    }

    // Escucha el envío del formulario de contacto.
    contactForm.addEventListener(
      "submit",
      async event => {

        // Evita que el navegador recargue la página al enviar el formulario.
        event.preventDefault();

        // Busca el campo honeypot utilizado como protección contra bots.
        const honeypot =
          contactForm.querySelector(
            'input[name="website"]'
          );

        // Si el honeypot contiene información, se considera un envío sospechoso.
        if (
          honeypot &&
          honeypot.value !== ""
        ) {
          return;
        }

        // Detiene el envío si alguno de los campos no pasa la validación.
        if (
          !validateContactForm()
        ) {
          return;
        }

        // Comprueba si ya pasó el tiempo mínimo permitido entre envíos.
        if (!puedeEnviar()) {
          try {
            // Carga SweetAlert cuando es necesario mostrar la alerta.
            const Swal =
              await loadSweetAlert();

            // Muestra una advertencia indicando que debe esperar.
            await Swal.fire({
              icon: "warning",
              title:
                "Espera un momento",
              text:
                "Puedes enviar otro mensaje en 1 minuto.",
              confirmButtonText:
                "Entendido"
            });
          } catch (error) {
            // Registra el error si SweetAlert no puede cargarse.
            console.error(
              "No se pudo cargar SweetAlert:",
              error
            );
          }

          return;
        }

        // Deshabilita el botón y muestra el estado de envío.
        setLoadingState(true);

        try {
          // Envía los datos del formulario mediante el módulo de email.
          await enviarEmailDesdeForm(
            contactForm
          );

          // Carga SweetAlert para mostrar la confirmación del envío.
          const Swal =
            await loadSweetAlert();

          // Muestra el mensaje de envío exitoso.
          await Swal.fire({
            icon: "success",
            title:
              "Mensaje enviado",
            text:
              "Gracias por escribirme. Te responderé lo antes posible.",
            confirmButtonText:
              "Perfecto 🚀"
          });

          // Limpia el formulario después de un envío exitoso.
          cleanForm();

        } catch (error) {
          // Registra cualquier error ocurrido durante el envío mediante EmailJS.
          console.error(
            "Error EmailJS:",
            error
          );

          try {
            // Carga SweetAlert para mostrar el mensaje de error.
            const Swal =
              await loadSweetAlert();

            // Informa al usuario que el envío no pudo completarse.
            await Swal.fire({
              icon: "error",
              title:
                "Error al enviar",
              text:
                "Ocurrió un problema. Inténtalo nuevamente.",
              confirmButtonText:
                "Cerrar"
            });

          } catch (
          sweetAlertError
          ) {
            // Registra el error ocurrido al intentar mostrar SweetAlert.
            console.error(
              "No se pudo mostrar la alerta:",
              sweetAlertError
            );

            // Utiliza la alerta nativa del navegador como alternativa.
            alert(
              "Ocurrió un problema al enviar el mensaje."
            );
          }

        } finally {
          // Reactiva el botón independientemente de si el envío tuvo éxito o falló.
          setLoadingState(false);
        }
      }
    );
  }
);