import { z } from 'zod';
import { forts, fortImages, artifacts, timelineEvents } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const fortWithImagesSchema = z.custom<typeof forts.$inferSelect>().and(
  z.object({
    images: z.array(z.custom<typeof fortImages.$inferSelect>())
  })
);

export const api = {
  forts: {
    list: {
      method: 'GET' as const,
      path: '/api/forts' as const,
      input: z.object({
        region: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof forts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/forts/:id' as const,
      responses: {
        200: fortWithImagesSchema,
        404: errorSchemas.notFound,
      },
    }
  },
  artifacts: {
    list: {
      method: 'GET' as const,
      path: '/api/artifacts' as const,
      responses: {
        200: z.array(z.custom<typeof artifacts.$inferSelect>()),
      },
    },
  },
  timeline: {
    list: {
      method: 'GET' as const,
      path: '/api/timeline' as const,
      responses: {
        200: z.array(z.custom<typeof timelineEvents.$inferSelect>()),
      },
    },
  },
  stories: {
    list: {
      method: 'GET' as const,
      path: '/api/stories' as const,
      responses: {
        200: z.array(z.custom<any>()), // BattleStory
      },
    },
  },
  quiz: {
    daily: {
      method: 'GET' as const,
      path: '/api/quiz/daily' as const,
      responses: {
        200: z.custom<any>(), // QuizQuestion
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type FortsListResponse = z.infer<typeof api.forts.list.responses[200]>;
export type FortDetailResponse = z.infer<typeof api.forts.get.responses[200]>;
export type ArtifactsListResponse = z.infer<typeof api.artifacts.list.responses[200]>;
export type TimelineListResponse = z.infer<typeof api.timeline.list.responses[200]>;
