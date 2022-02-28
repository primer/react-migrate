const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['ActionMenu', 'ActionMenuProps'];
const fileName = 'ActionMenu';
const v2FileNameToIgnore = 'ActionMenu2';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName, v2FileNameToIgnore);
};

module.exports = transform;
