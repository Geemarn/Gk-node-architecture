import { Router } from 'express';
import Sample from './sample.model';
import SampleController from './sample.controller';
import { response } from '../../../midddleware';

const router = Router();

const _testCtrl = new SampleController(Sample);

//routes for tests
router
  .route('/samples')
  .get(_testCtrl.find, response)
  .post(_testCtrl.create, response);
//@ts-ignore
router.param('id', _testCtrl.id, response);
router
  .route('/samples/:id')
  .get(_testCtrl.findOne, response)
  .put(_testCtrl.update, response)
  .delete(_testCtrl.delete, response);

export default router;
