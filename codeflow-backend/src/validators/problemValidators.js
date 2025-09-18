import { body } from 'express-validator';

const problemValidator = () => [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('difficulty')
    .isIn(['EASY', 'MEDIUM', 'HARD'])
    .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),

  body('tags')
    .isArray({ min: 1 })
    .withMessage('At least one tag is required')
    .custom((tags) => {
      if (!tags.every(tag => typeof tag === 'string' && tag.trim().length > 0)) {
        throw new Error('All tags must be non-empty strings');
      }
      return true;
    }),

  body('constraints')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Constraints are required'),

  body('hints')
    .optional()
    .trim(),

  body('editorial')
    .optional()
    .trim(),

  body('testcases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required')
    .custom((testcases) => {
      if (!testcases.every(tc => 
        tc.input !== undefined && tc.input !== null && typeof tc.input === 'string' &&
        tc.output !== undefined && tc.output !== null && typeof tc.output === 'string' && tc.output.trim().length > 0
      )) {
        throw new Error('Each test case must have valid input and non-empty output');
      }
      return true;
    }),

  // Examples validation (object is required, but individual languages are optional)
  body('examples')
    .isObject()
    .withMessage('Examples must be an object'),

  // Validate specific languages in examples
  body('examples.PYTHON.input')
    .optional()
    .if(body('examples.PYTHON').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('Python example input cannot be empty'),

  body('examples.PYTHON.output')
    .optional()
    .if(body('examples.PYTHON').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('Python example output cannot be empty'),

  body('examples.PYTHON.explanation')
    .optional()
    .trim(),

  body('examples.JAVA.input')
    .optional()
    .if(body('examples.JAVA').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('Java example input cannot be empty'),

  body('examples.JAVA.output')
    .optional()
    .if(body('examples.JAVA').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('Java example output cannot be empty'),

  body('examples.JAVA.explanation')
    .optional()
    .trim(),

  body('examples.C.input')
    .optional()
    .if(body('examples.C').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('C example input cannot be empty'),

  body('examples.C.output')
    .optional()
    .if(body('examples.C').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('C example output cannot be empty'),

  body('examples.C.explanation')
    .optional()
    .trim(),

  body('examples.CPP.input')
    .optional()
    .if(body('examples.CPP').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('C++ example input cannot be empty'),

  body('examples.CPP.output')
    .optional()
    .if(body('examples.CPP').exists())
    .trim()
    .isLength({ min: 1 })
    .withMessage('C++ example output cannot be empty'),

  body('examples.CPP.explanation')
    .optional()
    .trim(),

  // Code snippets validation for all supported languages
  body('codeSnippets.PYTHON')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Python code snippet is required'),

  body('codeSnippets.JAVA')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Java code snippet is required'),

  body('codeSnippets.C')
    .trim()
    .isLength({ min: 1 })
    .withMessage('C code snippet is required'),

  body('codeSnippets.CPP')
    .trim()
    .isLength({ min: 1 })
    .withMessage('C++ code snippet is required'),

  // User ID validation
  body('userId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('User ID is required'),
];

export { problemValidator };