import {
  readFile,
  writeFile
} from "node:fs/promises";

import {
  resolve
} from "node:path";

const root =
  process.cwd();

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
  
  "components/Contact/contact.css",
  "components/footer/footer.css",

  "styles/sweetalert2.min.css"
];

async function buildCSS() {
  const parts = [];

  for (const file of cssFiles) {
    const absolutePath =
      resolve(root, file);

    const content =
      await readFile(
        absolutePath,
        "utf8"
      );

    parts.push(
      `/* ===== ${file} ===== */\n${content.trim()}`
    );
  }

  const output =
    parts.join("\n\n");

  await writeFile(
    resolve(
      root,
      "styles/app.css"
    ),
    output,
    "utf8"
  );

  console.log(
    "✅ styles/app.css generado"
  );
}

buildCSS().catch(error => {
  console.error(
    "❌ Error generando CSS:",
    error
  );

  process.exitCode = 1;
});