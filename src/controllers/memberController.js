import bcrypt from 'bcryptjs';
import Random from 'random-int';
import moment from 'moment';

import { Response, generateToken } from '../helpers/utils';
import { STATUS, STATE_CODES } from '../helpers/constants';
import models from '../database/models';
import Mailer from '../helpers/sendMail';

const {
  Member,
  Sequelize: { Op },
} = models;

class MemberController {
  /**
   * Login a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async login(request, response) {
    const { username, password } = request.body;
    const encryptedPassword = bcrypt.hashSync(password, process.env.SECRET_KEY);

    try {
      let result = await Member.findOne({
        where: {
          [Op.or]: {
            email: username,
            phone: username,
          },
          password: encryptedPassword,
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
        result.isActive = moment(result.expiresAt).isAfter(moment());
        code = STATUS.OK;
        message = 'Log in  successful!';
      }
      return Response.send(response, code, result, message, status);
    } catch (error) {
      return Response.send(
        response,
        STATUS.SERVER_ERROR,
        null,
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
  static async registerMember(request, response) {
    const { body } = request;
    try {
      body.id = `${STATE_CODES[body.state]}${Random(100000, 999999)}`;
      const { dataValues } = await Member.create(body);
      delete dataValues.password;
      dataValues.token = generateToken({ id: dataValues.id });
      dataValues.isActive = false;
      return Response.send(response, STATUS.CREATED, dataValues, 'Registration sucessful!', true);
    } catch (error) {
      return MemberController.displayInsertError('Registration failed.', error, response);
    }
  }

  /**
   * Update a user
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async updateMember(request, response) {
    const {
      authValue: { id },
    } = response.locals;
    try {
      await Member.update(request.body, { where: { id } });
      return Response.send(response, STATUS.CREATED, null, 'Update sucessful!', true);
    } catch (error) {
      return MemberController.displayInsertError('Update member details failed.', error, response);
    }
  }

  /**
   * Update profile image
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async updateProfileImage(request, response) {
    const {
      authValue: { id },
    } = response.locals;
    const { url } = request.body;
    try {
      await Member.update({ image: url }, { where: { id } });
      return Response.send(response, STATUS.CREATED, null, 'Update sucessful!', true);
    } catch (error) {
      return MemberController.displayInsertError('Update member details failed.', error, response);
    }
  }

  /**
   * Request new password
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async forgotPassword(request, response) {
    const { email } = request.body;
    const member = await Member.getMember('email', email);

    const token = generateToken({ email }, '1h');
    Mailer.send({
      to: email,
      subject: 'Reset your Password',
      template: member ? 'forgot-password' : 'no-account',
      context: {
        name: member ? member.name : '',
        link: `${process.env.ROOT}/reset-password?token=${token}`,
        root: process.env.ROOT,
      },
    });
    return Response.send(
      response,
      STATUS.OK,
      null,
      `A link to reset your password has been set to ${email}. Please check your email.`,
      true,
    );
  }

  /**
   * Reset password
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next callback function
   */
  static async resetPassword(request, response) {
    const {
      authValue: { email },
    } = response.locals;
    const { password } = request.body;
    try {
      if (!email) {
        return Response.send(
          response,
          STATUS.UNATHORIZED,
          null,
          'There was an issue verifying your account. You may need to send another request for a new password.',
          true,
        );
      }

      await Member.update({ password }, { where: { email } });
      return Response.send(response, STATUS.CREATED, null, 'Password reset sucessful!', true);
    } catch (error) {
      return MemberController.displayInsertError('Password reset failed!.', error, response);
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
export default MemberController;
