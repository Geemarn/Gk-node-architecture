import { AppProcessor } from '../_core';
import { pick, extend } from 'lodash';
import { T } from '../types';

/**
 * The ModuleProcessor class
 */
class TestProcessor extends AppProcessor {
  /**
   * @param {Object} current The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   */
  async updateObject(current: T, obj: T) {
    try {
      const userUpdate = this.model.fillables;
      if (userUpdate && userUpdate.length > 0) {
        obj = pick(obj, ...userUpdate);
      }
      current = extend(current, {
        ...obj,
      });
      return current.save();
    } catch (e) {
      throw e;
    }
  }
}

export default TestProcessor;
