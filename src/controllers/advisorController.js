import Random from 'random-int';

import { Response } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const { Advisor } = models;

class AdvisorController {
  /**
   * Get all advisors
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async getAllAdvisors(request, response) {
    try {
      const advisors = await Advisor.findAll({
        order: [['name', 'ASC']],
      });
      return Response.send(response, STATUS.OK, advisors, 'Advisor fetched successfully', true);
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
   * Add an adviser and send a response
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async addAdvisor(request, response) {
    try {
      const { name } = request.body;
      const advisor = await Advisor.create({ name, id: Random(10000, 99999) });
      return Response.send(response, STATUS.CREATED, advisor, 'Advisor added sucessfully!', true);
    } catch (error) {
      return Response.send(response, STATUS.UNPROCESSED, [], 'Name already exists.', false);
    }
  }
}
export default AdvisorController;
