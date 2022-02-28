const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = [
  'ActionMenu',
  'ActionMenuProps',
  'ActionMenuButtonProps',
  'ActionMenuAnchorProps',
  'ActionMenuOverlayProps'
];
const draftsFileName = 'ActionMenu2';

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName);
};

module.exports = transform;
