import express from 'express';
import { Validator, handleValidation } from '../middleware/validator';
import MemberController from '../controllers/memberController';

const router = express.Router();

// Login member
router.post('/login', Validator.validateLogin, handleValidation, MemberController.login);

// Register a new member
router.post('/', Validator.validateRegistration, handleValidation, MemberController.registerMember);

// Update member details
router.patch(
  '/',
  Validator.validateToken,
  Validator.validateMemberDetails,
  handleValidation,
  MemberController.updateMember,
);

// Update member profile image
router.patch(
  '/image',
  Validator.validateToken,
  Validator.validateImage,
  handleValidation,
  MemberController.updateProfileImage,
);

// Request new password
router.post(
  '/forgot_password',
  Validator.validateEmail,
  handleValidation,
  MemberController.forgotPassword,
);

// Reset password
router.patch(
  '/reset_password',
  Validator.validateToken,
  Validator.validateResetPassword,
  handleValidation,
  MemberController.resetPassword,
);

export default router;
