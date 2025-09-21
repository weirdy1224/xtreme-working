import express from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { db } from '../libs/db.js';

const router = express.Router();

// Point system
const POINTS = {
  EASY: 50,
  MEDIUM: 150,
  HARD: 300,
};

const getLeaderboard = asyncHandler(async (req, res) => {
  // Fetch all users with their solved problems & difficulties
  const users = await db.user.findMany({
    select: {
      username: true,
      problemSolved: {
        select: {
          problem: {
            select: { difficulty: true },
          },
        },
      },
      createdAt: true,
    },
  });

  // Compute points dynamically
  const leaderboard = users.map((u) => {
    const points = u.problemSolved.reduce((sum, ps) => {
      return sum + (POINTS[ps.problem.difficulty] || 0);
    }, 0);

    return {
      username: u.username,
      points,
      createdAt: u.createdAt,
    };
  });

  // Sort by points (desc), then by join date (asc)
  leaderboard.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Add ranks
  const ranked = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  return res.json(
    new ApiResponse(200, ranked, 'Leaderboard fetched successfully')
  );
});

router.get('/leaderboard', getLeaderboard);

export default router;
