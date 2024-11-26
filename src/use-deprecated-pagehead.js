const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Pagehead', 'PageheadProps'];
const fileName = 'Pagehead';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
