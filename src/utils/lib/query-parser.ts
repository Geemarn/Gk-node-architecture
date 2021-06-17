import {assignIn, omit, isString, isObject} from 'lodash';

class QueryParser {
   _query: Record<string, any>;
   _all: Record<string, any>;
   _sort: Record<string, any>;
   population: Record<string, any> | undefined;
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
      this.population = query.population;
    }
    if (query.search) {
      this._search = query.search;
    }

    const excluded = [
      'perPage', 'page', 'limit', 'sort', 'all',
      'population', 'search'
    ];
    // omit special query string keys from query before passing down to the model for filtering
    this._query = omit(this._query, ...excluded);
    // Only get collection that has not been virtually deleted.
    assignIn(this._query, {deleted: false});
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

}

export default QueryParser;
