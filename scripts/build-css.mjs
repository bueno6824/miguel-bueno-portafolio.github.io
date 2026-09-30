import {

  readFile,

  writeFile

} from "node:fs/promises";

import {

  resolve

} from "node:path";

/*
 * Obtiene la carpeta raíz del proyecto
 * desde la que se ejecuta el script.
 */
const root =

  process.cwd();

/*
 * Lista de archivos CSS que serán combinados
 * para generar la hoja de estilos principal.
 *
 * El orden es importante porque determina
 * el orden final de las reglas CSS.
 */
const cssFiles = [

  "styles/base/variables.css",

  "styles/base/reset.css",

  "styles/base/typography.css",

  "styles/Layout/layout.css",

  "styles/Layout/grid.css",

  "styles/animations/keyframes.css",

  "styles/animations/animations.css",

  "styles/Utilities/helpers.css",

  "styles/themes/dark.css",

  "components/navbar/navbar.css",

  "components/hero/hero.css",

  "components/UI/button/button.css",

  "components/UI/card/card.css",

  "components/UI/badge/badge.css",

  "components/UI/input/input.css",

  "components/UI/sections/sections.css",

  "components/about/about.css",

  "components/modals/modals.css",

  "components/tools/tools.css",

  "components/locations/locations.css",

  "components/chatbot/chatbot-launcher.css",

  "components/skills/skills.css",

  "components/Contact/contact.css",

  "components/footer/footer.css",

  "components/projects/proyectos.css",

];

/**
 * Combina todos los archivos CSS definidos
 * en cssFiles dentro de una sola hoja.
 */
async function buildCSS() {

  /*
   * Almacena temporalmente el contenido
   * de cada archivo CSS antes de unirlo.
   */
  const parts = [];

  /*
   * Recorre cada archivo CSS respetando
   * el orden establecido en cssFiles.
   */
  for (const file of cssFiles) {

    /*
     * Convierte la ruta relativa del archivo
     * en una ruta absoluta dentro del proyecto.
     */
    const absolutePath =

      resolve(root, file);

    /*
     * Lee el contenido del archivo CSS
     * utilizando codificación UTF-8.
     */
    const content =

      await readFile(

        absolutePath,

        "utf8"

      );

    /*
     * Agrega el contenido junto con un comentario
     * que identifica el archivo de origen.
     *
     * trim() elimina espacios innecesarios
     * al inicio y al final del contenido.
     */
    parts.push(

      `/* ===== ${file} ===== */\n${content.trim()}`

    );

  }

  /*
   * Une todos los archivos CSS utilizando
   * dos saltos de línea como separación.
   */
  const output =

    parts.join("\n\n");

  /*
   * Escribe el resultado final en styles/app.css.
   */
  await writeFile(

    resolve(

      root,

      "styles/app.css"

    ),

    output,

    "utf8"

  );

  /*
   * Informa en consola que la generación
   * de la hoja principal terminó correctamente.
   */
  console.log(

    "✅ styles/app.css generado"

  );

}

/*
 * Ejecuta el proceso de construcción del CSS
 * y captura cualquier error producido.
 */
buildCSS().catch(error => {

  /*
   * Muestra el error en la consola para
   * facilitar la identificación del problema.
   */
  console.error(

    "❌ Error generando CSS:",

    error

  );

  /*
   * Indica a Node.js que el proceso terminó
   * con un código de error.
   */
  process.exitCode = 1;

});