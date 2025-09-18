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
    testcases,
    codeSnippets,
    userId,
  } = req.body;
  console.log('Received data:', req.body);
  // Optional: Enforce admin access if required
  // if (!req.user || req.user.role !== 'ADMIN') {
  //   throw new ApiError(403, 'Admin access only', {
  //     code: ErrorCodes.UNAUTHORIZED_ACCESS,
  //   });
  // }

  // Validate required fields
  if (!title || !description || !difficulty || !userId || !testcases || !codeSnippets) {
    throw new ApiError(400, 'Missing required fields');
  }

  // Validate supported languages
  const supportedLanguages = ['PYTHON', 'JAVA', 'C', 'CPP'];
  const providedLanguages = Object.keys(codeSnippets);
  const invalidLanguages = providedLanguages.filter(lang => !supportedLanguages.includes(lang.toUpperCase()));
  if (invalidLanguages.length > 0) {
    throw new ApiError(400, `Unsupported languages: ${invalidLanguages.join(', ')}`);
  }

  // Optional validation of codeSnippets against testcases
//   for (const language of supportedLanguages) {
//     if (codeSnippets[language]) {
//       const languageId = getJudge0LanguageId(language);
//       if (!languageId) {
//         throw new ApiError(400, `Language ${language} is not supported`, {
//           code: ErrorCodes.PROBLEM_UNSUPPORTED_LANGUAGE,
//         });
//       }

//       const submissions = testcases.map(({ input, output }) => ({
//         source_code: codeSnippets[language],
//         language_id: languageId,
//         stdin: input,
//         expected_output: output,
//       }));

//       if (!submissions.length) {
//         throw new ApiError(
//           400,
//           `No valid testcases found for ${language}`,
//           { code: ErrorCodes.PROBLEM_SUBMISSION_ERROR }
//         );
//       }

//       console.log(`Language: ${language}, languageId: ${languageId}`);
//       console.log('Submissions:', submissions);

//       const submissionResults = await submitBatch(submissions);

//       console.log(submissionResults);

//       if (!submissionResults || !Array.isArray(submissionResults)) {
//         throw new ApiError(
//           500,
//           `Failed to submit testcases for ${language}`,
//           { code: ErrorCodes.JUDGE0_SUBMISSION_FAILED }
//         );
//       }

//       const tokens = submissionResults.map((res) => res.token);
//       const results = await pollBatchResults(tokens);

//       for (let i = 0; i < results.length; i++) {
//         const result = results[i];
//         if (result.status.id !== 3) { // 3 = Accepted
//           throw new ApiError(
//             400,
//             `Testcase ${i + 1} failed for language ${language}`,
//             { code: ErrorCodes.PROBLEM_TESTCASE_FAILED }
//           );
//         }
//       }
//     }
//   }

  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples: JSON.stringify(examples),
      constraints,
      testcases: JSON.stringify(testcases),
      codeSnippets: JSON.stringify(codeSnippets),
      userId: userId || req.user.id, // Use provided userId or authenticated user
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
    testcases,
    codeSnippets,
  } = req.body;

  // Optional: Enforce admin access if required
  // if (!req.user || req.user.role !== 'ADMIN') {
  //   throw new ApiError(403, 'Admin access only', {
  //     code: ErrorCodes.UNAUTHORIZED_ACCESS,
  //   });
  // }

  // Validate required fields
  if (!title || !description || !difficulty || !testcases || !codeSnippets) {
    throw new ApiError(400, 'Missing required fields');
  }

  // Validate supported languages
  const supportedLanguages = ['PYTHON', 'JAVA', 'C', 'CPP'];
  const providedLanguages = Object.keys(codeSnippets);
  const invalidLanguages = providedLanguages.filter(lang => !supportedLanguages.includes(lang.toUpperCase()));
  if (invalidLanguages.length > 0) {
    throw new ApiError(400, `Unsupported languages: ${invalidLanguages.join(', ')}`);
  }

  // Optional validation of codeSnippets against testcases
//   for (const language of supportedLanguages) {
//     if (codeSnippets[language]) {
//       const languageId = getJudge0LanguageId(language);
//       if (!languageId) {
//         throw new ApiError(400, `Language ${language} is not supported`, {
//           code: ErrorCodes.PROBLEM_UNSUPPORTED_LANGUAGE,
//         });
//       }

//       const submissions = testcases.map(({ input, output }) => ({
//         source_code: codeSnippets[language],
//         language_id: languageId,
//         stdin: input,
//         expected_output: output,
//       }));

//       if (!submissions.length) {
//         throw new ApiError(
//           400,
//           `No valid testcases found for ${language}`,
//           { code: ErrorCodes.PROBLEM_SUBMISSION_ERROR }
//         );
//       }

//       console.log(`Language: ${language}, languageId: ${languageId}`);
//       console.log('Submissions:', submissions);

//       const submissionResults = await submitBatch(submissions);

//       console.log(submissionResults);

//       if (!submissionResults || !Array.isArray(submissionResults)) {
//         throw new ApiError(
//           500,
//           `Failed to submit testcases for ${language}`,
//           { code: ErrorCodes.JUDGE0_SUBMISSION_FAILED }
//         );
//       }

//       const tokens = submissionResults.map((res) => res.token);
//       const results = await pollBatchResults(tokens);

//       for (let i = 0; i < results.length; i++) {
//         const result = results[i];
//         if (result.status.id !== 3) { // 3 = Accepted
//           throw new ApiError(
//             400,
//             `Testcase ${i + 1} failed for language ${language}`,
//             { code: ErrorCodes.PROBLEM_TESTCASE_FAILED }
//           );
//         }
//       }
//     }
//   }

  const updatedProblem = await db.problem.update({
    where: { id },
    data: {
      title,
      description,
      difficulty,
      tags,
      examples: JSON.stringify(examples),
      constraints,
      testcases: JSON.stringify(testcases),
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