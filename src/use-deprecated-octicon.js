const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Octicon', 'OcticonProps'];
const fileName = 'Octicon';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
