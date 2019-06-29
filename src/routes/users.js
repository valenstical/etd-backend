import express from 'express';
import { Validator, handleValidation } from '../middleware/validator';
import UserController from '../controllers/userController';

const router = express.Router();

// Login user
router.post('/login', Validator.validateLogin, handleValidation, UserController.login);

// // Register a new user
// router.post('/', Validator.validateRegistration, handleValidation, UserController.registerUser);

// // Update user details
// router.patch(
//   '/',
//   Validator.validateToken,
//   Validator.validateUserDetails,
//   handleValidation,
//   UserController.updateUser,
// );

// // Reset password
// router.patch(
//   '/reset_password',
//   Validator.validateToken,
//   Validator.validateResetPassword,
//   handleValidation,
//   UserController.resetPassword,
// );

export default router;
