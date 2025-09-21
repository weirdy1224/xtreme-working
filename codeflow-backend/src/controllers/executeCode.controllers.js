// Updated submitCode and runCode
import { db } from '../libs/db.js';
import { getLanguageName, pollBatchResults, submitBatch } from '../libs/judge0.js';
import { asyncHandler } from '../utils/async-handler.js';
import { Status } from '../generated/prisma/index.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { ErrorCodes } from '../utils/constants.js';

/**
 * SUBMIT CODE
 * - Runs against ALL testcases (public + hidden)
 * - Saves submission + testcase results to DB
 * - Marks problem solved if all pass
 */
const submitCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;
  const userId = req.user.id;

  // 1. Validate problem + fetch testcases
  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { publicTestcases: true, hiddenTestcases: true },
  });

  if (!problem) {
    throw new ApiError(404, `Problem with ID ${problemId} not found`, {
      code: ErrorCodes.PROBLEM_NOT_FOUND,
    });
  }

  // Combine public + hidden testcases
  const testcases = [
    ...(problem.publicTestcases || []),
    ...(problem.hiddenTestcases || []),
  ];

  if (testcases.length === 0) {
    throw new ApiError(400, 'No testcases available for this problem', {
      code: ErrorCodes.NO_TESTCASES_AVAILABLE,
    });
  }

  // 2. Prepare submissions for Judge0
  const submissions = testcases.map((tc) => ({
    source_code,
    language_id,
    stdin: tc.input ?? '',
  }));

  // 3. Submit to Judge0
  let results;
  try {
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    results = await pollBatchResults(tokens);
  } catch (err) {
    console.error('🔥 Judge0 error (submitCode):', err);
    throw new ApiError(500, 'Judge0 execution failed');
  }

  // 4. Analyze results
  let allPassed = true;
  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout ? result.stdout.trim() : '';
    const expected_output = testcases[i].output ? String(testcases[i].output).trim() : '';

    const passed = stdout === expected_output;
    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  // 5. Save submission summary
  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: testcases.map((tc) => tc.input).join('\n'),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? Status.ACCEPTED : Status.WRONG_ANSWER,
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    },
  });

  // 6. Mark problem solved if all passed
  if (allPassed) {
    await db.problemSolved.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: {},
      create: { userId, problemId },
    });
  }

  // 7. Save individual testcase results
  const testCaseResults = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({ data: testCaseResults });

  // 8. Return submission + testcases
  const submissionWithTestCase = await db.submission.findUnique({
    where: { id: submission.id },
    include: { testCases: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submissionWithTestCase, 'Code Submitted Successfully!'));
});

/**
 * RUN CODE
 * - Quick run for ALL testcases (public only)
 * - Does not save to DB
 */
const runCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;

  // 1. Validate problem + fetch testcases
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

  // 2. Prepare submissions
  const submissions = testcases.map((tc) => ({
    source_code,
    language_id,
    stdin: tc.input ?? '',
  }));

  // 3. Submit to Judge0
  let results;
  try {
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    results = await pollBatchResults(tokens);
  } catch (err) {
    console.error('🔥 Judge0 error (runCode):', err);
    throw new ApiError(500, 'Judge0 execution failed');
  }

  // 4. Analyze results
  let allPassed = true;
  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout ? result.stdout.trim() : '';
    const expected_output = testcases[i].output ? String(testcases[i].output).trim() : '';

    const passed = stdout === expected_output;
    if (!passed) allPassed = false;

    return {
      id: `run-${problemId}-${i + 1}-${Date.now()}`,
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
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

export { submitCode, runCode };
