import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const formaters = { stylish, plain };

export default function getFormat(formatName){
  if (!_.has(formaters, formatName)) {
    throw new Error(`Unknown format: recived format name '${formatName}'.`);
  }
  return formaters[formatName];
}


const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    // if (typeof currentValue !== 'object') {
    //   return currentValue.toString();
    // }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, 1);
};