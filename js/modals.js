// =======================
// MODALS.JS
// =======================
export { };

import { proyectosGlobal } from "./proyectos.js";

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".premium-card button");
    if (!btn) return;

    const card = btn.closest(".premium-card");
    const id = card.dataset.id;

    const proyecto = proyectosGlobal.find(p => String(p.id) === String(id));
    console.log("Proyecto encontrado:", proyecto);

    if (!proyecto) return;

    document.getElementById("modalTitulo").textContent = proyecto.titulo;
    document.getElementById("modalDescripcion").textContent = proyecto.descripcionLarga;

    // STACK
    const stackContainer = document.getElementById("modalStack");
    stackContainer.innerHTML = "";

    (proyecto.stack || []).forEach(tech => {
        stackContainer.innerHTML += `<span class="stack-badge">${tech}</span>`;
    });

    // CAROUSEL
    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";
    (proyecto.imagenes || []).forEach((img, index) => {
        carouselInner.innerHTML += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <img src="${img}" class="d-block w-100">
            </div>
        `;
    });


    // BOTONES
    const btnCodigo = document.querySelector("#boton-modal .btn-secundario");
    const btnDemo = document.querySelector("#boton-modal .btn-primario");

    // Código
    if (proyecto.codigo) {
        btnCodigo.href = proyecto.codigo;
    } else {
        btnCodigo.style.display = "none";
    }

    // Demo
    if (proyecto.demo) {
        btnDemo.href = proyecto.demo;
    } else {
        btnDemo.style.display = "none";
    }



});


