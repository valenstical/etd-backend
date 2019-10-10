import { validateRequired, validateUrl, validateNumber } from './validatorHelpers';

import models from '../database/models';
import { Response } from '../helpers/utils';
import { STATUS } from '../helpers/constants';

const {
  Department,
  Sequelize: { Op },
} = models;

const mapBooleanToArray = (department) => {
  const array = [];

  if (!department) {
    array.push({ departmentId: 'The choosen department is unkown' });
  }
  return array;
};

export const validateTagsAndAdvisors = (request, response, next) => {
  const { tags, advisors } = request.body;
  request.body.tags = !tags || !tags.trim() ? [] : tags.split(',');
  request.body.advisors = !advisors || !advisors.trim() ? [] : advisors.split(',');
  next();
};

export const validateCreateDocument = [
  validateRequired('title'),
  validateRequired('author'),
  validateUrl('url', 'Document upload link must be a valid URL'),
  validateNumber('type', 'The type of document must be either 1 or 0', 0, 1),
  validateNumber('departmentId', 'Department ID must be 7 digit number'),
];

export const validateRelationships = async (request, response, next) => {
  const { departmentId } = request.body;
  const { collegeId } = response.locals;
  try {
    const department = await Department.findOne({
      where: { [Op.and]: { collegeId, id: departmentId } },
    });

    const message = mapBooleanToArray(department);

    if (message.length) {
      return Response.send(response, STATUS.NOT_FOUND, message, '', false);
    }
    next();
  } catch (error) {
    Response.sendServerError(response, error);
  }
};

export default {};
