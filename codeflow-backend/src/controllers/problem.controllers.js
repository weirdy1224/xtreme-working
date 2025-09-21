import { db } from '../libs/db.js';
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from '../libs/judge0.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ErrorCodes } from '../utils/constants.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    editorial,
    publicTestcases,
    hiddenTestcases,
    codeSnippets,
    userId,
  } = req.body;

  console.log('Received data:', req.body);

  // Basic required fields
  if (!title || !description || !difficulty || !userId || !publicTestcases || !codeSnippets || !examples) {
    throw new ApiError(400, 'Missing required fields');
  }

  // Validate supported languages in codeSnippets
  const supportedLanguages = ['PYTHON', 'JAVA', 'C', 'CPP'];
  const providedLanguages = Object.keys(codeSnippets || {});
  const invalidLanguages = providedLanguages.filter(lang => !supportedLanguages.includes(lang.toUpperCase()));
  if (invalidLanguages.length > 0) {
    throw new ApiError(400, `Unsupported languages: ${invalidLanguages.join(', ')}`);
  }

  // Validate examples server-side (2-3)
  if (!Array.isArray(examples) || examples.length < 2 || examples.length > 3) {
    throw new ApiError(400, 'Provide between 2 and 3 examples in total', { code: ErrorCodes.INVALID_PAYLOAD });
  }
  for (const ex of examples) {
    if (typeof ex.input !== 'string' || typeof ex.output !== 'string' || ex.output.trim().length === 0) {
      throw new ApiError(400, 'Each example must have string input and non-empty output', { code: ErrorCodes.INVALID_PAYLOAD });
    }
  }

  // publicTestcases must be exactly 3
  if (!Array.isArray(publicTestcases) || publicTestcases.length !== 3) {
    throw new ApiError(400, 'Exactly 3 public testcases are required', { code: ErrorCodes.INVALID_PAYLOAD });
  }
  for (const tc of publicTestcases) {
    if (typeof tc.input !== 'string' || typeof tc.output !== 'string' || tc.output.trim().length === 0) {
      throw new ApiError(400, 'Each public testcase must have string input and non-empty output', { code: ErrorCodes.INVALID_PAYLOAD });
    }
  }

  // hiddenTestcases optional validation
  if (hiddenTestcases) {
    if (!Array.isArray(hiddenTestcases)) {
      throw new ApiError(400, 'hiddenTestcases must be an array', { code: ErrorCodes.INVALID_PAYLOAD });
    }
    for (const tc of hiddenTestcases) {
      if (typeof tc.input !== 'string' || typeof tc.output !== 'string' || tc.output.trim().length === 0) {
        throw new ApiError(400, 'Each hidden testcase must have string input and non-empty output', { code: ErrorCodes.INVALID_PAYLOAD });
      }
    }
  }

const newProblem = await db.problem.create({
  data: {
    title,
    description,
    difficulty,
    tags,
    examples, // store as array, not string
    constraints,
    editorial: editorial || null,
    publicTestcases, // store as array
    hiddenTestcases: hiddenTestcases || null,
    codeSnippets, // store as object
    userId: userId || req.user.id,
  },
});


  const response = new ApiResponse(
    201,
    newProblem,
    'Problem created and validated successfully'
  );

  return res.status(response.statusCode).json(response);
});

const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany({
    include: {
      solvedBy: {
        where: {
          userId: req.user.id,
        },
      },
    },
  });

  if (!problems) {
    throw new ApiError(404, 'Problems not found', {
      code: ErrorCodes.PROBLEM_NOT_FOUND,
    });
  }

  const response = new ApiResponse(
    200,
    problems,
    'Problems fetched successfully'
  );

  return res.status(response.statusCode).json(response);
});

const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: { id },
  });

  if (!problem) {
    throw new ApiError(404, 'Problems not found', {
      code: ErrorCodes.PROBLEM_NOT_FOUND,
    });
  }

  const response = new ApiResponse(
    200,
    problem,
    'Problem fetched successfully'
  );

  return res.status(response.statusCode).json(response);
});

const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    editorial,
    publicTestcases,
    hiddenTestcases,
    codeSnippets,
  } = req.body;

  if (!title || !description || !difficulty || !publicTestcases || !codeSnippets) {
    throw new ApiError(400, 'Missing required fields');
  }

  const supportedLanguages = ['PYTHON', 'JAVA', 'C', 'CPP'];
  const providedLanguages = Object.keys(codeSnippets || {});
  const invalidLanguages = providedLanguages.filter(lang => !supportedLanguages.includes(lang.toUpperCase()));
  if (invalidLanguages.length > 0) {
    throw new ApiError(400, `Unsupported languages: ${invalidLanguages.join(', ')}`);
  }

  // Server side examples validation
  if (!Array.isArray(examples) || examples.length < 2 || examples.length > 3) {
    throw new ApiError(400, 'Provide between 2 and 3 examples in total', { code: ErrorCodes.INVALID_PAYLOAD });
  }

  // publicTestcases must be exactly 3
  if (!Array.isArray(publicTestcases) || publicTestcases.length !== 3) {
    throw new ApiError(400, 'Exactly 3 public testcases are required', { code: ErrorCodes.INVALID_PAYLOAD });
  }

  const updatedProblem = await db.problem.update({
    where: { id },
    data: {
      title,
      description,
      difficulty,
      tags,
      examples: JSON.stringify(examples),
      constraints,
      editorial: editorial || null,
      public: JSON.stringify(publicTestcases),
      hiddenTestcases: hiddenTestcases ? JSON.stringify(hiddenTestcases) : null,
      codeSnippets: JSON.stringify(codeSnippets),
    },
  });

  const response = new ApiResponse(
    201,
    updatedProblem,
    'Problem updated and validated successfully'
  );

  return res.status(response.statusCode).json(response);
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({ where: { id } });

  if (!problem) {
    throw new ApiError(404, 'Problems not found', {
      code: ErrorCodes.PROBLEM_NOT_FOUND,
    });
  }

  await db.problem.delete({ where: { id } });

  const response = new ApiResponse(200, null, 'Problem deleted successfully');

  res.status(response.statusCode).json(response);
});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany({
    where: {
      solvedBy: {
        some: {
          userId: req.user.id,
        },
      },
    },
    include: {
      solvedBy: {
        where: {
          userId: req.user.id,
        },
      },
    },
  });

  const response = new ApiResponse(200, problems, 'Problems fetched successfully');

  return res.status(response.statusCode).json(response);
});

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
};
