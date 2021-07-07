import config from 'config';
import each from 'lodash/each';
import { T } from '../rest/types';

const language = config.get('api.lang');
/**
 * @param {Object}  prop
 * @return {Object} return property
 */
function get(this: T, prop: string) {
  if (this.hasOwnProperty(prop)) return this[prop];
  else
    throw new Error(
      `There's no property defined as ${prop} in your translations`
    );
}

const lang: T = {
  get,
};

let obj = require(`./${language}.ts`).default;
each(Object.getOwnPropertyNames(obj), (property) => {
  const prop = property;
  lang[prop] = Object.assign({}, obj[prop], { get });
});

export default lang;
