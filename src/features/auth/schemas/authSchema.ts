import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z
      .nativeEnum(Role, {
        error: 'Role must be VIEWER, ANALYST, or ADMIN',
      })
      .optional(),
  }),
});
