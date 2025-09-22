import { db } from '../libs/db.js';
import { getLanguageName, pollBatchResults, submitBatch } from '../libs/sphere.js';
import { asyncHandler } from '../utils/async-handler.js';
import { Status } from '../generated/prisma/index.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { ErrorCodes } from '../utils/constants.js';

/**
 * SUBMIT CODE
 * Saves to DB + testcase results
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

  if (testcases.length === 0) {
    throw new ApiError(400, 'No testcases available for this problem', {
      code: ErrorCodes.NO_TESTCASES_AVAILABLE,
    });
  }

  // Prepare submissions
  const submissions = testcases.map(tc => ({
    source_code,
    language_id,
    stdin: tc.input ?? '',
  }));

  let results;
  try {
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map(r => r.token);
    results = await pollBatchResults(tokens);
  } catch (err) {
    console.error('🔥 Sphere Engine error (submitCode):', err);
    throw new ApiError(500, 'Sphere Engine execution failed');
  }

  // Map detailed results safely
  const detailedResults = results.map((result, i) => {
    const tc = testcases[i];
    const stdout = result.stdout ?? '';
    const expected_output = tc?.output ? String(tc.output).trim() : '';
    const passed = stdout === expected_output;

    return {
      id: `run-${problemId}-${i + 1}-${Date.now()}`,
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr ?? null,
      compile_output: result.compile_output ?? null,
      status: result.status?.description ?? 'Unknown',
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  const allPassed = detailedResults.every(r => r.passed);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        allPassed,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        testResults: detailedResults,
        totalTestCases: detailedResults.length,
        passedTestCases: detailedResults.filter(r => r.passed).length,
      },
      'Code Executed Successfully!'
    )
  );
});

/**
 * RUN CODE
 * Just executes public testcases (no DB save)
 */
export const runCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { publicTestcases: true },
  });
  if (!problem) {
    throw new ApiError(404, `Problem with ID ${problemId} not found`, {
      code: ErrorCodes.PROBLEM_NOT_FOUND,
    });
  }

  const testcases = problem.publicTestcases || [];
  if (testcases.length === 0) {
    throw new ApiError(400, 'No testcases available for this problem', {
      code: ErrorCodes.NO_TESTCASES_AVAILABLE,
    });
  }

  const submissions = testcases.map((tc) => ({
    source_code,
    language_id,
    stdin: tc.input ?? '',
  }));

  let results;
  try {
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    results = await pollBatchResults(tokens);
  } catch (err) {
    console.error('🔥 Sphere Engine error (runCode):', err);
    throw new ApiError(500, 'Sphere Engine execution failed');
  }

  let allPassed = true;
  const detailedResults = results.map((result, i) => {
    const stdout = result.output?.stdout ? result.output.stdout.trim() : '';
    const expected_output = testcases[i].output ? String(testcases[i].output).trim() : '';

    const passed = stdout === expected_output;
    if (!passed) allPassed = false;

    return {
      id: `run-${problemId}-${i + 1}-${Date.now()}`,
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.output?.stderr || null,
      compile_output: result.output?.compile_output || null,
      status: result.status?.description,
      memory: result.result?.memory ? `${result.result.memory} KB` : undefined,
      time: result.result?.time ? `${result.result.time} s` : undefined,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        allPassed,
        status: allPassed ? Status.ACCEPTED : Status.WRONG_ANSWER,
        testResults: detailedResults,
        totalTestCases: detailedResults.length,
        passedTestCases: detailedResults.filter((r) => r.passed).length,
      },
      'Code Executed Successfully!'
    )
  );
});