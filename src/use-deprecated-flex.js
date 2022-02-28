const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Flex', 'FlexProps'];
const fileName = 'Flex';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
