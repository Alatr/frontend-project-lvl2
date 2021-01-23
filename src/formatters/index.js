import _ from 'lodash';
import * as stylish from './stylish.js';
import * as plain from './plain.js';
import * as json from './ast.js';

const formaters = { stylish, plain, json };

export default function getFormat(formatName) {
  if (!_.has(formaters, formatName)) {
    throw new Error(`Unknown format: recived format name '${formatName}'.`);
  }
  return formaters[formatName];
}
