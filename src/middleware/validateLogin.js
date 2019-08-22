import { validateRequired, validateEmail, validateEmpty } from './validatorHelpers';

export const validateLogin = [
  validateRequired('email'),
  validateEmail(),
  validateEmpty('password'),
];

export default {};
