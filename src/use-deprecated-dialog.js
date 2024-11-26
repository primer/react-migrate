const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Dialog', 'DialogProps, DialogHeaderProps'];
const fileName = 'Dialog';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
