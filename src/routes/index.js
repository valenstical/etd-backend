import express from 'express';
import usersRoute from './users';
import advisorsRoute from './advisors';
import degreesRoute from './degrees';
import facultiesRoute from './faculties';

import { Response } from '../helpers/utils';
import { STATUS, MESSAGE } from '../helpers/constants';

const router = express.Router();

router.use('/users', usersRoute);

router.use('/advisors', advisorsRoute);

router.use('/degrees', degreesRoute);

router.use('/faculties', facultiesRoute);

router.all('*', (request, response) => {
  Response.send(response, STATUS.NOT_FOUND, null, MESSAGE.NOT_FOUND, false);
});

export default router;
