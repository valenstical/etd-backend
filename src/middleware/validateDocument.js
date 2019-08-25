import { validateRequired, validateUrl, validateNumber } from './validatorHelpers';

import models from '../database/models';
import { Response } from '../helpers/utils';
import { STATUS } from '../helpers/constants';

const {
  Degree,
  Faculty,
  Department,
  Sequelize: { Op },
} = models;

const mapBooleanToArray = (degree, faculty, department) => {
  const array = [];
  if (!degree) {
    array.push({ degreeId: 'The choosen degree is unkown' });
  }
  if (!faculty) {
    array.push({ facultyId: 'The choosen faculty is unkown' });
  }
  if (!department) {
    array.push({ departmentId: 'The choosen department is unkown within the choosen faculty' });
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
  validateNumber('degreeId', 'Degree ID must be 7 digit number'),
  validateNumber('type', 'The type of document must be either 1 or 0', 0, 1),
  validateNumber('facultyId', 'Faculty ID must be 7 digit number'),
  validateNumber('departmentId', 'Department ID must be 7 digit number'),
];

export const validateRelationships = async (request, response, next) => {
  const { degreeId, facultyId, departmentId } = request.body;
  const { collegeId } = response.locals;
  try {
    const degree = await Degree.findOne({
      where: { [Op.and]: { collegeId, id: degreeId } },
    });
    const faculty = await Faculty.findOne({
      where: { [Op.and]: { collegeId, id: facultyId } },
    });
    const department = await Department.findOne({
      where: { [Op.and]: { collegeId, id: departmentId, facultyId } },
    });

    const message = mapBooleanToArray(degree, faculty, department);

    if (message.length) {
      return Response.send(response, STATUS.NOT_FOUND, message, '', false);
    }
    next();
  } catch (error) {
    Response.sendServerError(response, error);
  }
};

export default {};
