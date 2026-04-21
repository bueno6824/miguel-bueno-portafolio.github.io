// chatbot.js
import { enviarEmail, puedeEnviar } from "./email.js";

const toggleBtn = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messages = document.getElementById("chat-messages");

let estado = "inicio";
let datosUsuario = {};
let chatAbierto = false;

// 🔄 Toggle
toggleBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");

    if (chatWindow.classList.contains("hidden")) {
        toggleBtn.textContent = "💬";
    } else {
        toggleBtn.textContent = "❌";

        if (!chatAbierto && messages.children.length === 0) {
            mensajeBienvenida();
            chatAbierto = true;
        }
    }
});

// 💬 Bienvenida
function mensajeBienvenida() {
    estado = "menu";

    agregarMensaje("Bot", `
    👋 Bienvenido al asistente de Miguel

    ¿Qué quieres hacer?

    <br><br>
    <button class="opcion-btn" data-opcion="proyectos">📁 Proyectos</button>
    <button class="opcion-btn" data-opcion="contacto">📞 Contacto</button>
    <button class="opcion-btn" data-opcion="habilidades">🧠 Habilidades</button>
    <button class="opcion-btn" data-opcion="cv">📄 CV</button>
  `);
}

// 🔥 Delegación (solo una vez, fuera de funciones)
messages.addEventListener("click", (e) => {
    if (e.target.classList.contains("opcion-btn")) {
        const opcion = e.target.dataset.opcion;

        agregarMensaje("Tú", opcion);
        manejarFlujo(opcion);
    }
});

// 📁 Proyectos desde JSON
async function cargarProyectos() {
    const res = await fetch("/js/proyectos.json");
    const proyectos = await res.json();

    let html = "📁 Estos son mis proyectos:<br><br>";

    proyectos.forEach(p => {
        html += `
      <div style="margin-bottom:10px;">
        <strong>${p.titulo}</strong><br>
        ${p.descripcionCorta}<br>
        <a href="${p.demo}" target="_blank">Ver más</a>
      </div>
    `;
    });

    agregarMensaje("Bot", html);
}

// 🧠 Flujo conversacional
function manejarFlujo(input) {

    input = input.toLowerCase();

    // 🔥 BÚSQUEDA INTELIGENTE GLOBAL (SIN palabrasClave)
    if (estado === "inicio" || estado === "menu") {
        if (input.length > 3) {
            buscarProyectos(input);
            return;
        }
    }

    // 🟢 MENÚ
    if (estado === "menu") {

        if (input.includes("proyectos")) {
            cargarProyectos();
            estado = "inicio";
        }

        else if (input.includes("contacto")) {
            agregarMensaje("Bot", "Perfecto, te haré unas preguntas 👇");
            agregarMensaje("Bot", "¿Cuál es tu nombre?");
            estado = "nombre";
        }

        else if (input.includes("habilidades")) {
            agregarMensaje("Bot", "💻 HTML, CSS, JS, Laravel, Arduino 🚀");
        }

        else if (input.includes("cv")) {
            agregarMensaje("Bot", "📄 Aquí puedes ver mi CV 👉 /cv.pdf");
        }
    }

    // 🟡 NOMBRE
    else if (estado === "nombre") {
        datosUsuario.nombre = input;

        agregarMensaje("Bot", `Mucho gusto ${input} 🙌`);
        agregarMensaje("Bot", "¿Cuál es tu correo?");
        estado = "correo";
    }

    // 🟠 CORREO
    else if (estado === "correo") {

        if (!input.includes("@")) {
            agregarMensaje("Bot", "❌ Correo no válido, intenta otra vez");
            return;
        }

        datosUsuario.correo = input;

        agregarMensaje("Bot", "¿En qué puedo ayudarte?");
        estado = "mensaje";
    }

    // 🔵 MENSAJE
    else if (estado === "mensaje") {
        datosUsuario.mensaje = input;

        enviarCorreoChat();

        agregarMensaje("Bot", "🔥 Gracias, Miguel te contactará pronto");
        estado = "inicio";
    }

    console.log("Estado:", estado);
}

// 📩 Email desde chatbot
async function enviarCorreoChat() {

    if (!puedeEnviar()) {
        agregarMensaje("Bot", "⏳ Espera 1 minuto antes de enviar otro mensaje");
        return;
    }

    try {
        await enviarEmail(datosUsuario);
        agregarMensaje("Bot", "📩 Mensaje enviado correctamente 🚀");
    } catch (error) {
        console.error(error);
        agregarMensaje("Bot", "❌ Error al enviar");
    }
}

// 📤 Enviar mensaje
sendBtn.addEventListener("click", enviarMensaje);

function enviarMensaje() {
    const texto = userInput.value;
    if (!texto) return;

    agregarMensaje("Tú", texto);
    manejarFlujo(texto);

    userInput.value = "";
}

// 💬 UI mensajes
function agregarMensaje(usuario, texto) {
    const div = document.createElement("div");

    if (usuario === "Tú") {
        div.style.textAlign = "right";
        div.style.marginTop = "15px";
        div.style.marginBottom = "15px";
        div.innerHTML = `<span style="background:#000;color:#fff;padding:5px;border-radius:5px;">${texto}</span>`;
    } else {
        div.innerHTML = `<span style="background:#eee;padding:5px;border-radius:5px;">${texto}</span>`;
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// ⌨️ Enter
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensaje();
});



async function buscarProyectos(query) {

    const res = await fetch("/js/proyectos.json");
    const proyectos = await res.json();

    const stopWords = ["de", "la", "el", "un", "una", "y", "en", "para", "con"];
    // 🧠 limpiar palabras basura
    const palabras = query
        .toLowerCase()
        .split(" ")
        .filter(p => !stopWords.includes(p));

    console.log("Palabras:", palabras);

    const filtrados = proyectos.filter(p => {

        const texto = `
    ${p.categoria}
    ${p.titulo}
    ${p.descripcionCorta}
  `.toLowerCase();

        return palabras.some(palabra => texto.includes(palabra));
    });

    if (filtrados.length === 0) {
        agregarMensaje("Bot", `
            😅 No encontré proyectos con eso

            Intenta escribir algo como:
            👉 web  
            👉 arduino  
            👉 sistema  
        `);
        return;
    }

    let html = "🔍 Proyectos encontrados:<br><br>";

    filtrados.forEach(p => {
        html += `
        <div style="margin-bottom:10px;">
            <strong>${p.titulo}</strong><br>
            ${p.descripcionCorta}<br>
            <a href="${p.demo}" target="_blank">Ver más</a>
        </div>
        `;
    });

    agregarMensaje("Bot", html);
}