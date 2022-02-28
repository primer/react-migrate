const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Label', 'LabelProps'];
const fileName = 'Label';
const v2FileNameToIgnore = 'Label2';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName, v2FileNameToIgnore);
};

module.exports = transform;
