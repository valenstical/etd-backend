import express from 'express';
import { handleValidation, validateNumber } from '../middleware/validatorHelpers';
import { validateToken } from '../middleware/authenticate';
import { validateAdmin } from '../middleware/validateAdmin';
import { CommonModelController } from '../controllers/commonModelController';
import {
  validateCreateDocument,
  validateRelationships,
  validateTagsAndAdvisors,
} from '../middleware/validateDocument';
import { filterDocumentQuery } from '../middleware/filters';

const router = express.Router();

// Get all documents
router.get('/', filterDocumentQuery, CommonModelController.getAll);

// Add a new document
router.post(
  '/',
  validateToken,
  validateAdmin,
  validateCreateDocument,
  handleValidation,
  validateRelationships,
  validateTagsAndAdvisors,
  CommonModelController.create,
);

// Edit a document
router.patch(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  validateCreateDocument,
  handleValidation,
  validateRelationships,
  validateTagsAndAdvisors,
  CommonModelController.createAdvisors,
  CommonModelController.update,
);
// Delete a document
router.delete(
  '/',
  validateToken,
  validateAdmin,
  [validateNumber('id')],
  handleValidation,
  CommonModelController.delete,
);

export default router;
