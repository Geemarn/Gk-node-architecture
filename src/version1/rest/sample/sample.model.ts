/**
 * User Schema
 */
import mongoose from 'mongoose';
import { AppSchema } from '../_core';
import { modelType } from '../types';
import SampleValidation from './sample.validation';
import SampleProcessor from './sample.processor';

const SampleModel = new (AppSchema as any)(
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
SampleModel.statics.getValidator = () => {
  return new SampleValidation();
};

/**
 * @param {Model} model required for response
 * @return {Object} The processor class instance object
 */
SampleModel.statics.getProcessor = (model: modelType) => {
  return new SampleProcessor(model);
};

/**
 * @typedef SampleModel
 */
export default mongoose.model('Sample', SampleModel);
