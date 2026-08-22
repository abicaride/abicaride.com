import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'es']),
    routeSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    translationKey: z.string(),
    category: z.string(),
    year: z.number().int().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().positive(),
    draft: z.boolean().default(false),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    externalUrl: z.string().url().optional(),
    externalLabel: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects };
