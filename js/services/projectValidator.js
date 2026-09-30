/* =========================================
   PROJECT VALIDATOR
========================================= */

/*
 * Campos mínimos que debe contener
 * cada proyecto para considerarse válido.
 */
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

    /*
     * Almacena los errores encontrados
     * durante la validación del proyecto.
     */
    const errors = [];

    /*
     * Recorre todos los campos obligatorios
     * y verifica que tengan un valor válido.
     */
    REQUIRED_FIELDS.forEach(field => {

        if (

            project[field] === undefined ||

            project[field] === null ||

            project[field] === ""

        ) {

            /*
             * Registra el campo que falta
             * para facilitar la detección del problema.
             */
            errors.push(

                `Falta el campo "${field}".`

            );

        }

    });

    /*
     * El stack debe contener una colección
     * de tecnologías representada como arreglo.
     */
    if (

        !Array.isArray(project.stack)

    ) {

        errors.push(

            `"stack" debe ser un arreglo.`

        );

    }

    /*
     * El proyecto es válido únicamente cuando
     * no se encontró ningún error.
     */
    return {

        valid:

            errors.length === 0,

        errors

    };

}