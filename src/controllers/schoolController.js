import Random from 'random-int';

import {
  Response, valueFromToken, paginate, formatSchoolQuery
} from '../helpers/utils';
import {
  STATUS, STATES, LGAS, SCHOOL_TYPES
} from '../helpers/constants';
import models from '../database/models';

const { School, Sequelize } = models;

const { Op } = Sequelize;

export default class SchoolController {
  static async createSchool(request, response) {
    const { body } = request;
    const id = valueFromToken('id', response);
    try {
      body.id = Random(10000000, 99999999);
      body.memberId = id;
      const { dataValues } = await School.create(body);
      return Response.send(
        response,
        STATUS.CREATED,
        dataValues,
        'School successfully added to our platform. Next complete your school details!',
        true,
      );
    } catch (error) {
      Response.sendServerError(
        response,
        error,
        'There was a problem adding your school to our platorm. Please try again or contact us for assistance.',
      );
    }
  }

  static async updateSchool(request, response) {
    const { body } = request;
    const id = valueFromToken('id', response);
    const { schoolId } = request.params;
    try {
      body.id = schoolId;
      body.memberId = id;
      await School.update(body, { where: { [Op.and]: { id: schoolId, memberId: id } } });
      return Response.send(response, STATUS.OK, [], 'School successfully updated!', true);
    } catch (error) {
      return Response.sendServerError(
        response,
        error,
        'There was a problem updating your school. Please try again or contact us for assistance.',
      );
    }
  }

  static async getSchool(request, response) {
    const { schoolId } = request.params;
    try {
      const result = await School.findByPk(schoolId);
      if (result) {
        const { dataValues } = result;
        dataValues.typeName = SCHOOL_TYPES[dataValues.type];

        if (dataValues.location) {
          const { state, lga } = dataValues.location;
          dataValues.location.stateName = STATES[state];
          dataValues.location.lgaName = LGAS[state][lga];
        }
        return Response.send(response, STATUS.OK, dataValues, 'School successfully fetched!', true);
      }
      return Response.send(response, STATUS.NOT_FOUND, {}, 'School not found!', false);
    } catch (error) {
      return Response.sendServerError(response, error);
    }
  }

  static async getSchools(request, response, next) {
    try {
      const { offset, limit } = response.locals;
      const { order } = request.query;
      const ordering = order
        ? [order.split(',')]
        : [Sequelize.literal('random()'), ['name', 'ASC']];
      const {
        stateQuery,
        lgaQuery,
        typeQuery,
        nameQuery,
        cityQuery,
        memberIdQuery,
        activeQuery,
      } = formatSchoolQuery(request.query);

      const schools = await School.findAndCountAll({
        limit,
        offset,
        order: ordering,
        where: {
          ...stateQuery,
          ...lgaQuery,
          ...nameQuery,
          ...typeQuery,
          ...cityQuery,
          ...memberIdQuery,
          ...activeQuery,
        },
        attributes: {
          exclude: [
            'details',
            'amenities',
            'gallery',
            'founded',
            'gender',
            'createdAt',
            'updatedAt',
            'isActive',
            'memberId',
          ],
        },
      });
      const {
        code, data, message, status
      } = paginate(response, schools);
      return Response.send(response, code, data, message, status);
    } catch (error) {
      return Response.sendServerError(response, error);
    }
  }
}
