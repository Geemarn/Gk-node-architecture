import { assignIn, omit, isString, isObject } from 'lodash';

export class QueryParser {
  _query: Record<string, any>;
  _all: Record<string, any>;
  _sort: string | Record<string, any> | any;
  _population: string | never[] | undefined;
  _search: Record<string, any> | undefined;

  /**
   * @constructor
   * @param {Object} query This is a query object of the request
   */
  constructor(query: Record<string, any>) {
    this._query = { ...query };
    //call initialize on load
    this._all = query.all;
    this._sort = query.sort;
    if (query.population) {
      this._population = query.population;
    }
    if (query.search) {
      this._search = query.search;
    }

    const excluded = [
      'perPage',
      'page',
      'limit',
      'sort',
      'all',
      'population',
      'search',
    ];
    // omit special query string keys from query before passing down to the model for filtering
    this._query = omit(this._query, ...excluded);
    // Only get collection that has not been virtually deleted.
    assignIn(this._query, { deleted: false });

    Object.assign(this, this._query);
  }

  /**
   * @return {Object} get the parsed query (_query)
   */
  get query() {
    return this._query;
  }

  /**
   * @param {Object} query set the parsed query (_query)
   */
  set query(query) {
    this._query = query;
  }

  /**
   * @return {Object} get the parsed query
   */
  get search() {
    return this._search;
  }

  /**
   * @return {Object} get the population object for query
   */
  get population() {
    if (this._population) {
      return this._population;
    }
    return [];
  }

  /**
   * @param {Object} value is the population object
   */
  set population(value) {
    this._population = value;
    if (!isObject(value)) {
      try {
        this._population = JSON.parse(value.toString());
      } catch (e) {
        console.log(e);
      }
    }
  }

  /**
   * when String i.e ?sort=name it is sorted by name ascending order
   * when Object ?sort[name]=desc {name: 'desc'} it is sorted by name descending order
   * when Object ?sort[name]=desc,sort[age]=asc {name: 'desc', age: 'asc'} it is sorted by name desc and age asc order
   *
   * @return {Object} get the sort property
   */
  get sort() {
    if (this._sort) {
      if (!isObject(this._sort)) {
        try {
          this._sort = JSON.parse(this._sort);
        } catch (e) {
          return { [this._sort]: 1 };
        }
      }
      for (const [column, direction] of Object.entries(this._sort)) {
        if (isString(direction))
          this._sort[column] = direction.toLowerCase() === 'asc' ? 1 : -1;
      }
      return this._sort;
    }
    return { createdAt: -1 };
  }

  /**
   * @return {Boolean} get the value for all data request
   */
  get getAll() {
    return this._all;
  }
}
