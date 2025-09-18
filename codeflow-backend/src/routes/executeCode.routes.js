import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { runCode, submitCode } from '../controllers/executeCode.controllers.js';
import { testCasesValidator } from '../validators/executeCodeValidators.js';

const router = Router();


router.route('/submit').post(isLoggedIn, testCasesValidator(), submitCode);
router.route('/run').post(isLoggedIn, testCasesValidator(), runCode);


export default router;