import sample from './rest/sample/sample.route';

import { Router } from 'express';
const router = Router();

router.use(sample);

//export router
export default router;
