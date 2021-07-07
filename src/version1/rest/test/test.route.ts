import { Router } from 'express';
import Test from './test.model';
import TestController from './test.controller';
import { response } from '../../../midddleware';

const router = Router();

const _testCtrl = new TestController(Test);

//routes for tests
router
  .route('/tests')
  .get(_testCtrl.find, response)
  .post(_testCtrl.create, response);
//@ts-ignore
router.param('id', _testCtrl.id, response);
router
  .route('/tests/:id')
  .get(_testCtrl.findOne, response)
  .put(_testCtrl.update, response);

export default router;
