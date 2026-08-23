import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectMetric = z.object({
  value: z.string(),
  label: z.string(),
  detail: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => {
    const projectImage = z.object({
      src: image(),
      alt: z.string(),
    });

    return z.object({
      title: z.string(),
      description: z.string(),
      locale: z.enum(['en', 'es']),
      routeSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      translationKey: z.string(),
      category: z.string(),
      year: z.number().int().optional(),
      company: z.string().optional(),
      client: z.string().optional(),
      role: z.string().optional(),
      period: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().positive(),
      draft: z.boolean().default(false),
      image: projectImage,
      metrics: z.array(projectMetric).optional(),
      gallery: z.array(projectImage.extend({
        caption: z.string().optional(),
      })).optional(),
      externalUrl: z.string().url().optional(),
      externalLabel: z.string().optional(),
      tags: z.array(z.string()).default([]),
    });
  },
});

export const collections = { projects };
