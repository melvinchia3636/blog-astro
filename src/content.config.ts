import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    canonical: z.string().url().optional(),
    draft: z.boolean().optional(),
    publishedTime: z.string().optional(),
  }),
});

export const collections = { posts };
