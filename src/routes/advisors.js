import express from 'express';
import { handleValidation, validateRequired, validateNumber } from '../middleware/validatorHelpers';
import { validateToken } from '../middleware/authenticate';
import { validateAdmin } from '../middleware/validateAdmin';
import { CommonModelController } from '../controllers/commonModelController';
import { filterCommonQuery } from '../middleware/filters';

const router = express.Router();

// Get all advisors
router.get('/', filterCommonQuery, CommonModelController.getAll);

// Add a new advisor
router.post(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  handleValidation,
  CommonModelController.create,
);

// Edit a advisor
router.patch(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  [validateNumber('id')],
  handleValidation,
  CommonModelController.update,
);

// Delete a advisor
router.delete(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  handleValidation,
  CommonModelController.delete,
);

export default router;
