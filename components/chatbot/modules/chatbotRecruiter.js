import {

  normalizeText,

  matchesKeyword

} from "./chatbotUtils.js";

import {

  getSmartSuggestions

} from "./chatbotSuggestions.js";

// Devuelve la lista general de herramientas y tecnologías
// utilizadas en el portafolio de Miguel.
export function getToolsList() {

  return {

    answer:

      "🛠 Estas son las principales herramientas y tecnologías que usa Miguel:",

    // Genera sugerencias relacionadas con las principales
    // áreas tecnológicas del portafolio.
    suggestions: getSmartSuggestions(

      "frontend backend arduino"

    )

  };

}

// Detecta si el mensaje del usuario está relacionado
// con contratación, empleo, experiencia o perfil profesional.
export function getRecruiterResponse(message) {

  // Normaliza el mensaje para facilitar la comparación
  // con las palabras clave de reclutamiento.
  const normalizedMessage =

    normalizeText(message);

  // Palabras y expresiones asociadas con intenciones
  // de reclutamiento o búsqueda de información profesional.
  const recruiterKeywords = [

    "contratar",

    "contratacion",

    "contratación",

    "reclutador",

    "recruiter",

    "empleo",

    "trabajo",

    "vacante",

    "desarrollador",

    "developer",

    "experiencia",

    "por que deberia contratarte",

    "por qué debería contratarte",

    "full stack",

    "frontend developer"

  ];

  // Comprueba si alguna palabra clave aparece
  // dentro del mensaje normalizado.
  const isRecruiterIntent =

    recruiterKeywords.some(keyword =>

      normalizedMessage.includes(

        normalizeText(keyword)

      )

    );

  // Si el mensaje no corresponde a una intención
  // de reclutamiento, permite que otros módulos lo procesen.
  if (!isRecruiterIntent) return null;

  return {

    // Presenta un resumen profesional del perfil,
    // tecnologías principales y áreas en las que puede aportar.
    answer: `

      🚀 <strong>Miguel Bueno</strong> es desarrollador Frontend con enfoque en interfaces modernas, arquitectura modular y experiencia de usuario.<br><br>

      <strong>Perfil:</strong><br>

      Frontend Developer / Full Stack Junior<br><br>

      <strong>Stack principal:</strong><br>

      HTML, CSS, JavaScript, Bootstrap, Git, GitHub, Node.js, Express, MySQL, Arduino e IoT.<br><br>

      <strong>Puede aportar en:</strong><br>

      • Desarrollo de interfaces responsive<br>

      • Portafolios y landing pages modernas<br>

      • Componentes UI reutilizables<br>

      • Integración con APIs<br>

      • Proyectos frontend con lógica dinámica<br>

      • Automatización e IoT con Arduino<br><br>

      Te llevo a contacto para que puedas escribirle.

    `,

    // Genera sugerencias adicionales basadas en el mensaje
    // original del usuario.
    suggestions: getSmartSuggestions(message),

    // Define una acción directa para llevar al usuario
    // a la sección de contacto del portafolio.
    action: {

      type: "section",

      target: "#contact"

    },

    // Indica que esta respuesta debe ejecutarse como
    // una respuesta directa dentro del flujo del chatbot.
    direct: true

  };

}