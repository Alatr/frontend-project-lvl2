import _ from 'lodash';

const stringify = (value, prevDepth = 1) => {
  const iter = (currentValue, depth) => {
    if (!_.isPlainObject(currentValue)) {
      return currentValue;
    }

    const replacer = '  ';
    const spacesCount = 2;
    const indentSize = (depth) * spacesCount;
    const currentIndent = replacer.repeat(indentSize + spacesCount);
    const bracketIndent = replacer.repeat(indentSize);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, prevDepth);
};

const printValue = (value, indent) => ((_.isPlainObject(value))
  ? stringify(value, indent)
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
          return `${currentIndent}+ ${key}: ${printValue(value, depth)}`;
        }

        case 'removed': {
          return `${currentIndent}- ${key}: ${printValue(value, depth)}`;
        }

        case 'unchanged': {
          return `${currentIndent}  ${key}: ${printValue(value, depth)}`;
        }

        case 'updated': {
          return [`${currentIndent}- ${key}: ${printValue(oldValue, depth)}`,
            `${currentIndent}+ ${key}: ${printValue(value, depth)}`];
        }

        case 'nested': {
          return `${currentIndent}  ${key}: ${iter(children, depth + 1)}`;
        }

        default:
          throw new Error(`Unknown status ${status}`);
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
