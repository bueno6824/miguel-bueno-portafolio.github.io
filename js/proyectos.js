export { };

export let proyectosGlobal = [];

fetch("js/proyectos.json")
    .then(res => res.json())
    .then(data => {
        proyectosGlobal = data;
        renderizarProyectos(data);
    });


export function renderizarProyectos(proyectos) {
    const contenedor = document.getElementById("contenedorProyectos");
    contenedor.innerHTML = "";


    proyectos.forEach(proyecto => {

        // 🔥 Generar stack dinámico correctamente
        const stackHTML = proyecto.stack
            .map(tech => `<span class="stack-badge">${tech}</span>`)
            .join("");

        contenedor.innerHTML += `
        <div class="col-md-4 mb-2">
            <div class="premium-card" data-id="${proyecto.id}">
                <div class="proyecto-imagen-wrapper">
                    <img src="${proyecto.imagenPortada}" class="imagen-proyecto" alt="Proyecto">
                        <div class="proyecto-overlay">
                            <span class="badge-proyecto">${proyecto.categoria}</span>
                        </div>
            
                        <div class="overlay-proyecto">
                            <p>${proyecto.descripcionImagen}</p>
                        </div>
                </div>

            <div class="contenido-proyecto">
                <h3 class="titulo-proyecto">${proyecto.titulo}</h3>
                    <p class="descripcion-proyecto">${proyecto.descripcionCorta}</p>
                        <div class="stack-proyecto">
                            ${stackHTML}
                        </div>

                        <div class="proyecto-footer">
                            <span class="nivel ${proyecto.nivel.toLowerCase()}">${proyecto.nivel}</span>
                            <span class="anio">📆${proyecto.año}</span>
                        </div>


                        <button class="btn btn-primario w-100 mt-2 btn-ver-proyecto"data-id="${proyecto.id} "data-bs-toggle="modal" data-bs-target="#modalProyecto">Ver Proyecto</button>

                    
                </div> 
            </div> 
        </div> 
    `;
    });

    console.log("Renderizando:", proyectos);


}


document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", function () {

        document.querySelectorAll(".filtro-btn")
            .forEach(b => b.classList.remove("active"));

        this.classList.add("active");

        const categoria = this.dataset.categoria;

        let resultado = proyectosGlobal;

        if (categoria !== "todos") {
            resultado = proyectosGlobal.filter(
                p => p.categoria.toLowerCase() === categoria.toLowerCase()
            );
        }

        renderizarProyectos(resultado);

        document.getElementById("sinResultados")
            .classList.toggle("oculto", resultado.length !== 0);
    });
});

