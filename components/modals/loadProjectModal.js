export async function loadProjectModal() {
    const existingModal =
        document.getElementById("projectModal");

    if (existingModal) {
        return existingModal;
    }

    const response = await fetch(
        new URL("./projectModal.html", import.meta.url)
    );

    if (!response.ok) {
        throw new Error(
            `No se pudo cargar el modal: HTTP ${response.status}`
        );
    }

    const html = await response.text();

    const template = document.createElement("template");
    template.innerHTML = html.trim();

    const modal = template.content.querySelector("#projectModal");

    if (!modal) {
        throw new Error(
            "El archivo projectModal.html no contiene #projectModal."
        );
    }

    document.body.append(template.content);

    return document.getElementById("projectModal");
}

