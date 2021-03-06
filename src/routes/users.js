import express from 'express';
import { handleValidation } from '../middleware/validatorHelpers';
import UserController from '../controllers/userController';
import { validateLogin } from '../middleware/validateLogin';
import {
  validateRegisterUser,
  validateUpdateUser,
  validateDeactiveUser,
} from '../middleware/validateRegistration';
import { validateToken } from '../middleware/authenticate';
import { validateAdmin } from '../middleware/validateAdmin';

const router = express.Router();

// Login user
router.post('/login', validateLogin, handleValidation, UserController.login);

// Add a new user
router.post(
  '/',
  validateToken,
  validateAdmin,
  validateRegisterUser,
  handleValidation,
  UserController.registerUser,
);

// Edit an existing user
router.patch(
  '/',
  validateToken,
  validateAdmin,
  validateUpdateUser,
  handleValidation,
  UserController.updateUser,
);

// Deactivate an existing user
router.delete(
  '/',
  validateToken,
  validateAdmin,
  validateDeactiveUser,
  handleValidation,
  UserController.deactivateUser,
);

export default router;
