import { extend, isArray, omit } from 'lodash';
import { AppResponse } from '../../../utils/lib';
import { modelType } from './app.model';
import EmailService from '../../../utils/email-service'

type T = Record<string, any>;
type apiResponseType = {
  model: T;
  value: T;
  code: number;
  message: string | T;
  queryParser: T;
  pagination: T;
  count: number;
  token: string;
  email: string;
  mobile: string;
};
/**
 * The main processor class
 * (this is where all business logic is been done, before been handled by the controller)
 */
export default class AppProcessor {
  model: modelType;

  /**
   * @param {Model} model The default model object
   * for the controller. Will be required to create
   * an instance of the controller
   */
  constructor(model: modelType) {
    this.model = model;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async validateCreate(obj: T) {
    return null;
  }

  /**
   * @param {Object} current required for response
   * @param {Object} obj required for response
   * @return {Object}
   */
  async validateUpdate(current: T, obj: T) {
    return null;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async validateDelete(obj: T) {
    return null;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async postCreateResponse(obj: T) {
    return false;
  }

  /**
   * @param {Object} obj required for response
   * @param {Object} response required for response
   * @return {Object}
   */
  async postUpdateResponse(obj: T, response: T) {
    return false;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async postDeleteResponse(obj: T) {
    return true;
  }

  async getApiResponse({
    model,
    value,
    code,
    message,
    queryParser,
    pagination,
    count,
    token,
    email,
    mobile,
  }: apiResponseType) {
    const meta: T = AppResponse.getSuccessMeta();
    if (code) {
      extend(meta, { status_code: code });
    }
    if (message) {
      meta.message = message;
    }
    if (value && queryParser && queryParser.population) {
      value = await model.populate(value, queryParser.population);
    }
    if (pagination && !queryParser.getAll) {
      pagination.totalCount = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
      meta.pagination = pagination.done();
    }
    if (model.hiddenFields && model.hiddenFields.length > 0) {
      const isFunction = typeof value.toJSON === 'function';
      if (isArray(value)) {
        value = value.map((v) =>
          omit(isFunction ? v.toJSON() : v, ...model.hiddenFields)
        );
      } else {
        value = omit(
          isFunction ? value.toJSON() : value,
          ...model.hiddenFields
        );
      }
    }
    if (email) {
      await EmailService.sendEmail(email);
    }
    if (mobile) {
      await AppSms.sendTwilioSms(mobile);
    }
  }
}
