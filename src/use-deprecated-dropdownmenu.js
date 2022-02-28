const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['DropdownMenu', 'DropdownMenuProps'];
const fileName = 'DropdownMenu';
const v2FileNameToIgnore = 'DropdownMenu2';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName, v2FileNameToIgnore);
};

module.exports = transform;
