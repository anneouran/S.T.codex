import { build } from "vite";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
await build({ configFile: "vite.pages.config.ts" });
for (const route of ["title", "ep0", "ep1", "ep2", "ep3", "ep4", "ep5"]) {
  await mkdir(`dist-pages/${route}`, { recursive: true });
  await copyFile("dist-pages/index.html", `dist-pages/${route}/index.html`);
}
await writeFile("dist-pages/.nojekyll", "");
