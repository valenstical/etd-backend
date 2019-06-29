import moment from 'moment';

import { Response, valueFromToken } from '../helpers/utils';
import { STATUS } from '../helpers/constants';
import models from '../database/models';

const { Member } = models;

class MemberValidator {
  static async validateMemberStatus(request, response, next) {
    const id = valueFromToken('id', response);
    try {
      const member = await Member.getMember('id', id);
      const isActive = moment(member.expiresAt).isAfter(moment());
      if (!isActive) {
        return Response.send(
          response,
          STATUS.FORBIDDEN,
          [],
          'You need to pay your membership fee in order to continue.',
          false,
        );
      }
      next();
    } catch (error) {
      return Response.sendServerError(response, error);
    }
  }
}
export default MemberValidator;
