import { body, param } from 'express-validator/check';
import {
  validateRequired,
  validateState,
  validateEmail,
  validatePhone,
  validateUrl,
  validateOptional,
  validateOptionalBoolean,
  validateOptionalUrl,
  validateNumber,
} from './validator';
import { valueFromToken, Response } from '../helpers/utils';

import models from '../database/models';
import { STATUS } from '../helpers/constants';

const {
  School,
  Sequelize: { Op },
} = models;

export const validateBasicDetails = [
  validateRequired('name', 'School name is required'),
  body('type')
    .isInt({ min: 0, max: 2 })
    .withMessage('School type is required'),
  body('founded')
    .isInt({ min: 1000 })
    .withMessage('Enter a valid year (e.g 2012)'),
  body('gender')
    .isInt({ min: 0, max: 2 })
    .withMessage('Gender is required'),
];

export const validateSchoolId = [
  param('schoolId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('School ID is required'),
];

export const validateContactDetails = [
  validateEmail(),
  validatePhone(),
  validateOptionalUrl('website', 'Your school website should be a valid URL (e.g http://abc.com)'),
];

export const validateLocationDetails = [
  validateRequired('address', 'School address is required'),
  validateRequired('city', 'Enter the city/town where your school is located'),
  validateState('Enter the state where your school is located'),
  validateNumber('lga', 'Enter a valid Local Government Area'),
];

export const validateFullDetails = [validateRequired('details', 'Your school details is required')];

export const validateCoverImage = [validateUrl('cover', 'Image url is invalid')];

export const validateLogoImage = [validateUrl('logo', 'Image url is invalid')];

export const validateGallery = (request, response, next) => {
  const { gallery } = request.body;
  request.body.gallery = !gallery || !gallery.trim() ? [] : gallery.split(',');
  next();
};

export const validateIsActive = [
  body('isActive')
    .isBoolean()
    .withMessage('Enter a valid school status'),
];

export const validateAmenities = [
  validateOptionalBoolean('laboratory', 'Indicate if your school has science laboratory.'),
  validateOptionalBoolean('computer', 'Indicate if your school has computer laboratory.'),
  validateOptionalBoolean('library', 'Indicate if your school has library.'),
  validateOptionalBoolean('vehicle', 'Indicate if your school has school vehicle.'),
  validateOptionalBoolean('boarding', 'Indicate if your school has boarding facility.'),
];

export const contactToJSON = (request, response, next) => {
  const contact = request.body;
  request.body = {};
  request.body.contact = contact;
  next();
};

export const locationToJSON = (request, response, next) => {
  const location = request.body;
  request.body = {};
  request.body.location = location;
  next();
};

export const amenitiesToJSON = (request, response, next) => {
  const amenities = request.body;
  request.body = {};
  request.body.amenities = amenities;
  next();
};

export const validateSchoolExists = async (request, response, next) => {
  const memberId = valueFromToken('id', response);
  const { schoolId } = request.params;
  try {
    const result = await School.findOne({
      where: { [Op.and]: { memberId, id: schoolId } },
      attributes: {
        includes: ['id'],
      },
    });
    if (!result) {
      return Response.send(
        response,
        STATUS.NOT_FOUND,
        [],
        'You do not have a school with that school ID. Please check the school ID then try again',
        false,
      );
    }
    next();
  } catch (error) {
    Response.sendServerError(response, error);
  }
};

export const validateSchoolDuplicate = async (request, response, next) => {
  const memberId = valueFromToken('id', response);
  const { name } = request.body;
  try {
    const result = await School.findOne({
      where: { [Op.and]: { memberId, name } },
      attributes: {
        includes: ['id'],
      },
    });
    if (result) {
      return Response.send(
        response,
        STATUS.FORBIDDEN,
        [],
        'You already have a school with that exact name. Consider adjusting the school name.',
        false,
      );
    }
    next();
  } catch (error) {
    Response.sendServerError(response, error);
  }
};
