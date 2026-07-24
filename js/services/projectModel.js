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
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Convierte enlaces vacíos o falsos
 * en valores null.
 */
function normalizeLink(link) {
    if (
        !link ||
        link === "#" ||
        link === "null"
    ) {
        return null;
    }

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


/**function normalizeCover(project) {
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
}

*/

/**
 * Normaliza la imagen de portada.
 */
function normalizeCover(
    project
) {
    const cover =
        project.imagenPortada;

    const cleanTitle =
        project.titulo
            ?.replace(
                /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+\s*/u,
                ""
            )
            .trim() ||
        "proyecto";

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
    return {
        imagen:
            project.descripcion?.imagen ??
            project.descripcionImagen ??
            "",

        corta:
            project.descripcion?.corta ??
            project.descripcionCorta ??
            "",

        larga:
            project.descripcion?.larga ??
            project.descripcionLarga ??
            ""
    };
}

/**
 * Normaliza la metadata del proyecto.
 */


/**function normalizeMetadata(project) {
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
    const metadata =
        project.metadata || {};

    return {
        estado:
            normalizeTaxonomyValue(
                metadata.estado ??
                project.estado,
                "sin-estado"
            ),

        rol:
            metadata.rol ??
            project.rol ??
            "Developer",

        duracion:
            metadata.duracion ??
            project.duracion ??
            null,

        cliente:
            metadata.cliente ??
            project.cliente ??
            "Proyecto personal",

        fechaInicio:
            metadata.fechaInicio ??
            project.fechaInicio ??
            null,

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
    return {
        objetivo:
            project.caseStudy?.objetivo ??
            project.objetivo ??
            "",

        problema:
            project.caseStudy?.problema ??
            project.problema ??
            "",

        solucion:
            project.caseStudy?.solucion ??
            project.solucion ??
            "",

        participacion:
            project.caseStudy?.participacion ??
            project.participacion ??
            "",

        caracteristicas:
            project.caseStudy?.caracteristicas ??
            project.caracteristicas ??
            [],

        retos:
            project.caseStudy?.retos ??
            project.retos ??
            [],

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
    return {
        demo: normalizeLink(
            project.links?.demo ??
            project.demo
        ),

        codigo: normalizeLink(
            project.links?.codigo ??
            project.codigo
        ),

        documentacion: normalizeLink(
            project.links?.documentacion
        ),

        api: normalizeLink(
            project.links?.api
        ),

        descarga: normalizeLink(
            project.links?.descarga
        )
    };
}

/**
 * Normaliza los recursos multimedia.
 */
function normalizeMedia(media = []) {
    if (!Array.isArray(media)) {
        return [];
    }

    return media
        .filter(item => item?.src)
        .map((item, index) => ({
            id:
                item.id ||
                `media-${index + 1}`,

            type:
                item.type ||
                "image",

            src:
                item.src,

            alt:
                item.alt ||
                "",

            title:
                item.title ||
                "",

            caption:
                item.caption ||
                "",

            poster:
                item.poster ||
                null
        }));
}

/**
 * Convierte un proyecto antiguo o nuevo
 * al modelo estándar del portafolio.
 */




/**export function normalizeProject(
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
    const match =
        title.match(
            /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+/u
        );

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
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return value
        .toString()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim()
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
    if (!Array.isArray(values)) {
        return [];
    }

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
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const year =
        Number.parseInt(value, 10);

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
    if (
        !technologies ||
        typeof technologies !==
        "object" ||
        Array.isArray(technologies)
    ) {
        return {};
    }

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
    return {
        keywords:
            normalizeStringArray(
                search?.keywords
            ),

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
    const rawTitle =
        project.titulo?.trim() ||
        "Proyecto sin título";

    const titleWithoutIcon =
        rawTitle.replace(
            /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+\s*/u,
            ""
        );

    const description =
        normalizeDescription(project);

    const metadata =
        normalizeMetadata(project);

    const caseStudy =
        normalizeCaseStudy(project);

    const links =
        normalizeLinks(project);

    const cover =
        normalizeCover(project);

    const normalizedProject = {
        /* ==============================
           IDENTIDAD
        ============================== */

        id:
            project.id ||
            createProjectSlug(
                titleWithoutIcon
            ),

        slug:
            project.slug ||
            createProjectSlug(
                titleWithoutIcon
            ),

        titulo:
            titleWithoutIcon,

        icono:
            project.icono ||
            extractProjectIcon(rawTitle),

        featured:
            Boolean(project.featured),

        visible:
            project.visible !== false,

        /* ==============================
           CLASIFICACIÓN
        ============================== */

        categoria:
            normalizeTaxonomyValue(
                project.categoria,
                "sin-categoria"
            ),

        subcategorias:
            normalizeStringArray(
                project.subcategorias
            ),

        nivel:
            normalizeTaxonomyValue(
                project.nivel,
                "sin-nivel"
            ),

        anio:
            normalizeYear(
                project.anio ??
                project.año
            ),

        /* ==============================
           INFORMACIÓN
        ============================== */

        metadata,

        imagenPortada:
            cover,
        imagenPortadaSrc:
            cover.src,
        media:
            normalizeMedia(
                project.media
            ),

        descripcion:
            description,

        caseStudy,

        stack:
            normalizeStringArray(
                project.stack
            ),

        tecnologias:
            normalizeTechnologies(
                project.tecnologias
            ),

        links,

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
    return {
        ...normalizedProject,

        año:
            normalizedProject.anio,

        rol:
            metadata.rol,

        estado:
            metadata.estado,

        duracion:
            metadata.duracion,

        cliente:
            metadata.cliente,

        fechaInicio:
            metadata.fechaInicio,

        fechaFinalizacion:
            metadata.fechaFinalizacion,

        descripcionImagen:
            description.imagen,

        descripcionCorta:
            description.corta,

        descripcionLarga:
            description.larga,

        objetivo:
            caseStudy.objetivo,

        problema:
            caseStudy.problema,

        solucion:
            caseStudy.solucion,

        participacion:
            caseStudy.participacion,

        caracteristicas:
            caseStudy.caracteristicas,

        retos:
            caseStudy.retos,

        aprendizajes:
            caseStudy.aprendizajes,

        demo:
            links.demo,

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
    if (!Array.isArray(projects)) {
        console.warn(
            "normalizeProjects esperaba un arreglo."
        );

        return [];
    }

    return projects.map(
        normalizeProject
    );
}