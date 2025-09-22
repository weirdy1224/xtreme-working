import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { runCode, submitCode } from '../controllers/executeCode.controllers.js';

const router = Router();

router.route('/submit').post(isLoggedIn, submitCode); // Removed testCasesValidator() as it's unused
router.route('/run').post(isLoggedIn, runCode); // Removed testCasesValidator() as it's unused

export default router;