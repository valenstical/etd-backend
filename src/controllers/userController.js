import bcrypt from 'bcryptjs';
import Random from 'random-int';

import { Response, generateToken, valueFromToken } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const { User } = models;

class UserController {
  /**
   * Login a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async login(request, response) {
    const { email, password } = request.body;
    const encryptedPassword = bcrypt.hashSync(password, process.env.SECRET_KEY);
    try {
      let result = await User.findOne({
        where: {
          email,
          password: encryptedPassword,
          isActive: true,
        },
        attributes: {
          exclude: ['password'],
        },
      });
      const status = result !== null;
      let code = STATUS.UNATHORIZED;
      let message = 'Your log in credentials are invalid.';

      if (status) {
        result = result.dataValues;
        result.token = generateToken({ id: result.id });
        code = STATUS.OK;
        message = 'Log in  successful!';
      }
      return Response.send(response, code, result, message, status);
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        error,
        'Log in failed, please try again.',
        false,
      );
    }
  }

  /**
   * Register  a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async registerUser(request, response) {
    const { body } = request;
    try {
      body.id = Random(10000, 99999);
      const { dataValues } = await User.create(body);
      delete dataValues.password;
      dataValues.token = generateToken({ id: dataValues.id });
      return Response.send(response, STATUS.CREATED, dataValues, 'Registration sucessful!', true);
    } catch (error) {
      return UserController.displayInsertError('Registration failed.', error, response);
    }
  }

  /**
   * Update a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async updateUser(request, response) {
    const { userId } = request.body;
    try {
      await User.update(request.body, { where: { id: userId } });
      return Response.send(response, STATUS.OK, null, 'Update sucessful!', true);
    } catch (error) {
      return UserController.displayInsertError('Update user details failed.', error, response);
    }
  }

  /**
   * Reset password
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async resetPassword(request, response) {
    const id = valueFromToken('id', response);
    const { password } = request.body;
    try {
      if (!id) {
        return Response.send(
          response,
          STATUS.UNATHORIZED,
          null,
          'There was an issue verifying your account. You may need to send another request for a new password.',
          true,
        );
      }
      await User.update({ password }, { where: { id } });
      return Response.send(response, STATUS.CREATED, null, 'Password reset sucessful!', true);
    } catch (error) {
      return UserController.displayInsertError('Password reset failed!.', error, response);
    }
  }

  /**
   * Helper method to send insert or update error
   * @static
   * @param {string} title The title of the error message
   * @param {object} error The error object
   * @param {object} response The response object
   * @memberof MemberController
   */
  static displayInsertError(title, error, response) {
    const { errors } = error;
    const { path } = errors[0];
    const message = path === 'email' ? 'Email already exists' : 'Phone number already exists';
    Response.send(
      response,
      STATUS.UNPROCESSED,
      [
        {
          [path]: message,
        },
      ],
      `${title}`,
      false,
    );
  }
}
export default UserController;
