const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = [
  'ActionMenu',
  'ActionMenuProps',
  'ActionMenuButtonProps',
  'ActionMenuAnchorProps',
  'ActionMenuOverlayProps'
];
const draftsFileName = 'ActionMenu2';
const newFileName = 'ActionMenu';

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName, newFileName);
};

module.exports = transform;
