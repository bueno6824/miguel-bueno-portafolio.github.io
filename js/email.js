// email.js
export { }; // Marca el archivo como módulo

// Inicialización EmailJS
emailjs.init("FCsVdDppCH38FJojE");

const form = document.getElementById("form-contacto");
const btnEnviar = document.getElementById("btnEnviar");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";

        try {
            await emailjs.sendForm(
                "service_4sb9uwe",
                "template_s937e0i",
                this
            );

            // 🔥 CARGA SWEETALERT SOLO AQUÍ
            const { default: Swal } = await import("./sweetalert.js");

            await Swal.fire({
                icon: "success",
                title: "Mensaje enviado 🎉",
                text: "Gracias por escribirme. Te respondo pronto.",
                confirmButtonColor: "#000"
            });

            const modalEl = document.getElementById("modal_contacto");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();

            form.reset();

        } catch (error) {
            const { default: Swal } = await import("./sweetalert.js");

            Swal.fire({
                icon: "error",
                title: "Error al enviar",
                text: "Ocurrió un problema, intenta nuevamente.",
                confirmButtonColor: "#000"
            });

            console.error("Error EmailJS:", error);

        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar";
        }
    });
}
