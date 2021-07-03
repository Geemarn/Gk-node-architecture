import lang from '../../lang';
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK } from '../../../utils/constant';
import { AppError, QueryParser } from '../../../utils/lib';
import { isEmpty } from 'lodash';

type T = Record<string, any>;
/**
 * The App controller class
 */
class AppController {
  model: T | any;
  lang: any;
  // create: () => any;
  // status: () => any;
  // findOne: () => any;
  // searchOne: () => any;
  // find: () => any;
  // update: () => any;
  // delete: () => any;

  /**
   * @param {Model} model The default model object
   * for the controller. Will be required to create
   * an instance of the controller
   */
  constructor(model: T) {
    if (new.target === AppController) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
    if (model) {
      this.model = model;
      this.lang = lang.get(model.collection.collectionName);
    }
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @param {String} id The id from the url parameter
   * @return {Object} res The response object
   */
  id = async (req: T, res: T, next: (appError?: any) => void, id: String) => {
    let request = this.model.findOne({ _id: id, deleted: false });
    try {
      let object = await request;
      if (object) {
        req.object = object;
        return next();
      }
      const appError = new AppError(this.lang.not_found, NOT_FOUND);
      return next(appError);
    } catch (err) {
      return next(err);
    }
  };

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} The response object
   */
  searchOne = async (req: T, res: T, next: () => void) => {
    const processor = this.model.getProcessor(this.model);
    const queryParser = new QueryParser(Object.assign({}, req.query));
    const query = await processor.buildSearchQuery(queryParser);
    console.log('query >>>  ', query);
    let object = null;
    if (!isEmpty(query)) {
      object = await this.model.findOne({ ...query, deleted: false });
    }
    req.response = {
      model: this.model,
      code: OK,
      value: object == null ? {} : object,
    };
    return next();
  };

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} The response object
   */
  async findOne(req: T, res: T, next: () => void) {
    let object = req.object;
    req.response = {
      model: this.model,
      code: OK,
      value: object,
    };
    return next();
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
   create = async(req: T, res: T, next: (err?: any) => void) => {
    try {
      const processor = this.model.getProcessor(this.model);
      const validate = await this.model.getValidator().create(req.body);
      if (!validate.passed) {
        return next(new AppError(lang.get('error').inputs, BAD_REQUEST, validate.errors));
      }
      const obj = await processor.prepareBodyObject(req);
      let object = await processor.retrieveExistingResource(this.model, obj);
      if (object) {
        const returnIfFound = this.model.returnDuplicate;
        if (returnIfFound) {
          req.response = {
            message: this.lang.created,
            model: this.model,
            code: CREATED,
            value: object
          };
          return next();
        } else {
          const messageObj = this.model.uniques.map((m: string) => ({[m]: `${m} must be unique`}));
          const appError = new AppError(lang.get('error').resource_already_exist, CONFLICT, messageObj);
          return next(appError);
        }
      } else {
        let checkError = await processor.validateCreate(obj);
        if (checkError) {
          return next(checkError);
        }
        object = await processor.createNewObject(obj);
      }
      req.response = {
        message: this.lang.created,
        model: this.model,
        code: CREATED,
        value: await object
      };
      const postCreate = await processor.postCreateResponse(object, {
        userId: req.userId,
        model: this.model.collection.collectionName
      });
      if (postCreate) {
        req.response = Object.assign({}, req.response, postCreate);
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }

}
