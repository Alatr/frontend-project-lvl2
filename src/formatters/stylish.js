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

const printFormatedResult = (value, indent) => ((_.isPlainObject(value))
  ? stringifyJSON(value, indent)
  : value);

export default (tree) => {
  const spacesCount = 2;

  const iter = (nodes, depth) => {
    const indentSize = depth * spacesCount;
    const indent = '  '.repeat(indentSize - spacesCount);

    const leafNodes = nodes.flatMap(({
      status, key, children, value, oldValue,
    }) => {
      switch (status) {
        case 'added': {
          return `  ${indent}+ ${key}: ${printFormatedResult(value, indent)}`;
        }

        case 'removed': {
          return `  ${indent}- ${key}: ${printFormatedResult(value, indent)}`;
        }

        case 'unchanged': {
          return `  ${indent}  ${key}: ${printFormatedResult(value, indent)}`;
        }

        case 'updated': {
          return [`  ${indent}- ${key}: ${printFormatedResult(oldValue, indent)}`,
            `  ${indent}+ ${key}: ${printFormatedResult(value, indent)}`];
        }

        case 'nested': {
          return `  ${indent}  ${key}: ${iter(children, depth + 1)}`;
        }

        default:
          throw new Error(`Unknown status change ${status}`);
      }
    });

    return [
      '{',
      ...leafNodes,
      `${indent}}`,
    ].join('\n');
  };
  return iter(tree, 1);
};
