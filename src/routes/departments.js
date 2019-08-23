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

const router = express.Router();

const setModel = (request, response, next) => {
  response.locals.model = 'Department';
  next();
};

// Get all faculties
router.get('/', setModel, CommonModelController.getAll);

// Add a new degree
router.post(
  '/',
  validateToken,
  validateAdmin,
  [validateRequired('name')],
  [validateNumber('facultyId', 'Faculty ID must be 7 digit number')],
  [validateOptionalUrl('image')],
  handleValidation,
  setModel,
  CommonModelController.create,
);

// Edit a degree
router.patch(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  [validateRequired('name')],
  [validateNumber('facultyId', 'Faculty ID is must be 7 digit number')],
  [validateOptionalUrl('image')],
  handleValidation,
  setModel,
  CommonModelController.update,
);

// Delete a degree
router.delete(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  handleValidation,
  setModel,
  CommonModelController.delete,
);

export default router;
