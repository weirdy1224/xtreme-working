
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/auth.routes.js';
import problemRouter from './routes/problem.routes.js';
import executionRouter from './routes/executeCode.routes.js';
import submissionRouter from './routes/submission.routes.js';
import leaderboardRouter from './routes/leaderboard.js';
import statsRouter from './routes/stats.js';


app.use('/api/v1/healthCheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/executeCode', executionRouter);
app.use('/api/v1/submission', submissionRouter);
app.use('/api/v1', leaderboardRouter);
app.use('/api/v1', statsRouter);

app.use(errorHandler);

export default app;
