/**
 * User Schema
 */
import mongoose from 'mongoose';
import { AppSchema } from '../_core';
import { modelType } from '../types';
import TestValidation from './test.validation';
import TestProcessor from './test.processor';

const TestModel = new (AppSchema as any)(
  {
    name: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  }
);

/**
 * @return {Object} The validator object with the specified rules.
 */
TestModel.statics.getValidator = () => {
  return new TestValidation();
};

/**
 * @param {Model} model required for response
 * @return {Object} The processor class instance object
 */
TestModel.statics.getProcessor = (model: modelType) => {
  return new TestProcessor(model);
};

/**
 * @typedef TestModel
 */
export default mongoose.model('Test', TestModel);
