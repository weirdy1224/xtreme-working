import { z } from 'zod';

export const EditProfileSchema = z.object({
  fullname: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 3 && /^[A-Za-z\s]+$/.test(val)),
      'Fullname must be at least 3 characters and contain only letters and spaces'
    ),
  username: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 3 && val.length <= 13),
      'Username should be between 3-13 characters'
    ),
});
