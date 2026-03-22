#!/usr/bin/env bun
import { mkdir, writeFile, access } from "fs/promises";
import { join } from "path";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: bun scripts/new-post.ts <slug>");
  console.error("Example: bun scripts/new-post.ts my-trip-to-japan-2026");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    "Error: slug must be kebab-case (lowercase letters, numbers, and hyphens only)",
  );
  process.exit(1);
}

const root = join(import.meta.dirname, "..");
const postDir = join(root, "src/content/posts", slug);
const assetsDir = join(postDir, "assets");
const indexFile = join(postDir, "index.md");

// Guard against overwriting existing posts
try {
  await access(postDir);
  console.error(`Error: post "${slug}" already exists at ${postDir}`);
  process.exit(1);
} catch {
  // expected — directory does not exist yet
}

const today = new Date();
const dateStr = today.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const boilerplate = `---
title: 
excerpt: 
date: ${dateStr}
---

# 
`;

await mkdir(assetsDir, { recursive: true });
await writeFile(indexFile, boilerplate, "utf-8");

console.log(`✓ Created post: ${slug}`);
console.log(`  Content : src/content/posts/${slug}/index.md`);
console.log(`  Assets  : src/content/posts/${slug}/assets/`);
