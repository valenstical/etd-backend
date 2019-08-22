import express from 'express';
import { handleValidation } from '../middleware/validatorHelpers';
import UserController from '../controllers/userController';
import { validateLogin } from '../middleware/validateLogin';

const router = express.Router();

// Login user
router.post('/login', validateLogin, handleValidation, UserController.login);

export default router;
