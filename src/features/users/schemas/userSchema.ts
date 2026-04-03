import { z } from 'zod';
import { Role } from '@prisma/client';

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z
    .object({
      role: z
        .nativeEnum(Role, {
          error: 'Role must be VIEWER, ANALYST, or ADMIN',
        })
        .optional(),
      isActive: z
        .boolean({
          error: 'isActive must be a boolean',
        })
        .optional(),
    })
    .strict(),
});
