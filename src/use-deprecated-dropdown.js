const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = [
  'Dropdown',
  'DropdownProps',
  'DropdownMenuProps',
  'DropdownItemProps',
  'DropdownButtonProps',
  'DropdownCaretProps'
];
const fileName = 'Dropdown';
const fileNameToIgnore = 'DropdownMenu'; // not the same component

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName, fileNameToIgnore);
};

module.exports = transform;
