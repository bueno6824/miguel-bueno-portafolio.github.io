export { };

emailjs.init("FCsVdDppCH38FJojE");

const form = document.getElementById("form-contacto");
const btnEnviar = document.getElementById("btnEnviar");

if (form) {

    const inputs = form.querySelectorAll("input, textarea");
    const honeypot = form.querySelector('input[name="website"]');

    // 🔥 Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (input.checkValidity()) {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            } else {
                input.classList.remove("is-valid");
                input.classList.add("is-invalid");
            }
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 🛑 Honeypot anti-spam
        if (honeypot && honeypot.value !== "") return;

        // ✅ Validación HTML
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        // ⏳ Rate limit
        const RATE_LIMIT_TIME = 60000; // 1 min
        const lastSent = localStorage.getItem("lastEmailSent");

        if (lastSent && Date.now() - lastSent < RATE_LIMIT_TIME) {
            const { default: Swal } = await import("./sweetalert.js");

            await Swal.fire({
                icon: "warning",
                title: "Espera un momento ⏳",
                text: "Puedes enviar otro mensaje en 1 minuto.",
                confirmButtonColor: "#f59e0b",
                background: "#0f172a",
                color: "#fff"
            });

            return;
        }

        setLoadingState(true);

        try {

            await emailjs.sendForm(
                "service_4sb9uwe",
                "template_s937e0i",
                form
            );

            localStorage.setItem("lastEmailSent", Date.now());


            await Swal.fire({
                icon: "success",
                title: "Mensaje enviado 🚀",
                text: "Gracias por escribirme. Te responderé pronto.",
                confirmButtonColor: "#0ea5e9",
                background: "#0f172a",
                color: "#fff"
            });

            console.log("Mensaje enviado correctamente");

            cleanForm();
            closeModal();

        } catch (error) {

            console.error("Error EmailJS:", error);

            const correo = form.correo.value;
            const mensaje = form.mensaje.value;

            const mailtoLink = `mailto:tucorreo@gmail.com?subject=Contacto%20Portfolio&body=${encodeURIComponent(
                `Correo: ${correo}\n\nMensaje:\n${mensaje}`
            )}`;

            const { default: Swal } = await import("./sweetalert.js");

            const result = await Swal.fire({
                icon: "error",
                title: "No se pudo enviar automáticamente",
                text: "¿Quieres enviarlo desde tu cliente de correo?",
                showCancelButton: true,
                confirmButtonText: "Sí, abrir correo",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#0ea5e9",
                background: "#0f172a",
                color: "#fff"
            });

            if (result.isConfirmed) {
                window.location.href = mailtoLink;
            }

        } finally {
            setLoadingState(false);
        }

    });

    // 🔄 Reset completo al cerrar modal
    document.getElementById("modal_contacto")
        ?.addEventListener("hidden.bs.modal", () => {
            cleanForm();
            setLoadingState(false);
        });
}


// 🔧 Helpers

function setLoadingState(isLoading) {
    btnEnviar.disabled = isLoading;

    btnEnviar.innerHTML = isLoading
        ? `<span class="spinner-border spinner-border-sm me-2"></span> Enviando...`
        : "Enviar";
}

function closeModal() {
    const modalEl = document.getElementById("modal_contacto");

    let modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalEl);
    }

    modalInstance.hide();
}

function cleanForm() {
    const form = document.getElementById("form-contacto");
    const inputs = form.querySelectorAll("input, textarea");

    form.reset();
    form.classList.remove("was-validated");

    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
    });
}