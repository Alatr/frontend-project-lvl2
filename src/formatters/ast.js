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

export const addKeyMessage = (key, obj1, obj2) => {
  if (_.isObject(obj2[key])) {
    return {
      name: key,
      value: 'complex',
      status: 'added',
      children: createASTObject(obj2[key], 'added'),
    };
  }

  return {
    name: key,
    value: obj2[key],
    status: 'added',
  };
};
/*  */
/*  */
export const deleteKeyMessage = (key, obj1) => {
  if (_.isObject(obj1[key])) {
    return {
      name: key,
      value: 'complex',
      status: 'removed',
      children: createASTObject(obj1[key], 'removed'),
    };
  }
  return {
    name: key,
    value: obj1[key],
    status: 'removed',
  };
};
/*  */
/*  */
function isJson(data) {
  const newData = data;
  try {
    JSON.parse(newData);
  } catch (e) {
    return false;
  }
  return true;
}
export const unchangeKeyMessage = (key, val) => {
  if (isJson(val)) {
    return {
      name: key,
      status: 'updated',
      value: 'complex',
      children: JSON.parse([val], null, '  '),
    };
  }

  return {
    name: key,
    status: 'unchanged',
    value: val,
  };
};
/*  */
/*  */

export const changeKeyMessage = (key, obj1, obj2) => ({
  name: key,
  status: 'updated',
  value: obj2[key],
  oldValue: (_.isObject(obj1[key])) ? createASTObject(obj1[key], 'removed') : obj1[key],
});
/*  */
/*  */

/*  */
export const printResultMessage = (lines) => JSON.stringify([...lines], null, '  ');

/*  */

export const getAcc = () => 1;
export const incrementAcc = (acc) => acc + 1;
