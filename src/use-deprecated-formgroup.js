const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['FormGroup', 'FormGroupProps', 'FormGroupLabelProps'];
const fileName = 'FormGroup';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
