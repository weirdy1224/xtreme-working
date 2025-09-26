import { db } from '../libs/db.js';
import { submitBatch, pollBatchResults } from '../libs/sphere.js';
import { asyncHandler } from '../utils/async-handler.js';
import { Status, Language } from '../generated/prisma/index.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { ErrorCodes } from '../utils/constants.js';
import fs from 'fs';

// Map compilerId → Prisma Language enum
function mapLanguage(language_id) {
  switch (language_id) {
    case 116: return Language.PYTHON;
    case 10: return Language.JAVA;
    case 1: return Language.C;
    case 41: return Language.CPP;
    default: return Language.PYTHON;
  }
}

/**
 * SUBMIT CODE
 * Saves submission + testcases
 */
export const submitCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;
  const userId = req.user?.id;

  if (!source_code || !language_id || !problemId) {
    throw new ApiError(400, 'Missing required fields', { code: ErrorCodes.INVALID_INPUT });
  }

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { publicTestcases: true, hiddenTestcases: true },
  });

  if (!problem) {
    throw new ApiError(404, `Problem with ID ${problemId} not found`, {
      code: ErrorCodes.PROBLEM_NOT_FOUND,
    });
  }

  const testcases = [...(problem.publicTestcases || []), ...(problem.hiddenTestcases || [])];
  if (!testcases.length) throw new ApiError(400, 'No testcases available', { code: ErrorCodes.NO_TESTCASES_AVAILABLE });

  const submissions = testcases.map(tc => ({ source_code, language_id, stdin: tc.input ?? '' }));

  let results;
  try {
    const submitResponse = await submitBatch(submissions);
    results = await pollBatchResults(submitResponse);
    fs.writeFileSync('sphere_results_submit.json', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('🔥 Sphere Engine error (submitCode):', err);
    throw new ApiError(500, 'Sphere Engine execution failed');
  }

  const detailedResults = results.map((result, i) => {
    const tc = testcases[i];
    const stdout = result.stdout?.trim() ?? '';
    const expected_output = tc.output ? String(tc.output).trim() : '';
    const passed = stdout === expected_output;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr ?? null,
      compileOutput: result.compile_output ?? null,
      status: result.status?.description ?? 'Unknown',
      memory: result.memory,
      time: result.time,
    };
  });

  const allPassed = detailedResults.every(r => r.passed);

  const submissionRecord = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: mapLanguage(language_id),
      status: allPassed ? Status.ACCEPTED : Status.WRONG_ANSWER,
      testCases: { create: detailedResults },
    },
    include: { testCases: true },
  });

  res.status(200).json(new ApiResponse(200, {
    allPassed,
    status: submissionRecord.status,
    submission: submissionRecord,
  }, 'Code Executed & Saved Successfully!'));
});

/**
 * RUN CODE
 * Executes public testcases only, no DB save
 */
export const runCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { publicTestcases: true },
  });

  if (!problem) throw new ApiError(404, `Problem with ID ${problemId} not found`, { code: ErrorCodes.PROBLEM_NOT_FOUND });

  const testcases = problem.publicTestcases || [];
  if (!testcases.length) throw new ApiError(400, 'No testcases available', { code: ErrorCodes.NO_TESTCASES_AVAILABLE });

  const submissions = testcases.map(tc => ({ source_code, language_id, stdin: tc.input ?? '' }));

  let results;
  try {
    const submitResponse = await submitBatch(submissions);
    results = await pollBatchResults(submitResponse);
    fs.writeFileSync('sphere_results_run.json', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('🔥 Sphere Engine error (runCode):', err);
    throw new ApiError(500, 'Sphere Engine execution failed');
  }

  let allPassed = true;
  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim() ?? '';
    const expected_output = testcases[i].output ? String(testcases[i].output).trim() : '';
    const passed = stdout === expected_output;
    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr ?? null,
      compileOutput: result.compile_output ?? null,
      status: result.status?.description ?? 'Unknown',
      memory: result.memory,
      time: result.time,
    };
  });

  res.status(200).json(new ApiResponse(200, {
    allPassed,
    status: allPassed ? Status.ACCEPTED : Status.WRONG_ANSWER,
    testResults: detailedResults,
    totalTestCases: detailedResults.length,
    passedTestCases: detailedResults.filter(r => r.passed).length,
  }, 'Code Executed Successfully!'));
});
