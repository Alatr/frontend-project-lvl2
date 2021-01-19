export const addMessage = (key, obj1, obj2, indent) => `${indent}+ ${key}: ${_.isPlainObject(obj2[key]) ? stringifyJSON(obj2[key]) : obj2[key]}`
