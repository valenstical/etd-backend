import { validateRequired, validateEmail, validateEmpty } from './validatorHelpers';

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

export default {};
