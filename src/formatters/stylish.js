import _ from 'lodash';

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

function getCurrentIndent(depth, spacesCount = 2, replacer = '  ') {
  const indentSize = depth * spacesCount;
  return replacer.repeat(indentSize - spacesCount);
}

export default (tree) => {
  const iter = (items, depth) => {
    const indent = getCurrentIndent(depth);
    const lines = items.map((object) => {
      const value = (_.isPlainObject(object.value))
        ? stringifyJSON(object.value, indent)
        : object.value;

      switch (object.status) {
        case 'added': {
          return `  ${indent}+ ${object.key}: ${value}`;
        }

        case 'removed': {
          return `  ${indent}- ${object.key}: ${value}`;
        }

        case 'updated': {
          const oldValue = (_.isPlainObject(object.oldValue))
            ? stringifyJSON(object.oldValue, indent)
            : object.oldValue;
          return [`  ${indent}- ${object.key}: ${oldValue}`, `  ${indent}+ ${object.key}: ${value}`];
        }

        case 'unchanged': {
          const isHasChildren = _.has(object, 'children');
          return `  ${indent}  ${object.key}: ${isHasChildren ? iter(object.children, depth + 1) : value}`;
        }

        default:
          throw new Error(`Unknown status change ${object.status}`);
      }
    });
    const flatenLines = lines.flatMap((line) => line);

    return [
      '{',
      ...flatenLines,
      `${indent}}`,
    ].join('\n');
  };
  return iter(tree, 1);
};
