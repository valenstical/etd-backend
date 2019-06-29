import { listOfStateCodes, listOfStates } from './states';
import { listOfLgas } from './lga';

export const STATE_CODES = listOfStateCodes;
export const STATES = listOfStates;
export const LGAS = listOfLgas;

export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNATHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSED: 422,
  SERVER_ERROR: 500,
};

export const PUBLICATION_TYPES = ['Dissertation', 'Thesis'];

export const SCHOOL_TYPES = ['Creche/Nursery', 'Primary', 'Secondary'];

export const MESSAGE = {
  SERVER_ERROR:
    'An internal error has occured. This is not your fault. We are working to fix this problem. Please try again later.',

  NOT_FOUND: 'Resource not found',
  UNATHORIZED_ACCESS: 'You do not have permission to access that resource',
  INVALID_CREDENTIALS: 'Invalid user credentials',

  CREATE_SUCCESS: 'Successfully created',
  UPDATE_SUCCESS: 'Successfully updated',
  VALIDATE_ERROR: 'There was a problem with your request, please check the values you entered.',

  SUCCESS_MESSAGE: 'Operation was successful',
  FAILURE_MESSAGE: 'Operation failed',
};

export const PAYMENT_TYPE = {
  MEMBERSHIP: 'plan_membership_fee',
  STUDENT: 'plan_student_fee',
};

export default {};
