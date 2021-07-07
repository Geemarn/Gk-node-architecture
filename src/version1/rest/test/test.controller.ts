/**
 * The TestController class
 */
import AppController from '../_core/app.controller/app.controller';
import { modelType } from '../types';

/**
 *  TestController
 */

export default class TestController extends AppController {
  /**
   * @param {Model} model The default model object
   * for the controller. Will be required to create
   * an instance of the controller¬
   */
  constructor(model: modelType) {
    super(model);
  }
}
