import Validator from 'validatorjs';
import AppValidation from '../_core/app.validation';

/**
 * The User Validation class
 */
class TestValidation<T> extends AppValidation {
  /**
   * @param {Object} obj The object to validate
   * @return {Object} Validator
   */
  // @ts-ignore
  create(obj: Record<string, any>) {
    const rules = {
      name: 'required|string',
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}

export default TestValidation;
