import stylish from './stylish.js';
import plain from './plain.js';

const json = (tree) => JSON.stringify(tree, null, '  ');

export default (diff, formatName = 'stylish') => {
  switch (formatName) {
    case 'stylish':
      return stylish(diff);
    case 'plain':
      return plain(diff);
    case 'json':
      return json(diff);
    default:
      throw new Error(`Unknown format: recived format name '${formatName}'.`);
  }
};
