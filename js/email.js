import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

// 🔑 Init
emailjs.init({
    publicKey: "FCsVdDppCH38FJojE"
});

// ==============================
// 📤 FUNCIONES EXPORTADAS (CHATBOT)
// ==============================

export async function enviarEmail(data) {
    return emailjs.send(
        "service_4sb9uwe",
        "template_s937e0i",
        data
    );
}

export async function enviarEmailDesdeForm(form) {
    return emailjs.sendForm(
        "service_4sb9uwe",
        "template_s937e0i",
        form
    );
}

export function puedeEnviar() {
    const RATE_LIMIT_TIME = 60000;
    const lastSent = localStorage.getItem("lastEmailSent");

    if (lastSent && Date.now() - lastSent < RATE_LIMIT_TIME) {
        return false;
    }

    localStorage.setItem("lastEmailSent", Date.now());
    return true;
}

// ==============================
// 📄 LÓGICA DEL FORM (AUTO)
// ==============================

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

        if (honeypot && honeypot.value !== "") return;

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        // 🔥 RATE LIMIT
        if (!puedeEnviar()) {
            alert("⏳ Espera 1 minuto antes de enviar otro mensaje");
            return;
        }

        setLoadingState(true);

        try {

            await enviarEmailDesdeForm(form);

            alert("✅ Mensaje enviado");

            cleanForm();
            closeModal();

        } catch (error) {

            console.error("Error EmailJS:", error);
            alert("❌ Error al enviar");

        } finally {
            setLoadingState(false);
        }

    });

    document.getElementById("modal_contacto")
        ?.addEventListener("hidden.bs.modal", () => {
            cleanForm();
            setLoadingState(false);
        });
}

// ==============================
// 🔧 HELPERS
// ==============================

function setLoadingState(isLoading) {
    if (!btnEnviar) return;

    btnEnviar.disabled = isLoading;

    btnEnviar.innerHTML = isLoading
        ? `Enviando...`
        : "Enviar";
}

function closeModal() {
    const modalEl = document.getElementById("modal_contacto");

    if (!modalEl) return;

    let modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalEl);
    }

    modalInstance.hide();
}

function cleanForm() {
    const form = document.getElementById("form-contacto");
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea");

    form.reset();
    form.classList.remove("was-validated");

    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
    });
}