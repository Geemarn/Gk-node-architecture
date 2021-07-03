import { Schema } from 'mongoose';
import util from 'util';
import AppValidation from './app.validation';

/**
 * The Base types object where other types inherits or
 * overrides pre defined and static methods
 */
function AppSchema(this: Record<string, any>, ...args: any) {
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
  this.statics.getProcessor = (model: Record<string, any>) => {
    // return new AppProcessor(model);
  };
}

util.inherits(AppSchema, Schema);

export default AppSchema;
