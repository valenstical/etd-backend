import { validationResult, body } from 'express-validator/check';
import { Response } from '../helpers/utils';
import { STATUS, MESSAGE } from '../helpers/constants';

export const validateRequired = (field, message = `${field} is required`) => body(field)
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

export const validateEmpty = (field, message = `${field} is required`) => body(field)
  .not()
  .isEmpty()
  .withMessage(message);

export const validateNumber = (field, message = `${field} must be a number`, small = true) => body(field)
  .trim()
  .isInt()
  .withMessage(message)
  .isInt({ min: small ? 10000 : 1000000, max: small ? 99999 : 9999999 })
  .withMessage(message);

export const validateUrl = (field = 'url', message = 'Enter a valid url') => body(field)
  .trim()
  .isURL()
  .withMessage(message);

export const validateEmail = (field = 'email', message = 'Enter a valid email address') => body(field)
  .trim()
  .isEmail()
  .withMessage(message);

export const validateComparison = (field1, field2, message = 'Passwords do not match.') => [
  body(field1)
    .not()
    .isEmpty()
    .withMessage(`${field1} is required`),
  body(field2)
    .not()
    .isEmpty()
    .withMessage(`${field2} is required`)
    .custom((password, { req }) => {
      if (password !== req.body[field1]) {
        throw new Error(message);
      } else {
        return password;
      }
    }),
];

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
