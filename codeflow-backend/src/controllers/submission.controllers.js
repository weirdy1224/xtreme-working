import { db } from '../libs/db.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

const getAllSubmissions = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
        where: { userId },
    });

    const response = new ApiResponse(
        200,
        submissions,
        'Submissions fetched successfully'
    );

    return res.status(response.statusCode).json(response);
});

const getSubmissionsForProblem = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const submissions = await db.submission.findMany({
        where: {
            userId: userId,
            problemId: problemId,
        },
    });

    const response = new ApiResponse(
        200,
        submissions,
        'Submissions fetched successfully'
    );

    return res.status(response.statusCode).json(response);
});

const getAllSubmissionsForProblem = asyncHandler(async (req, res) => {
    const problemId = req.params.problemId;
    const submissions = await db.submission.count({
        where: {
            problemId: problemId,
        },
    });

    const response = new ApiResponse(
        200,
        {
            count: submissions
        },
        'Submissions\' count fetched successfully'
    );

    return res.status(response.statusCode).json(response);
});

export {
    getAllSubmissions,
    getSubmissionsForProblem,
    getAllSubmissionsForProblem,
};
