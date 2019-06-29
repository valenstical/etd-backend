import express from 'express';
import { Validator, handleValidation } from '../middleware/validator';
import PaymentController from '../controllers/paymentController';

const router = express.Router();

// Request payment
router.get(
  '/request',
  Validator.validateToken,
  Validator.validatePaymentType,
  handleValidation,
  PaymentController.requestPayment,
);

// Request authentication
router.post(
  '/',
  Validator.validateToken,
  Validator.validatePaymentRef,
  handleValidation,
  Validator.verifyPayment,
  PaymentController.processPayment,
);

export default router;
