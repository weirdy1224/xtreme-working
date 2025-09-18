import { z } from 'zod';

export const SignUpSchema = z.object({
  fullname: z
    .string()
    .regex(/^[A-Za-z\s]+$/, 'Invalid Fullname format.')
    .min(3, 'Fullname must be atleast 3 characters'),
  email: z.email('Enter a valid email'),
  username: z
    .string()
    .min(3, 'Username should be at least 3 characters')
    .max(13, 'username cannot exceed 13 characters'),
  password: z.string().min(6, 'Password must be atleast of 6 character'),
});
