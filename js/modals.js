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
    // CAROUSEL
    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";

    const fragment = document.createDocumentFragment();

    (proyecto.imagenLarge || []).forEach((imgLarge, index) => {

        const imgSmall = proyecto.imagenSmall?.[index] || imgLarge;

        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

        const img = document.createElement("img");

        img.src = imgSmall; // fallback inicial
        img.srcset = `
        ${imgSmall} 600w,
        ${imgLarge} 1200w
    `;
        img.sizes = "(max-width: 768px) 100vw, 800px";

        img.className = "d-block w-100";
        img.alt = `Captura del proyecto ${proyecto.titulo} ${index + 1}`;
        img.width = 1200;   // proporción real aproximada
        img.height = 700;   // ajusta según tus imágenes

        // Primera imagen ayuda al LCP
        if (index === 0) {
            img.loading = "eager";
            img.fetchPriority = "high";
        } else {
            img.loading = "lazy";
        }

        carouselItem.appendChild(img);
        fragment.appendChild(carouselItem);
    });

    carouselInner.appendChild(fragment);


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


