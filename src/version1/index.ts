import test from './rest/test/test.route';

import { Router } from 'express';
const router = Router();

router.use(test);

//export router
export default router;
