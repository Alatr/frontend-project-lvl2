import _ from 'lodash';

function printValue(value) {
  if (_.isObject(value)) return '[complex value]';

  return (_.isString(value)) ? `'${value}'` : value;
}

export default (tree) => {
  const iter = (nodes, path) => {
    const lines = nodes.flatMap(({
      status, key, children, value, oldValue,
    }) => {
      switch (status) {
        case 'added': {
          return `Property '${path}${key}' was added with value: ${printValue(value)}`;
        }

        case 'removed': {
          return `Property '${path}${key}' was removed`;
        }

        case 'updated': {
          return `Property '${path}${key}' was updated. From ${printValue(oldValue)} to ${printValue(value)}`;
        }

        case 'nested': {
          return `${iter(children, `${path}${key}.`)}`;
        }
        case 'unchanged': {
          return [];
        }

        default:
          throw new Error(`Unknown status ${status}`);
      }
    });
    return [...lines].join('\n');
  };
  return iter(tree, '');
};
