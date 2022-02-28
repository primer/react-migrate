const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Grid', 'GridProps'];
const fileName = 'Grid';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
