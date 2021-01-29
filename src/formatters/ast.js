import _ from 'lodash';

const createASTObject = (value, status) => {
  const iter = (currentValue) => {
    if (!_.isPlainObject(currentValue)) {
      return currentValue;
    }

    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => {
        if (_.isObject(val)) {
          return {
            name: key,
            value: 'complex',
            status,
            children: createASTObject(val, status),
          };
        }
        return {
          name: key,
          value: iter(val, status),
          status,
        };
      });

    return [...lines];
  };

  return iter(value);
};

export default (tree) => {
  const iter = (items) => {
    const lines = items.map((object) => {
      switch (object.status) {
        case 'added': {
          if (_.isObject(object.value)) {
            return {
              name: object.key,
              value: 'complex',
              status: 'added',
              children: createASTObject(object.value, 'added'),
            };
          }

          return {
            name: object.key,
            value: object.value,
            status: 'added',
          };
        }

        case 'removed': {
          if (_.isObject(object.value)) {
            return {
              name: object.key,
              value: 'complex',
              status: 'removed',
              children: createASTObject(object.value, 'removed'),
            };
          }
          return {
            name: object.key,
            value: object.value,
            status: 'removed',
          };
        }

        case 'updated': {
          return {
            name: object.key,
            status: 'updated',
            value: object.value,
            oldValue: (_.isObject(object.oldValue)) ? createASTObject(object.oldValue, 'removed') : object.oldValue,
          };
        }

        case 'nested': {
          return {
            name: object.key,
            status: 'updated',
            value: 'complex',
            children: iter(object.children),
          };
        }
        case 'unchanged': {
          return {
            name: object.key,
            status: 'unchanged',
            value: object.value,
          };
        }

        default:
          throw new Error(`Unknown status change ${object.status}`);
      }
    });

    return [...lines];
  };
  return JSON.stringify(iter(tree), null, '  ');
};
