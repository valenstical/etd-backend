import {
  validateRequired,
  validateEmail,
  validateEmpty,
  validateOptionalBoolean,
} from './validatorHelpers';

export const validateRegisterUser = [
  validateRequired('name'),
  validateRequired('email'),
  validateEmail(),
  validateEmpty('password'),
];

export const validateUpdateUser = [
  validateRequired('name'),
  validateRequired('email'),
  validateRequired('userId'),
  validateEmail(),
];

export const validateDeactiveUser = [
  validateRequired('userId'),
  validateRequired('status'),
  validateOptionalBoolean('status'),
];

export default {};
