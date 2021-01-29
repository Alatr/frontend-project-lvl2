import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './ast.js';

const formaters = { stylish, plain, json };

export default function getFormat(formatName = 'stylish') {
  if (!_.has(formaters, formatName)) {
    throw new Error(`Unknown format: recived format name '${formatName}'.`);
  }
  return formaters[formatName];
}
