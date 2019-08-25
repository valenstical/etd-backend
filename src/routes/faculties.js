import express from 'express';
import {
  handleValidation,
  validateRequired,
  validateNumber,
  validateOptionalNumber,
} from '../middleware/validatorHelpers';
import { validateToken } from '../middleware/authenticate';
import { validateAdmin } from '../middleware/validateAdmin';
import { CommonModelController } from '../controllers/commonModelController';

const router = express.Router();

// Get all faculties
router.get(
  '/',
  validateOptionalNumber('collegeId'),
  handleValidation,
  CommonModelController.getAll,
);

// Add a new degree
router.post(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  handleValidation,
  CommonModelController.create,
);

// Edit a degree
router.patch(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  [validateNumber('id')],
  handleValidation,
  CommonModelController.update,
);

// Delete a degree
router.delete(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  handleValidation,
  CommonModelController.delete,
);

export default router;
