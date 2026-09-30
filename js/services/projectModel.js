/* =========================================
   PROJECT MODEL
========================================= */

/**
 * Convierte un texto en un slug válido.
 *
 * Ejemplo:
 * "FinanzasApp - Gestor Personal"
 *
 * Resultado:
 * "finanzasapp-gestor-personal"
 */
export function createProjectSlug(text = "") {

    // Convierte el valor recibido a texto y elimina acentos.
    return text

        .toString()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toLowerCase()

        .trim()

        // Reemplaza cualquier grupo de caracteres no válidos por un guion.
        .replace(/[^a-z0-9]+/g, "-")

        // Elimina guiones sobrantes al inicio y al final.
        .replace(/^-+|-+$/g, "");

}


/**
 * Convierte enlaces vacíos o falsos
 * en valores null.
 */
function normalizeLink(link) {

    // Considera inválidos los enlaces vacíos, "#" o el texto "null".
    if (

        !link ||

        link === "#" ||

        link === "null"

    ) {

        return null;

    }

    // Devuelve el enlace cuando contiene un valor válido.
    return link;

}


/**
 * Normaliza la imagen de portada.
 *
 * Permite utilizar:
 *
 * imagenPortada: "ruta.webp"
 *
 * o:
 *
 * imagenPortada: {
 *   src: "ruta.webp",
 *   alt: "Descripción"
 * }
 */


/*function normalizeCover(project) {
  const cover =
    project.imagenPortada;
  if (typeof cover === "string") {
    return {
      src: cover,
      alt:
        project.descripcionImagen ||
        `Vista previa de ${project.titulo || "proyecto"}`
    };
  }
  return {
    src: cover?.src || "",
    alt:
      cover?.alt ||
      `Vista previa de ${project.titulo || "proyecto"}`
  };
}*/


/**
 * Normaliza la imagen de portada.
 */
function normalizeCover(

    project

) {

    // Obtiene la configuración original de la imagen de portada.
    const cover =

        project.imagenPortada;

    // Obtiene el título sin el emoji inicial para utilizarlo en el texto alternativo.
    const cleanTitle =

        project.titulo

            ?.replace(

                /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+\s*/u,

                ""

            )

            .trim() ||

        "proyecto";

    // Convierte una portada definida directamente como una ruta en un objeto normalizado.
    if (

        typeof cover ===

        "string"

    ) {

        return {

            src: cover,

            alt:

                project.descripcionImagen ||

                `Vista previa de ${cleanTitle}`

        };

    }

    // Devuelve la portada utilizando sus propiedades src y alt.
    return {

        src:

            cover?.src || "",

        alt:

            cover?.alt ||

            `Vista previa de ${cleanTitle}`

    };

}


/**
 * Normaliza las descripciones.
 *
 * Mantiene compatibilidad con:
 *
 * descripcionCorta
 * descripcionLarga
 * descripcionImagen
 */
function normalizeDescription(project) {

    // Agrupa las diferentes descripciones dentro de una estructura uniforme.
    return {

        // Obtiene la descripción destinada a la imagen.
        imagen:

            project.descripcion?.imagen ??

            project.descripcionImagen ??

            "",

        // Obtiene la descripción corta del proyecto.
        corta:

            project.descripcion?.corta ??

            project.descripcionCorta ??

            "",

        // Obtiene la descripción larga del proyecto.
        larga:

            project.descripcion?.larga ??

            project.descripcionLarga ??

            ""

    };

}


/**
 * Normaliza la metadata del proyecto.
 */


/*function normalizeMetadata(project) {
  return {
    estado:
      project.metadata?.estado ??
      project.estado ??
      "sin-estado",
    rol:
      project.metadata?.rol ??
      project.rol ??
      "Developer",
    duracion:
      project.metadata?.duracion ??
      project.duracion ??
      null,
    cliente:
      project.metadata?.cliente ??
      project.cliente ??
      "Proyecto personal",
    fechaInicio:
      project.metadata?.fechaInicio ??
      project.fechaInicio ??
      null,
    fechaFinalizacion:
      project.metadata?.fechaFinalizacion ??
      project.fechaFinalizacion ??
      null
  };
}*/


/**
 * Normaliza la metadata del proyecto.
 */
function normalizeMetadata(

    project

) {

    // Obtiene la metadata agrupada o utiliza un objeto vacío como respaldo.
    const metadata =

        project.metadata || {};

    return {

        // Normaliza el estado manteniendo compatibilidad con la propiedad antigua.
        estado:

            normalizeTaxonomyValue(

                metadata.estado ??

                project.estado,

                "sin-estado"

            ),

        // Obtiene el rol desde metadata o desde la propiedad anterior.
        rol:

            metadata.rol ??

            project.rol ??

            "Developer",

        // Obtiene la duración del proyecto.
        duracion:

            metadata.duracion ??

            project.duracion ??

            null,

        // Obtiene el cliente asociado al proyecto.
        cliente:

            metadata.cliente ??

            project.cliente ??

            "Proyecto personal",

        // Obtiene la fecha de inicio del proyecto.
        fechaInicio:

            metadata.fechaInicio ??

            project.fechaInicio ??

            null,

        // Obtiene la fecha de finalización del proyecto.
        fechaFinalizacion:

            metadata.fechaFinalizacion ??

            project.fechaFinalizacion ??

            null

    };

}


/**
 * Normaliza el Case Study.
 *
 * También mantiene compatibilidad con
 * los campos antiguos colocados en la raíz.
 */
function normalizeCaseStudy(project) {

    // Agrupa la información del caso de estudio en una estructura uniforme.
    return {

        // Obtiene el objetivo del proyecto.
        objetivo:

            project.caseStudy?.objetivo ??

            project.objetivo ??

            "",

        // Obtiene el problema que aborda el proyecto.
        problema:

            project.caseStudy?.problema ??

            project.problema ??

            "",

        // Obtiene la solución desarrollada.
        solucion:

            project.caseStudy?.solucion ??

            project.solucion ??

            "",

        // Obtiene la participación realizada durante el proyecto.
        participacion:

            project.caseStudy?.participacion ??

            project.participacion ??

            "",

        // Obtiene las características principales del proyecto.
        caracteristicas:

            project.caseStudy?.caracteristicas ??

            project.caracteristicas ??

            [],

        // Obtiene los retos encontrados durante el desarrollo.
        retos:

            project.caseStudy?.retos ??

            project.retos ??

            [],

        // Obtiene los aprendizajes obtenidos durante el proyecto.
        aprendizajes:

            project.caseStudy?.aprendizajes ??

            project.aprendizajes ??

            []

    };

}


/**
 * Normaliza los enlaces.
 *
 * Mantiene compatibilidad con:
 *
 * demo
 * codigo
 */
function normalizeLinks(project) {

    // Agrupa todos los enlaces del proyecto en una estructura uniforme.
    return {

        // Normaliza el enlace de demostración.
        demo: normalizeLink(

            project.links?.demo ??

            project.demo

        ),

        // Normaliza el enlace al código fuente.
        codigo: normalizeLink(

            project.links?.codigo ??

            project.codigo

        ),

        // Normaliza el enlace de documentación.
        documentacion: normalizeLink(

            project.links?.documentacion

        ),

        // Normaliza el enlace de la API.
        api: normalizeLink(

            project.links?.api

        ),

        // Normaliza el enlace de descarga.
        descarga: normalizeLink(

            project.links?.descarga

        )

    };

}


/**
 * Normaliza los recursos multimedia.
 */
function normalizeMedia(media = []) {

    // Verifica que el valor recibido sea realmente un arreglo.
    if (!Array.isArray(media)) {

        return [];

    }

    // Filtra recursos válidos y transforma cada elemento al formato estándar.
    return media

        // Conserva únicamente los elementos que tienen una fuente multimedia.
        .filter(item => item?.src)

        // Genera una estructura uniforme para cada recurso multimedia.
        .map((item, index) => ({

            // Utiliza el ID existente o genera uno basado en la posición.
            id:

                item.id ||

                `media-${index + 1}`,

            // Utiliza el tipo definido o establece imagen como valor predeterminado.
            type:

                item.type ||

                "image",

            // Conserva la ruta del recurso multimedia.
            src:

                item.src,

            // Conserva el texto alternativo.
            alt:

                item.alt ||

                "",

            // Conserva el título del recurso.
            title:

                item.title ||

                "",

            // Conserva el texto descriptivo del recurso.
            caption:

                item.caption ||

                "",

            // Conserva la imagen utilizada como poster para videos.
            poster:

                item.poster ||

                null

        }));

}


/**
 * Convierte un proyecto antiguo o nuevo
 * al modelo estándar del portafolio.
 */


/*export function normalizeProject(
  project = {}
) {
  const title =
    project.titulo?.trim() ||
    "Proyecto sin título";
  return {
    id:
      project.id ||
      createProjectSlug(title),
    slug:
      project.slug ||
      createProjectSlug(title),
    titulo:
      title,
    icono:
      project.icono ||
      "",
    featured:
      Boolean(project.featured),
    visible:
      project.visible !== false,
    categoria:
      project.categoria
        ?.toString()
        .toLowerCase()
        .trim() ||
      "sin-categoria",
    subcategorias:
      Array.isArray(
        project.subcategorias
      )
        ? project.subcategorias
        : [],
    nivel:
      project.nivel
        ?.toString()
        .toLowerCase()
        .trim() ||
      "sin-nivel",
    anio:
      project.anio ??
      project.año ??
      null,
    metadata:
      normalizeMetadata(project),
    imagenPortada:
      normalizeCover(project),
    media:
      normalizeMedia(project.media),
    descripcion:
      normalizeDescription(project),
    caseStudy:
      normalizeCaseStudy(project),
    stack:
      Array.isArray(project.stack)
        ? project.stack
        : [],
    tecnologias:
      project.tecnologias || {},
    links:
      normalizeLinks(project),
    busqueda: {
      keywords:
        project.busqueda?.keywords ||
        [],
      aliases:
        project.busqueda?.aliases ||
        []
    }
  };
}*/


/**
 * Extrae el emoji inicial de un título.
 *
 * Ejemplo:
 * "💰 FinanzasApp"
 *
 * Resultado:
 * "💰"
 */
function extractProjectIcon(

    title = ""

) {

    // Busca uno o varios caracteres que representen un emoji al inicio del título.
    const match =

        title.match(

            /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+/u

        );

    // Devuelve el emoji encontrado o una cadena vacía cuando no existe.
    return match?.[0] || "";

}


/**
 * Normaliza valores utilizados para:
 *
 * categoria
 * nivel
 * estado
 * subcategorias
 */
function normalizeTaxonomyValue(

    value,

    fallback = ""

) {

    // Utiliza el valor de respaldo cuando el valor recibido está vacío o no existe.
    if (

        value === null ||

        value === undefined ||

        value === ""

    ) {

        return fallback;

    }

    // Convierte el valor a una representación uniforme para búsquedas y filtros.
    return value

        .toString()

        .normalize("NFD")

        .replace(

            /[\u0300-\u036f]/g,

            ""

        )

        .toLowerCase()

        .trim()

        // Reemplaza espacios consecutivos por guiones.
        .replace(

            /\s+/g,

            "-"

        );

}


/**
 * Devuelve un arreglo limpio,
 * sin valores vacíos ni repetidos.
 */
function normalizeStringArray(

    values = []

) {

    // Verifica que el valor recibido sea un arreglo.
    if (!Array.isArray(values)) {

        return [];

    }

    // Elimina valores vacíos, limpia los textos y elimina duplicados.
    return [

        ...new Set(

            values

                .filter(Boolean)

                .map(value =>

                    value

                        .toString()

                        .trim()

                )

                .filter(Boolean)

        )

    ];

}


/**
 * Normaliza el año.
 */
function normalizeYear(value) {

    // Devuelve null cuando no existe un año válido.
    if (

        value === null ||

        value === undefined ||

        value === ""

    ) {

        return null;

    }

    // Convierte el valor recibido a un número entero.
    const year =

        Number.parseInt(value, 10);

    // Devuelve null cuando la conversión no produjo un número válido.
    return Number.isNaN(year)

        ? null

        : year;

}


/**
 * Normaliza las tecnologías agrupadas.
 */
function normalizeTechnologies(

    technologies = {}

) {

    // Verifica que el valor sea un objeto y no un arreglo.
    if (

        !technologies ||

        typeof technologies !==

        "object" ||

        Array.isArray(technologies)

    ) {

        return {};

    }

    // Normaliza cada grupo de tecnologías conservando su nombre.
    return Object.fromEntries(

        Object.entries(

            technologies

        ).map(

            ([group, values]) => [

                group,

                normalizeStringArray(

                    values

                )

            ]

        )

    );

}


/**
 * Normaliza los datos destinados
 * al buscador y al chatbot.
 */
function normalizeSearchData(

    search = {}

) {

    // Devuelve las palabras clave y alias en un formato limpio y uniforme.
    return {

        // Normaliza las palabras clave utilizadas para búsquedas.
        keywords:

            normalizeStringArray(

                search?.keywords

            ),

        // Normaliza los alias utilizados para identificar el proyecto.
        aliases:

            normalizeStringArray(

                search?.aliases

            )

    };

}


/**
 * Convierte un proyecto antiguo o nuevo
 * al modelo estándar del portafolio.
 *
 * Incluye propiedades de compatibilidad
 * temporal para no romper componentes antiguos.
 */
export function normalizeProject(

    project = {}

) {

    // Obtiene el título original del proyecto o utiliza un texto predeterminado.
    const rawTitle =

        project.titulo?.trim() ||

        "Proyecto sin título";

    // Elimina el emoji inicial del título para generar identificadores y títulos limpios.
    const titleWithoutIcon =

        rawTitle.replace(

            /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+\s*/u,

            ""

        );

    // Normaliza las descripciones del proyecto.
    const description =

        normalizeDescription(project);

    // Normaliza la metadata del proyecto.
    const metadata =

        normalizeMetadata(project);

    // Normaliza la información del Case Study.
    const caseStudy =

        normalizeCaseStudy(project);

    // Normaliza todos los enlaces disponibles.
    const links =

        normalizeLinks(project);

    // Normaliza la imagen de portada.
    const cover =

        normalizeCover(project);

    // Construye el modelo estándar que utilizarán los diferentes módulos del portafolio.
    const normalizedProject = {

        /* ==============================
           IDENTIDAD
        ============================== */

        // Utiliza el ID existente o genera uno basado en el título.
        id:

            project.id ||

            createProjectSlug(

                titleWithoutIcon

            ),

        // Utiliza el slug existente o genera uno automáticamente.
        slug:

            project.slug ||

            createProjectSlug(

                titleWithoutIcon

            ),

        // Guarda el título limpio del proyecto.
        titulo:

            titleWithoutIcon,

        // Conserva el icono existente o extrae el emoji inicial del título.
        icono:

            project.icono ||

            extractProjectIcon(rawTitle),

        // Convierte el valor de destacado a booleano.
        featured:

            Boolean(project.featured),

        // Mantiene visible el proyecto salvo que se indique explícitamente false.
        visible:

            project.visible !== false,


        /* ==============================
           CLASIFICACIÓN
        ============================== */

        // Normaliza la categoría principal del proyecto.
        categoria:

            normalizeTaxonomyValue(

                project.categoria,

                "sin-categoria"

            ),

        // Normaliza las subcategorías del proyecto.
        subcategorias:

            normalizeStringArray(

                project.subcategorias

            ),

        // Normaliza el nivel de dificultad o experiencia.
        nivel:

            normalizeTaxonomyValue(

                project.nivel,

                "sin-nivel"

            ),

        // Normaliza el año manteniendo compatibilidad entre anio y año.
        anio:

            normalizeYear(

                project.anio ??

                project.año

            ),


        /* ==============================
           INFORMACIÓN
        ============================== */

        // Agrega la metadata normalizada.
        metadata,

        // Agrega la portada normalizada.
        imagenPortada:

            cover,

        // Conserva directamente la ruta de la imagen de portada para componentes antiguos.
        imagenPortadaSrc:

            cover.src,

        // Normaliza los recursos multimedia.
        media:

            normalizeMedia(

                project.media

            ),

        // Agrega las descripciones normalizadas.
        descripcion:

            description,

        // Agrega la información del Case Study.
        caseStudy,

        // Normaliza la lista principal de tecnologías.
        stack:

            normalizeStringArray(

                project.stack

            ),

        // Normaliza las tecnologías agrupadas.
        tecnologias:

            normalizeTechnologies(

                project.tecnologias

            ),

        // Agrega los enlaces normalizados.
        links,

        // Normaliza la información utilizada por búsquedas y chatbot.
        busqueda:

            normalizeSearchData(

                project.busqueda

            )

    };


    /*
     * Compatibilidad temporal.
     *
     * Estas propiedades permiten que el
     * código antiguo siga funcionando
     * durante la migración.
     */

    // Devuelve el modelo normalizado junto con las propiedades antiguas compatibles.
    return {

        // Conserva todas las propiedades del modelo estándar.
        ...normalizedProject,

        // Mantiene compatibilidad con la propiedad año.
        año:

            normalizedProject.anio,

        // Mantiene el rol directamente en la raíz.
        rol:

            metadata.rol,

        // Mantiene el estado directamente en la raíz.
        estado:

            metadata.estado,

        // Mantiene la duración directamente en la raíz.
        duracion:

            metadata.duracion,

        // Mantiene el cliente directamente en la raíz.
        cliente:

            metadata.cliente,

        // Mantiene la fecha de inicio directamente en la raíz.
        fechaInicio:

            metadata.fechaInicio,

        // Mantiene la fecha de finalización directamente en la raíz.
        fechaFinalizacion:

            metadata.fechaFinalizacion,

        // Mantiene la descripción de imagen directamente en la raíz.
        descripcionImagen:

            description.imagen,

        // Mantiene la descripción corta directamente en la raíz.
        descripcionCorta:

            description.corta,

        // Mantiene la descripción larga directamente en la raíz.
        descripcionLarga:

            description.larga,

        // Mantiene el objetivo del Case Study directamente en la raíz.
        objetivo:

            caseStudy.objetivo,

        // Mantiene el problema del Case Study directamente en la raíz.
        problema:

            caseStudy.problema,

        // Mantiene la solución del Case Study directamente en la raíz.
        solucion:

            caseStudy.solucion,

        // Mantiene la participación directamente en la raíz.
        participacion:

            caseStudy.participacion,

        // Mantiene las características directamente en la raíz.
        caracteristicas:

            caseStudy.caracteristicas,

        // Mantiene los retos directamente en la raíz.
        retos:

            caseStudy.retos,

        // Mantiene los aprendizajes directamente en la raíz.
        aprendizajes:

            caseStudy.aprendizajes,

        // Mantiene el enlace demo directamente en la raíz.
        demo:

            links.demo,

        // Mantiene el enlace al código directamente en la raíz.
        codigo:

            links.codigo

    };

}


/**
 * Normaliza un arreglo completo de proyectos.
 */
export function normalizeProjects(

    projects = []

) {

    // Verifica que la fuente de proyectos sea un arreglo.
    if (!Array.isArray(projects)) {

        // Informa en consola cuando se recibe un formato incorrecto.
        console.warn(

            "normalizeProjects esperaba un arreglo."

        );

        // Devuelve una lista vacía para evitar errores posteriores.
        return [];

    }

    // Normaliza cada proyecto utilizando el modelo estándar.
    return projects.map(

        normalizeProject

    );

}