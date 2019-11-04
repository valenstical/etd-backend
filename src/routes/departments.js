import express from 'express';
import {
  handleValidation,
  validateRequired,
  validateNumber,
  validateOptionalUrl,
} from '../middleware/validatorHelpers';
import { validateToken } from '../middleware/authenticate';
import { validateAdmin } from '../middleware/validateAdmin';
import { CommonModelController } from '../controllers/commonModelController';
import { filterCommonQuery } from '../middleware/filters';

const router = express.Router();

// Get all faculties
router.get('/', filterCommonQuery, CommonModelController.getAll);

// Add a new degree
router.post(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  [validateOptionalUrl('image')],
  handleValidation,
  CommonModelController.create,
);

// Edit a degree
router.patch(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  [validateRequired('name')],
  [validateOptionalUrl('image')],
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
