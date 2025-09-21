import { z } from 'zod';

export const problemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  constraints: z.string().min(1, 'Constraints are required'),
  editorial: z.string().optional(),
  publicTestcases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .length(3, 'Exactly 3 public test cases are required'),
  hiddenTestcases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .optional(),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().optional(),
      })
    )
    .min(2, 'At least 2 examples are required')
    .max(3, 'No more than 3 examples are allowed'),
  codeSnippets: z.object({
    PYTHON: z.string().min(1, 'Python code snippet is required'),
    JAVA: z.string().min(1, 'Java code snippet is required'),
    C: z.string().min(1, 'C code snippet is required'),
    CPP: z.string().min(1, 'C++ code snippet is required'),
  }),
  userId: z.string().min(1, 'User ID is required'),
});