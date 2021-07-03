import isEmpty from 'lodash/isEmpty';

type T = Record<string, any>;

type formatType = {
  code: number;
  message: string;
  messages: any | undefined;
  type: number | undefined;
};

/**
 * The App Error class
 */
export class AppError extends Error {
  _code: number;
  _type: number | undefined;
  _message: string;
  _messages: Array<string> | any | undefined;

  /**
   * @param {String} message The error message
   * @param {Number} code The task-status code of the error
   * @param {Object} messages The optional error messages
   * @param type
   */
  constructor(
    message: string,
    code: number,
    messages: Array<string> | null = null,
    type?: number
  ) {
    super(message);
    this._code = code;
    this._message = message;

    if (type) {
      this._type = type;
    }
    if (messages) {
      this._messages = messages;
    }
  }

  /**
   * @return {Number}
   */
  get code() {
    return this._code;
  }

  /**
   * @return {String}
   */
  get message() {
    return this._message;
  }

  /**
   * @return {Array<string>}
   */
  get messages() {
    return this._messages;
  }

  /**
   * This will format joi error to api accepted error
   *  @return {Object} errors
   * @param validateObject
   */
  static async formatInputError(validateObject: T) {
    let data;
    if (validateObject.error) {
      data = Object.values(
        validateObject.error.details.map((error: T) => error.message)
      );
    }
    return {
      errors: validateObject.error ? data : null,
      passed: isEmpty(validateObject.error),
      value: validateObject.value,
    };
  }

  /**
   * @return {Object} The instance of AppError
   */
  format() {
    const obj: Partial<formatType> = {
      code: this._code || 500,
      message: this.message,
    };
    if (this._messages) {
      obj.messages = this._messages.errors || this._messages;
    }
    if (this._type && this._type > 0) {
      obj.type = this._type;
    }
    return obj;
  }
}

