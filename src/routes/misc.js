import express from 'express';
import { Response } from '../helpers/utils';
import { STATUS, LGAS } from '../helpers/constants';

const router = express.Router();

// Get LGAs
router.get('/lgas', (request, response) => Response.send(response, STATUS.OK, LGAS[request.query.state], '', true),);

export default router;
