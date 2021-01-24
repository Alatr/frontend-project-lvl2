import _ from 'lodash';

const createASTObject = (value, status) => {
  const iter = (currentValue) => {
    if (!_.isPlainObject(currentValue)) {
      return currentValue;
    }

    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => {
        const result = { name: key };
        if (_.isObject(val)) {
          result.value = 'complex';
          result.status = status;
          result.children = createASTObject(val, status);
        } else {
          result.value = iter(val, status);
          result.status = status;
        }

        return result;
      });

    return [...lines];
  };

  return iter(value);
};

export const addKeyMessage = (key, obj1, obj2) => {
  const result = { name: key };
  if (_.isObject(obj2[key])) {
    result.value = 'complex';
    result.status = 'added';
    result.children = createASTObject(obj2[key], 'added');
  } else {
    result.value = obj2[key];
    result.status = 'added';
  }

  return result;
};
/*  */
/*  */
export const deleteKeyMessage = (key, obj1) => {
  const result = { name: key };
  if (_.isObject(obj1[key])) {
    result.value = 'complex';
    result.status = 'removed';
    result.children = createASTObject(obj1[key], 'removed');
  } else {
    result.value = obj1[key];
    result.status = 'removed';
  }
  return result;
};
/*  */
/*  */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export const unchangeKeyMessage = (key, val) => {
  const result = { name: key };

  if (isJson(val)) {
    result.status = 'updated';
    result.value = 'complex';
    result.children = JSON.parse([val], null, '  ');
  } else {
    result.status = 'unchanged';
    result.value = val;
  }

  return result;
};
/*  */
/*  */

export const changeKeyMessage = (key, obj1, obj2) => {
  const result = {
    name: key,
    status: 'updated',
    value: obj2[key],
    oldValue: obj1[key],
  };

  if (_.isObject(obj1[key])) {
    result.oldValue = createASTObject(obj1[key], 'removed');
  }

  return result;
};
/*  */
/*  */

/*  */
export const printResultMessage = (lines) => JSON.stringify([...lines], null, '  ');

/*  */

export const getAcc = () => 1;
export const incrementAcc = (acc) => acc + 1;
