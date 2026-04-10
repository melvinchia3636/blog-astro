// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import { remarkAlerts } from "./src/plugins/remark-alerts.ts";
import { remarkPdf } from "./src/plugins/remark-pdf.ts";
import { remarkFigure } from "./src/plugins/remark-figure.ts";
import { remarkGallery } from "./src/plugins/remark-gallery.ts";
import { createReadStream, existsSync, statSync } from "fs";
import { readdir, copyFile, mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { join } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @param {string} src @param {string} dest */
async function copyNonMdFiles(src, dest) {
  const entries = await readdir(src, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyNonMdFiles(srcPath, destPath);
    } else if (!entry.name.endsWith(".md")) {
      await mkdir(dest, { recursive: true });
      await copyFile(srcPath, destPath);
    }
  }
}

/** Serves src/content/posts/** at /posts/** in dev and copies them after build */
function contentAssetsIntegration() {
  return {
    name: "content-assets",
    hooks: {
      /** @param {{ server: import('vite').ViteDevServer }} opts */
      "astro:server:setup": ({ server }) => {
        const postsDir = join(__dirname, "src/content/posts");
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith("/posts/")) return next();
          const rel = decodeURIComponent(
            req.url.slice("/posts/".length).split("?")[0],
          );
          // Prevent path traversal
          if (rel.includes("..")) return next();
          const filePath = join(postsDir, rel);
          if (
            !filePath.endsWith(".md") &&
            existsSync(filePath) &&
            statSync(filePath).isFile()
          ) {
            createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
      /** @param {{ dir: URL }} opts */
      "astro:build:done": async ({ dir }) => {
        const srcDir = join(__dirname, "src/content/posts");
        const destDir = join(fileURLToPath(dir), "posts");
        await copyNonMdFiles(srcDir, destDir);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), react(), contentAssetsIntegration()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkAlerts, remarkPdf, remarkFigure, remarkGallery],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: false,
    },
  },
});
