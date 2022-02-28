const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = [
  'SelectMenu',
  'SelectMenuProps',
  'SelectMenuDividerProps',
  'SelectMenuFilterProps',
  'SelectMenuFooterProps',
  'SelectMenuItemProps',
  'SelectMenuListProps',
  'SelectMenuModalProps',
  'SelectMenuTabsProps',
  'SelectMenuHeaderProps',
  'SelectMenuTabProps',
  'SelectMenuTabPanelProps',
  'SelectMenuLoadingAnimationProps'
];
const fileName = 'SelectMenu';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
