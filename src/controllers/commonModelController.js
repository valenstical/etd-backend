import Random from 'random-int';
import { Response } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

export class CommonModelController {
  /**
   * Get all data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getAll(request, response) {
    const { model } = response.locals;
    try {
      const result = await models[model].findAll({
        order: [['name', 'ASC']],
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

  /**
   * Add a new data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async create(request, response) {
    const { model } = response.locals;
    try {
      const { body } = request;
      const result = await models[model].create({ ...body, id: Random(1000000, 9999999) });
      return Response.send(response, STATUS.CREATED, result, `${model} added sucessfully!`, true);
    } catch (error) {
      return Response.send(response, STATUS.UNPROCESSED, [], `${model} already exists.`, false);
    }
  }

  /**
   * Edit the selected data
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async update(request, response) {
    const { model } = response.locals;
    try {
      const { body } = request;
      await models[model].update(body, { where: { id: body.id } });
      return Response.send(response, STATUS.CREATED, [], `${model} updated sucessfully!`, true);
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
    const { model } = response.locals;
    try {
      const { body } = request;
      await models[model].destroy({ where: { id: body.id } });
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
