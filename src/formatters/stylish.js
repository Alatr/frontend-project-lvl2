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
  const replacer = '  ';

  const iter = (nodes, depth) => {
    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize - 1);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);

    const lines = nodes.flatMap(({
      status, key, children, value, oldValue,
    }) => {
      switch (status) {
        case 'added': {
          return `${currentIndent}+ ${key}: ${printFormatedResult(value, bracketIndent)}`;
        }

        case 'removed': {
          return `${currentIndent}- ${key}: ${printFormatedResult(value, bracketIndent)}`;
        }

        case 'unchanged': {
          return `${currentIndent}  ${key}: ${printFormatedResult(value, bracketIndent)}`;
        }

        case 'updated': {
          return [`${currentIndent}- ${key}: ${printFormatedResult(oldValue, bracketIndent)}`,
            `${currentIndent}+ ${key}: ${printFormatedResult(value, bracketIndent)}`];
        }

        case 'nested': {
          return `${currentIndent}  ${key}: ${iter(children, depth + 1)}`;
        }

        default:
          throw new Error(`Unknown status change ${status}`);
      }
    });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(tree, 1);
};
