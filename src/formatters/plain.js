import _ from 'lodash';

function createObjectLabel(object, label = '[complex value]') {
  return `${_.isPlainObject(object) ? label : object}`;
}
function createQuotesAroundString(object) {
  return (_.isString(object)) ? `'${object}'` : object;
}

export default (tree) => {
  const iter = (items, path) => {
    const lines = items.map((object) => {
      switch (object.status) {
        case 'added': {
          const value = createQuotesAroundString(object.value);
          return `Property '${path}${object.key}' was added with value: ${createObjectLabel(value)}`;
        }

        case 'removed': {
          return `Property '${path}${object.key}' was removed`;
        }

        case 'updated': {
          const oldValue = createQuotesAroundString(object.oldValue);
          const newValue = createQuotesAroundString(object.value);

          return `Property '${path}${object.key}' was updated. From ${createObjectLabel(oldValue)} to ${createObjectLabel(newValue)}`;
        }

        case 'unchanged': {
          const isHasChildren = _.has(object, 'children');
          if (isHasChildren) {
            return `${iter(object.children, `${path}${object.key}.`)}`;
          }
          return [];
        }

        default:
          throw new Error(`Unknown status change ${object.status}`);
      }
    });
    const flatenLines = lines.flatMap((line) => line);
    return [...flatenLines].join('\n');
  };
  return iter(tree, '');
};
