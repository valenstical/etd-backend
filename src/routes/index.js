import express from 'express';
import usersRoute from './users';
import advisorsRoute from './advisors';
import degreesRoute from './degrees';
import facultiesRoute from './faculties';
import departmentsRoute from './departments';
import documentsRoute from './documents';

import { Response } from '../helpers/utils';
import { STATUS, MESSAGE } from '../helpers/constants';
import { setModel } from '../middleware/validatorHelpers';

const router = express.Router();

router.use('/users', usersRoute);

router.use('/advisors', setModel('Advisor'), advisorsRoute);

router.use('/degrees', setModel('Degree'), degreesRoute);

router.use('/faculties', setModel('Faculty'), facultiesRoute);

router.use('/departments', setModel('Department'), departmentsRoute);

router.use('/documents', setModel('Document'), documentsRoute);

router.all('*', (request, response) => {
  Response.send(response, STATUS.NOT_FOUND, null, MESSAGE.NOT_FOUND, false);
});

export default router;
