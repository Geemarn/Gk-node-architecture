import { Schema } from 'mongoose';
import util from 'util';
import { modelType } from '../types';
import { AppProcessor, AppValidation } from './index';

/**
 * The Base types object where other types inherits or
 * overrides pre defined and static methods
 */
function AppSchema(this: any, ...args: any) {
  // bind schema with argument with lexical this
  Schema.apply(this, args);

  this.statics.softDelete = false;
  this.statics.uniques = [];
  this.statics.fillables = [];
  this.statics.updateFillables = [];
  this.statics.hiddenFields = [];

  /**
   * @return {Object} The validator object with the specified rules.
   */
  this.statics.getValidator = () => {
    return new AppValidation();
  };

  /**
   *  @param {Model} model
   * @return {Object} The processor class instance object
   */
  this.statics.getProcessor = (model: modelType) => {
    return new AppProcessor(model);
  };
}

util.inherits(AppSchema, Schema);

export default AppSchema;
