import yaml from 'js-yaml';

export default (content, type) => {
  switch (type) {
    case 'json':
      return JSON.parse(content);
    case 'yml':
    case 'yaml':
      return yaml.load(content);
    default:
      throw new Error(`Unknown extension ${type}`);
  }
};
