// schemas/problemSchema.js
import { z } from 'zod';

export const problemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  constraints: z.string().min(1, 'Constraints are required'),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .min(1, 'At least one test case is required'),
  examples: z.object({
    PYTHON: z
      .object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().optional(),
      })
      .optional(),
    JAVA: z
      .object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().optional(),
      })
      .optional(),
    C: z
      .object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().optional(),
      })
      .optional(),
    CPP: z
      .object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().optional(),
      })
      .optional(),
  }),
  codeSnippets: z.object({
    PYTHON: z.string().min(1, 'Python code snippet is required'),
    JAVA: z.string().min(1, 'Java code snippet is required'),
    C: z.string().min(1, 'C code snippet is required'),
    CPP: z.string().min(1, 'C++ code snippet is required'),
  }),
  userId: z.string().min(1, 'User ID is required'), // Added for Prisma
});