import { AppError } from '../../../utils/lib';
import { T } from '../types';

/**
 * The App Validation class (Do all your default validation here
 */
class AppValidation {
  /**
   * @param {Object} obj The object to validate
   * @return {Object} Validator
   */
  async create(obj: T) {
    return AppError.formatInputError({ value: obj });
  }

  /**
   * @param {Object} obj The object to validate
   * @return {Object} Validator
   */
  async update(obj: T) {
    return AppError.formatInputError({ value: obj });
  }
}

export default AppValidation;
