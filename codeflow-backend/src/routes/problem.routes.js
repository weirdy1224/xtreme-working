import { Router } from 'express';
import { isAdmin, isLoggedIn } from '../middlewares/auth.middlewares.js';
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from '../controllers/problem.controllers.js';
import { problemValidator } from '../validators/problemValidators.js';
import { validate } from '../middlewares/validator.middlewares.js';

const router = Router();

router.route('/createProblem').post(isLoggedIn, isAdmin, problemValidator(), validate, createProblem);

router.route('/getAllProblems').get(isLoggedIn, getAllProblems);

router.route('/getProblem/:id').get(isLoggedIn, getProblemById);

router.route('/updateProblem/:id').put(isLoggedIn, isAdmin, problemValidator(), validate, updateProblem);

router.route('/deleteProblem/:id').delete(isLoggedIn, isAdmin, deleteProblem);

router.route('/getSolvedProblems').get(isLoggedIn, getAllProblemsSolvedByUser);

export default router;
