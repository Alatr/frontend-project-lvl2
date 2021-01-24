import _ from 'lodash';

/*  */
const stringifyJSON = (value, prevDepth = '', spacesCount = 2, replacer = '  ') => {
  const iter = (currentValue, depth) => {
    if (!_.isPlainObject(currentValue)) {
      return currentValue;
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `    ${prevDepth}${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${prevDepth}${bracketIndent}    }`,
    ].join('\n');
  };

  return iter(value, 1);
};

function getCurrentIndent(depth, spacesCount = 2, replacer = '  '){
  const indentSize = depth * spacesCount;
  return replacer.repeat(indentSize - spacesCount);
}

export const addKeyMessage = (key, obj1, obj2, depth) => {
  const indent = getCurrentIndent(depth);

  return `  ${indent}+ ${key}: ${_.isPlainObject(obj2[key]) ? stringifyJSON(obj2[key], indent) : obj2[key]}`;
};
/*  */
/*  */
export const deleteKeyMessage = (key, obj1, obj2, depth) => {
  const indent = getCurrentIndent(depth);

  return `  ${indent}- ${key}: ${_.isPlainObject(obj1[key]) ? stringifyJSON(obj1[key], indent) : obj1[key]}`;
};
/*  */
/*  */
export const unchangeKeyMessage = (key, val, depth) => {
  const indent = getCurrentIndent(depth);

  return `  ${indent}  ${key}: ${val}`;
};
/*  */
/*  */
export const changeKeyMessage = (key, obj1, obj2, indent) => [
  deleteKeyMessage(key, obj1, obj2, indent), addKeyMessage(key, obj1, obj2, indent)];
/*  */
/*  */

/*  */
export const printResultMessage = (lines, depth) => {
  const bracketIndent = getCurrentIndent(depth);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

export const getAcc = () => 1;
export const incrementAcc = (acc) => acc + 1;
