import {

    normalizeProjects

} from "./projectModel.js";

import {

    validateProject

} from "./projectValidator.js";



/* =========================================
   PROJECT REPOSITORY
========================================= */

// Define la ubicación del archivo JSON utilizado como fuente de proyectos.
const PROJECTS_URL =

    new URL(

        "../../data/proyectos.json",

        import.meta.url

    );



/**
 * Obtiene los proyectos desde
 * la fuente de datos actual.
 */
export async function fetchProjects() {

    // Intenta cargar, validar y normalizar los proyectos.
    try {

        // Solicita el archivo JSON mediante fetch.
        const response =

            await fetch(

                PROJECTS_URL

            );

        // Verifica que la respuesta HTTP haya sido exitosa.
        if (!response.ok) {

            // Genera un error con información del estado HTTP recibido.
            throw new Error(

                `Error HTTP ${response.status}: ${response.statusText}`

            );

        }

        // Convierte la respuesta HTTP al objeto JavaScript correspondiente.
        const data =

            await response.json();



        /*
         * Validar que la fuente
         * contiene un arreglo.
         */

        // Comprueba que la información obtenida sea un arreglo de proyectos.
        if (!Array.isArray(data)) {

            // Genera un error cuando el archivo no contiene el formato esperado.
            throw new TypeError(

                "proyectos.json debe contener un arreglo de proyectos."

            );

        }



        /*
         * Validar cada proyecto.
         */

        // Valida individualmente cada proyecto antes de normalizarlo.
        data.forEach(project => {

            // Ejecuta las reglas de validación definidas para el proyecto.
            const result =

                validateProject(project);

            // Muestra las advertencias encontradas sin detener la carga completa.
            if (!result.valid) {

                // Identifica en consola el proyecto que contiene advertencias.
                console.warn(

                    `Proyecto "${project.id}" con advertencias:`

                );

                // Muestra en formato de tabla los errores encontrados.
                console.table(

                    result.errors

                );

            }

        });



        // Convierte todos los proyectos al modelo estándar del portafolio.
        return normalizeProjects(

            data

        );



    } catch (error) {

        // Registra cualquier problema ocurrido durante la carga o procesamiento.
        console.error(

            "No fue posible cargar los proyectos:",

            error

        );

        // Devuelve un arreglo vacío para evitar que la aplicación se detenga.
        return [];

    }

}