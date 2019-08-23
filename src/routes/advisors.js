import express from 'express';
import { handleValidation, validateRequired } from '../middleware/validatorHelpers';
import { validateToken } from '../middleware/authenticate';
import { validateAdmin } from '../middleware/validateAdmin';
import AdvisorController from '../controllers/advisorController';

const router = express.Router();

// Get all advisors
router.get('/', AdvisorController.getAllAdvisors);

// Add a new advisor
router.post(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  handleValidation,
  AdvisorController.addAdvisor,
);

export default router;
