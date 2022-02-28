const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['InputField', 'InputFieldComponentProps'];
const fileName = 'InputField';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
