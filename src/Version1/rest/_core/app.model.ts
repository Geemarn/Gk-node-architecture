import {Schema, Model} from 'mongoose';
import util from "util";
import AppValidation from './app.validation';

export interface modelType {
  <T>(name: string, schema?: Schema<any>, collection?: string, skipInit?: boolean): Model<T>;
  <T, U extends Model<T, TQueryHelpers, any>, TQueryHelpers = {}>(name: string, schema?: Schema<T, U>, collection?: string, skipInit?: boolean): U
}

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
   *  @param {Model} model The password to compare against
   * @return {Object} The processor class instance object
   */
  this.statics.getProcessor = (model: modelType) => {
    // return new AppProcessor(model);
  };
}

util.inherits(AppSchema, Schema);

export default AppSchema;
