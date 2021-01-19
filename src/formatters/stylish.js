export const addMessage = (key, obj1, obj2, indent) => `${indent}+ ${key}: ${obj2[key]}`
export const deleteMessage = (key, obj1, obj2, indent) => `${indent}- ${key}: ${obj1[key]}`
export const changeMessage = (key, obj1, obj2, indent) => [deleteMessage(key, obj1, obj2, indent), addMessage(key, obj1, obj2, indent)]
export const unchangeMessage = (key, obj1, obj2, indent) => `${indent}  ${key}: ${obj2[key]}`