import config from 'config';
import { each } from 'lodash';

const language = config.get('api.lang');
/**
 * @param {Object}  prop
 * @return {Object} return property
 */
function get(this: Record<string, any>, prop: string) {
  if (this.hasOwnProperty(prop)) return this[prop];
  else throw new Error(`There's no property defined as ${prop} in your translations`);
}

const lang: Record<string, any> = {
  get
};

let obj = require(`./${language}.ts`).default;
each(Object.getOwnPropertyNames(obj), (property) => {
  const prop = property;
  lang[prop] = Object.assign({}, obj[prop], {get});
});

export default lang;
