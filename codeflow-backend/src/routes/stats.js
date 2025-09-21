import express from "express";
import { db } from "../libs/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

const router = express.Router();

const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await db.user.count();
  const totalProblems = await db.problem.count();

  return res.json(
    new ApiResponse(200, { totalUsers, totalProblems }, "Stats fetched successfully")
  );
});

router.get("/stats", getStats);

export default router;
