/**
 * The AppResponse class
 */
import { OK } from '../constant';

type T = Record<string, any>;

/**
 * The AppResponse class
 */
export class AppResponse {
  /**
   * @param {Object} success the meta object
   * @return {Object} The success response object
   */
  static getSuccessMeta(success = true) {
    return { status_code: OK, success };
  }

  /**
   * @param {Object} meta the meta object
   * @param {Object} data success response object
   * @return {Object} The success response object
   */
  static format(meta: T, data: Array<T> | T | null = null) {
    let response: T = {};
    response.meta = meta;
    if (meta.code) {
      meta.status_code = meta.code;
      delete meta.code;
    }
    if (data) {
      response.data = data;
    }
    return response;
  }
}

