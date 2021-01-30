import _ from 'lodash';

function printFormatedResult(object, label = '[complex value]') {
  if (_.isPlainObject(object)) return label;

  return (_.isString(object)) ? `'${object}'` : object;
}

export default (tree) => {
  const iter = (nodes, path) => {
    const lines = nodes.map(({
      status, key, children, value, oldValue,
    }) => {
      switch (status) {
        case 'added': {
          return `Property '${path}${key}' was added with value: ${printFormatedResult(value)}`;
        }

        case 'removed': {
          return `Property '${path}${key}' was removed`;
        }

        case 'updated': {
          return `Property '${path}${key}' was updated. From ${printFormatedResult(oldValue)} to ${printFormatedResult(value)}`;
        }

        case 'nested': {
          return `${iter(children, `${path}${key}.`)}`;
        }
        case 'unchanged': {
          return [];
        }

        default:
          throw new Error(`Unknown status change ${status}`);
      }
    });
    const flatenLines = lines.flatMap((line) => line);
    return [...flatenLines].join('\n');
  };
  return iter(tree, '');
};
