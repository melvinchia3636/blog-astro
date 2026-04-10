#!/usr/bin/env bun
/**
 * Scans all post index.md files for WordPress image URLs of the form:
 *   https://blog.thecodeblog.net/wp-content/uploads/<year>/<month>/<filename>
 *
 * For each match:
 *  1. Copies the file from the local WP backup into the post's assets/ folder.
 *  2. Replaces the remote URL in the markdown with the relative path ./assets/<filename>.
 */

import { existsSync } from "fs";
import { copyFile, mkdir, readFile, writeFile, readdir } from "fs/promises";
import { join, basename } from "path";

const POSTS_DIR = join(import.meta.dir, "../src/content/posts");
const WP_BACKUP =
  "/Users/melvinchia/Documents/Backups/blog/wp_blog.thecodeblog.net_2024-08-15_12-33-57/wp-content/uploads";
const WP_URL_RE =
  /https:\/\/blog\.thecodeblog\.net\/wp-content\/uploads\/(\d{4})\/(\d{2})\/([^)"'\s]+)/g;

const postDirs = (await readdir(POSTS_DIR, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => join(POSTS_DIR, e.name));

let totalCopied = 0;
let totalSkipped = 0;
let totalMissing = 0;

for (const postDir of postDirs) {
  const mdPath = join(postDir, "index.md");
  if (!existsSync(mdPath)) continue;

  let content = await readFile(mdPath, "utf-8");
  const matches = [...content.matchAll(WP_URL_RE)];
  if (matches.length === 0) continue;

  const assetsDir = join(postDir, "assets");
  await mkdir(assetsDir, { recursive: true });

  let modified = content;
  let postCopied = 0;
  let postSkipped = 0;
  let postMissing = 0;

  for (const match of matches) {
    const [fullUrl, year, month, filename] = match;
    const srcPath = join(WP_BACKUP, year, month, filename);
    const destPath = join(assetsDir, filename);
    const localRef = `./assets/${filename}`;

    if (!existsSync(srcPath)) {
      console.warn(`  [MISSING] ${srcPath}`);
      postMissing++;
      continue;
    }

    if (!existsSync(destPath)) {
      await copyFile(srcPath, destPath);
      postCopied++;
    } else {
      postSkipped++;
    }

    // Replace all occurrences of this exact URL
    modified = modified.replaceAll(fullUrl, localRef);
  }

  if (modified !== content) {
    await writeFile(mdPath, modified, "utf-8");
  }

  const postName = postDir.split("/").at(-1);
  console.log(
    `[${postName}] copied=${postCopied} already-existed=${postSkipped} missing=${postMissing}`,
  );

  totalCopied += postCopied;
  totalSkipped += postSkipped;
  totalMissing += postMissing;
}

console.log(
  `\nDone. copied=${totalCopied} already-existed=${totalSkipped} missing=${totalMissing}`,
);
