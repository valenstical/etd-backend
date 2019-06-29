import jwt from 'jsonwebtoken';
import fs from 'fs';
import util from 'util';
import models from '../database/models';

import {
  MESSAGE, STATUS, STATES, LGAS, SCHOOL_TYPES
} from './constants';

const {
  Sequelize: { Op },
} = models;

export class Response {
  static send(
    response,
    code = STATUS.OK,
    data = [],
    message = MESSAGE.SUCCESS_MESSAGE,
    status = true,
  ) {
    return response.status(code).json({
      code,
      data,
      message,
      status,
      timestamp: new Date().getTime(),
    });
  }

  static sendServerError(
    response,
    error,
    message = 'There was a problem processing your request. Please try again or contact us for assistance.',
  ) {
    Response.send(response, STATUS.SERVER_ERROR, error, message, false);
  }
}

export const validatorFormater = ({ param, msg }) => ({
  field: param,
  message: msg,
});

export const generateToken = (payload, expiresIn = '365d') => jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });

export const readFile = file => util.promisify(fs.readFile)(`${process.env.BASE_DIR}/${file}`, 'utf-8');

export const valueFromToken = (key, response) => {
  const {
    authValue: { [key]: result },
  } = response.locals;
  return result;
};

export const paginate = (response, data) => {
  const { offset, limit, current } = response.locals;
  const last = Math.ceil(data.count / limit);
  const currentCount = data.rows.length;
  const result = {
    code: STATUS.NOT_FOUND,
    data: [],
    message: 'No results found',
    status: false,
  };
  if (currentCount !== 0) {
    result.code = STATUS.OK;
    result.data = {
      result: data.rows.map((value) => {
        const { dataValues: element } = value;
        element.typeName = SCHOOL_TYPES[element.type];
        if (element.location) {
          const { state, lga } = element.location;
          element.location.stateName = STATES[state];
          element.location.lgaName = LGAS[state][lga];
        }
        return element;
      }),
      page: {
        first: 1,
        current,
        last,
        currentCount,
        totalCount: data.count,
        hasMore: current !== last,
        description: `${offset + 1}-${offset + currentCount} of ${data.count}`,
      },
    };
    result.message = 'Successfully fetched results';
    result.status = true;
  }
  return result;
};

export const formatSchoolQuery = (query) => {
  const {
    memberId, state, q, lga, city, type, force
  } = query;

  const nameQuery = q
    ? {
      name: {
        [Op.iLike]: `%${q}%`,
      },
    }
    : {};
  const typeQuery = type
    ? {
      type: {
        [Op.eq]: parseInt(type, 10),
      },
    }
    : {};
  const stateQuery = state
    ? {
      location: {
        state,
      },
    }
    : {};
  const lgaQuery = lga
    ? {
      location: {
        lga,
      },
    }
    : {};
  const cityQuery = city
    ? {
      location: {
        city: {
          [Op.iLike]: `%${city}%`,
        },
      },
    }
    : {};
  const memberIdQuery = memberId
    ? {
      memberId: {
        [Op.eq]: memberId,
      },
    }
    : {};
  const activeQuery = !force
    ? {
      isActive: {
        [Op.eq]: true,
      },
    }
    : {};
  return {
    typeQuery,
    memberIdQuery,
    nameQuery,
    cityQuery,
    lgaQuery,
    stateQuery,
    activeQuery,
  };
};
