
export async function loadProjectModal() {
    const existingModal =
        document.getElementById("projectModal");

    // Reutiliza el modal solamente si está completo.
    if (
        existingModal &&
        existingModal.querySelector(
            ".modal-project-navigation"
        ) &&
        existingModal.querySelector(
            "#modalPreviousProject"
        ) &&
        existingModal.querySelector(
            "#modalNextProject"
        )
    ) {
        return existingModal;
    }

    // Carga la plantilla compartida desde esta misma carpeta.
    const response = await fetch(
        new URL("./projectModal.tpl", import.meta.url),
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error(
            `No se pudo cargar el modal: HTTP ${response.status}`
        );
    }

    const html = await response.text();

    // Analiza la plantilla antes de modificar el DOM.
    const template = document.createElement("template");
    template.innerHTML = html.trim();

    const modal =
        template.content.querySelector("#projectModal");

    // Evita insertar una plantilla incompleta.
    if (
        !modal ||
        !modal.querySelector(".modal-project-navigation") ||
        !modal.querySelector("#modalPreviousProject") ||
        !modal.querySelector("#modalNextProject")
    ) {
        throw new Error(
            `La plantilla del modal está incompleta. ` +
            `URL: ${response.url}. ` +
            `Longitud recibida: ${html.length}. ` +
            `¿Contiene navegación?: ` +
            `${html.includes("modal-project-navigation")}`
        );
    }

    // Sustituye el modal incompleto o inserta el primero.
    if (existingModal) {
        existingModal.replaceWith(modal);
    } else {
        document.body.append(template.content);
    }

    return document.getElementById("projectModal");
}
