import { Response, valueFromToken } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const { User } = models;

export const validateAdmin = async (request, response, next) => {
  const id = valueFromToken('id', response);
  try {
    const user = await User.getUser('id', id);
    if (!user.isAdmin) {
      return Response.send(
        response,
        STATUS.FORBIDDEN,
        [],
        'You do not have permission to perform that action.',
        false,
      );
    }
    response.locals.collegeId = user.collegeId;
    next();
  } catch (error) {
    return Response.sendServerError(response, error);
  }
};

export default {};
