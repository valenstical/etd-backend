import { validationResult, body, query } from 'express-validator/check';
import { Response } from '../helpers/utils';
import { STATUS, MESSAGE } from '../helpers/constants';
import validateToken from './authenticate';

export const validateRequired = (field, message = 'This field is required') => body(field)
  .trim()
  .not()
  .isEmpty()
  .withMessage(message);

export const validateOptional = (field, message = `Enter a valid ${field}`) => body(field)
  .trim()
  .optional()
  .not()
  .isEmpty()
  .withMessage(message);

export const validateOptionalUrl = (field, message = `Enter a valid ${field}`) => body(field)
  .optional()
  .trim()
  .isURL({ require_protocol: true })
  .withMessage(message);

export const validateOptionalBoolean = (field, message = `Enter a valid ${field}`) => body(field)
  .optional()
  .isBoolean()
  .withMessage(message);

export const validateEmpty = (field, message = 'This field is required') => body(field)
  .not()
  .isEmpty()
  .withMessage(message);

export const validateEmail = () => body('email')
  .trim()
  .isEmail()
  .withMessage('Enter a valid email');

export const validatePhone = () => body('phone')
  .trim()
  .isMobilePhone(['en-NG'])
  .withMessage('Enter a valid mobile phone number');

export const validateState = (message = 'Choose a state') => body('state')
  .trim()
  .isInt()
  .withMessage(message)
  .isInt({ min: 0, max: 36 })
  .withMessage(message);

export const validateStateParam = (message = 'Choose a tate') => query('state')
  .trim()
  .isInt()
  .withMessage(message)
  .isInt({ min: 0, max: 36 })
  .withMessage(message);

export const validateNumber = (field, message = `${field} must be a number`) => body(field)
  .trim()
  .isInt()
  .withMessage(message);

export const validateSex = () => body('sex')
  .trim()
  .isIn(['Male', 'Female'])
  .withMessage('Choose a sex');

export const validateUrl = (field = 'url', message = 'Enter a valid url') => body(field)
  .trim()
  .isURL()
  .withMessage(message);

const validateMemberDetails = [
  validateRequired('name'),
  validateState(),
  validateEmail(),
  validateSex(),
  validatePhone(),
];

const validateComparison = (field1, field2, message = 'Passwords do not match.') => [
  body(field1)
    .not()
    .isEmpty()
    .withMessage('This field is required'),
  body(field2)
    .not()
    .isEmpty()
    .withMessage('This field is required')
    .custom((password, { req }) => {
      if (password !== req.body[field1]) {
        throw new Error(message);
      } else {
        return password;
      }
    }),
];

export const Validator = {
  validateLogin: [validateRequired('username'), validateEmpty('password')],
  validateRegistration: [...validateMemberDetails, validateEmpty('password')],
  validateMemberDetails,
  validateToken,
  validateImage: [validateUrl('url', 'Image url invalid')],
  validateEmail: [validateEmail()],
  validateResetPassword: [...validateComparison('password', 'confirm_password')],
  validatePaymentRef: [validateEmpty('ref', 'The payment reference code is required.')],
};

export const validatePagination = (request, response, next) => {
  const page = request.query.page || 1;
  const limit = request.query.size || 50;
  const offset = page * limit - limit;
  response.locals.offset = !offset || offset < 0 ? 0 : offset;
  response.locals.limit = limit;
  response.locals.current = response.locals.offset === 0 ? 1 : Number(request.query.page);
  next();
};

export const handleValidation = (request, response, next) => {
  const errors = validationResult(request).formatWith(({ param, msg }) => ({
    [param]: msg,
  }));
  if (!errors.isEmpty()) {
    return Response.send(
      response,
      STATUS.BAD_REQUEST,
      errors.array({ onlyFirstError: true }),
      MESSAGE.VALIDATE_ERROR,
      false,
    );
  }
  next();
};
