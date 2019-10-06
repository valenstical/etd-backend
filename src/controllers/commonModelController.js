import Random from 'random-int';
import { Response, paginate } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const {
  Sequelize: { Op },
} = models;
export class CommonModelController {
  /**
   * Get all data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getAll(request, response) {
    const { model, where, order } = response.locals;
    const { page, limit, offset } = paginate(request.query);
    try {
      const result = await models[model].findAndCountAll({
        limit,
        offset,
        where,
        order,
      });
      return Response.send(
        response,
        STATUS.OK,
        {
          result: result.rows,
          pagination: {
            currentPage: page,
            lastPage: Math.ceil(result.count / limit),
            currentCount: result.rows.length,
            totalCount: result.count,
          },
        },
        `${model}s fetched successfully`,
        true,
      );
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        error,
        'Server error, please try again.',
        false,
      );
    }
  }

  /**
   * Get all distinct data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getAllDistinct(request, response) {
    const { model } = response.locals;
    try {
      const result = await models[model].aggregate('name', 'DISTINCT', {
        plain: false,
        order: [['name', 'ASC']],
        where: CommonModelController.addCollegeId(request),
      });
      return Response.send(response, STATUS.OK, result, `${model}s fetched successfully`, true);
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        error,
        'Server error, please try again.',
        false,
      );
    }
  }

  static addCollegeId(request) {
    const { collegeId } = request.query;
    return collegeId ? { collegeId } : {};
  }

  /**
   * Add a new data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async create(request, response) {
    const { model, collegeId } = response.locals;
    try {
      const { body } = request;
      const result = await models[model].create({
        ...body,
        id: Random(1000000, 9999999),
        collegeId,
      });
      return Response.send(response, STATUS.CREATED, result, `${model} added sucessfully!`, true);
    } catch (error) {
      return Response.send(response, STATUS.UNPROCESSED, [], `${model} already exists.`, false);
    }
  }

  /**
   * Add multiple advisors
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async createAdvisors(request, response, next) {
    const { collegeId } = response.locals;
    try {
      const { advisors } = request.body;
      const data = advisors.map((item) => ({
        name: item,
        id: Random(1000000, 9999999),
        collegeId,
      }));
      await models.Advisor.bulkCreate(data);
    } catch (error) {
      // TODO
    }
    next();
  }

  /**
   * Edit the selected data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async update(request, response) {
    const { model, collegeId } = response.locals;
    try {
      const { body } = request;
      await models[model].update(body, { where: { [Op.and]: { id: body.id, collegeId } } });
      return Response.send(response, STATUS.OK, [], `${model} updated sucessfully!`, true);
    } catch (error) {
      return Response.send(response, STATUS.UNPROCESSED, [], `${model} already exists.`, false);
    }
  }

  /**
   * Delete the selected data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async delete(request, response) {
    const { model, collegeId } = response.locals;
    try {
      const { id } = request.body;
      await models[model].destroy({ where: { [Op.and]: { id, collegeId } } });
      return Response.send(response, STATUS.OK, [], `${model} deleted sucessfully!`, true);
    } catch (error) {
      return Response.send(
        response,
        STATUS.UNPROCESSED,
        [],
        `${model} could not be deleted because it is already in use.`,
        false,
      );
    }
  }
}
export default {};
