import _ from 'lodash';
import models from '../database/models';
import { sanitizeValue } from '../helpers/utils';

const {
  Sequelize: { Op },
} = models;

export const filterCommonQuery = (request, response, next) => {
  const { model } = response.locals;
  const { order } = request.query;
  const columns = _.keys(models[model].rawAttributes);
  const where = _.pick(request.query, columns);
  where.name = { [Op.iLike]: `%${where.name || ''}%` };
  response.locals.where = where;
  response.locals.order = [_.split(order || 'name,ASC', ',')];
  next();
};

export const filterDocumentQuery = (request, response, next) => {
  const { model } = response.locals;
  const {
    order, q, advisors, author
  } = request.query;
  const columns = _.keys(models[model].rawAttributes);
  const filters = _.pick(request.query, [...columns]);

  filters.author = { [Op.iLike]: `%${sanitizeValue(filters.author)}%` };
  filters.advisors = { [Op.contains]: [sanitizeValue(advisors)] };

  if (!_.isEmpty(q)) {
    filters[Op.or] = {
      title: { [Op.iLike]: `%${sanitizeValue(q)}%` },
      subject: { [Op.iLike]: `%${sanitizeValue(q)}%` },
      abstract: { [Op.iLike]: `%${sanitizeValue(q)}%` },
      tags: { [Op.contains]: [sanitizeValue(q)] },
    };
  }
  if (!advisors) {
    delete filters.advisors;
  }
  if (!author) {
    delete filters.author;
  }

  response.locals.where = filters;
  response.locals.order = [_.split(sanitizeValue(order, 'title,ASC'), ',')];
  next();
};

export default {};
