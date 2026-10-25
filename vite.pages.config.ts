import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const base = process.env.PAGES_BASE_PATH || "/S.T.codex/";

export default defineConfig({
  root: "pages",
  base,
  publicDir: resolve("public"),
  plugins: [
    {
      name: "pages-public-paths",
      enforce: "pre",
      transform(source, id) {
        // Existing root-relative app links and public assets also need the repo prefix.
        // This affects only the Pages build, preserving localhost routes and content.
        if (!id.includes("/app/") || !/\.[jt]sx?(?:\?|$)/.test(id)) return;
        return source.replace(/(["'`])\/(?!\/)/g, `$1${base}`);
      },
    },
    react(),
  ],
  build: { outDir: resolve("dist-pages"), emptyOutDir: true },
});
