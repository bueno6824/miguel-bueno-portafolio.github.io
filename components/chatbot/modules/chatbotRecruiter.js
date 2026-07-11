import {
  normalizeText,
  matchesKeyword
} from "./chatbotUtils.js";

import {
  getSmartSuggestions
} from "./chatbotSuggestions.js";

export function getToolsList() {
  return {
    answer:
      "🛠 Estas son las principales herramientas y tecnologías que usa Miguel:",
    suggestions: getSmartSuggestions(
      "frontend backend arduino"
    )
  };
}

export function getRecruiterResponse(message) {
  const normalizedMessage =
    normalizeText(message);

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

  const isRecruiterIntent =
    recruiterKeywords.some(keyword =>
      normalizedMessage.includes(
        normalizeText(keyword)
      )
    );

  if (!isRecruiterIntent) return null;

  return {
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
    suggestions: getSmartSuggestions(message),
    action: {
      type: "section",
      target: "#contact"
    },
    direct: true
  };
}