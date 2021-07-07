import lang from '../../../lang';
import { Request, Response, NextFunction } from 'express';
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  NOT_FOUND,
  OK,
} from '../../../../utils/constant';
import { AppError, QueryParser, Pagination } from '../../../../utils/lib';
import { extend, isEmpty } from 'lodash';
import { pick } from 'query-string';
import { modelType } from '../../types';

/**
 * The App controller class
 */
class AppController {
  model: modelType;
  lang: any;

  /**
   * @param {Model} model The default model object
   * for the controller. Will be required to create
   * an instance of the controller
   */
  constructor(model: modelType) {
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
  id = async (req: Request, res: Response, next: NextFunction, id: String) => {
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
  searchOne = async (req: Request, res: Response, next: NextFunction) => {
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
  findOne = async (req: Request, res: Response, next: NextFunction) => {
    let object = req.object;
    req.response = {
      model: this.model,
      code: OK,
      value: object,
    };
    return next();
  };

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} The response object
   */
  find = async (req: Request, res: Response, next: NextFunction) => {
    const queryParser = new QueryParser(Object.assign({}, req.query));

    const pagination = new Pagination(req.originalUrl);

    const processor = this.model.getProcessor(this.model);

    try {
      const { value, count } = await processor.buildModelQueryObject(
        pagination,
        queryParser
      );
      req.response = {
        model: this.model,
        code: OK,
        value,
        count,
        queryParser,
        pagination,
      };
      return next();
    } catch (err) {
      return next(err);
    }
  };

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const processor = this.model.getProcessor(this.model);
      const validate = await this.model.getValidator().create(req.body);

      if (!validate.passed) {
        return next(
          new AppError(lang.get('error').inputs, BAD_REQUEST, validate.errors)
        );
      }
      const _obj = await processor.prepareBodyObject(req);
      let _retrievedObj = await processor.retrieveExistingResource(
        this.model,
        _obj
      );

      if (_retrievedObj) {
        const _returnDuplicateObj = this.model.returnDuplicate;
        if (_returnDuplicateObj) {
          req.response = {
            message: this.lang.created,
            model: this.model,
            code: CREATED,
            value: _retrievedObj,
          };
          return next();
        } else {
          const _messageObj = this.model.uniques.map((m: string) => ({
            [m]: `${m} must be unique`,
          }));
          const appError = new AppError(
            lang.get('error').resource_already_exist,
            CONFLICT,
            _messageObj
          );
          return next(appError);
        }
      } else {
        let checkError = await processor.validateCreate(_obj);
        if (checkError) {
          return next(checkError);
        }
        _retrievedObj = await processor.createNewObject(_obj);
      }
      req.response = {
        message: this.lang.created,
        model: this.model,
        code: CREATED,
        value: await _retrievedObj,
      };
      // const postCreate = await processor.postCreateResponse(_retrievedObj, {
      //   userId: req.userId,
      //   model: this.model.collection.collectionName,
      // });
      // if (postCreate) {
      //   req.response = Object.assign({}, req.response, postCreate);
      // }
      return next();
    } catch (err) {
      return next(err);
    }
  };

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const processor = this.model.getProcessor(this.model);
      let _object = req.object;
      const _obj = await processor.prepareBodyObject(req);
      const validate = await this.model.getValidator().update(_obj);
      if (!validate.passed) {
        const error = new AppError(
          lang.get('error').inputs,
          BAD_REQUEST,
          validate.errors
        );
        return next(error);
      }
      if (
        this.model.uniques &&
        this.model.uniques.length > 0 &&
        !isEmpty(pick(_obj, this.model.uniques))
      ) {
        let found = await processor.retrieveExistingResource(this.model, _obj);
        if (found) {
          const messageObj = this.model.uniques.map((m: string) => ({
            [m]: `${m} must be unique`,
          }));
          const appError = new AppError(
            lang.get('error').resource_already_exist,
            CONFLICT,
            messageObj
          );
          return next(appError);
        }
      }
      let canUpdateError = await processor.validateUpdate(_object, _obj);
      if (!isEmpty(canUpdateError)) {
        return next(canUpdateError);
      }
      _object = await processor.updateObject(_object, _obj);
      req.response = {
        model: this.model,
        code: OK,
        message: this.lang.updated,
        value: _object,
      };
      // const postUpdate = await processor.postUpdateResponse(
      //   object,
      //   req.response
      // );
      // if (postUpdate) {
      //   req.response = Object.assign({}, req.response, postUpdate);
      // }
      return next();
    } catch (err) {
      return next(err);
    }
  };

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  status = async (req: Request, res: Response, next: NextFunction) => {
    let object = req.object;
    object.active = req.params['status'];
    try {
      req.response = {
        model: this.model,
        code: OK,
        message: this.lang.updated,
        value: await object.save(),
      };
      return next();
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
  delete = async (req: Request, res: Response, next: NextFunction) => {
    let object = req.object;
    try {
      const processor = this.model.getProcessor(this.model);
      let canDeleteError = await processor.validateDelete(object);
      if (!isEmpty(canDeleteError)) {
        return next(canDeleteError);
      }
      if (this.model.softDelete) {
        extend(object, { deleted: true });
        object = await object.save();
      } else {
        object = await object.remove();
      }
      req.response = {
        model: this.model,
        code: OK,
        value: { _id: object._id },
        message: this.lang.deleted,
      };
      // const postDelete = await processor.postDeleteResponse(object, {
      //   userId: req.userId,
      //   model: this.model.collection.collectionName,
      // });
      // if (postDelete) {
      //   req.response = Object.assign({}, req.response, postDelete);
      // }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export default AppController;
