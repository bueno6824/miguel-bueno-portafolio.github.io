/* =========================================
   PROJECT VALIDATOR
========================================= */

const REQUIRED_FIELDS = [
    "id",
    "titulo",
    "categoria",
    "nivel",
    "anio",
    "stack"
];

/**
 * Valida un proyecto.
 *
 * Devuelve:
 *
 * {
 *   valid: true,
 *   errors: []
 * }
 */
export function validateProject(project = {}) {
    const errors = [];

    REQUIRED_FIELDS.forEach(field => {
        if (
            project[field] === undefined ||
            project[field] === null ||
            project[field] === ""
        ) {
            errors.push(
                `Falta el campo "${field}".`
            );
        }
    });

    if (
        !Array.isArray(project.stack)
    ) {
        errors.push(
            `"stack" debe ser un arreglo.`
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}