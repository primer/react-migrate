const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = [
  'PageLayout',
  'PageLayoutProps',
  'PageLayoutHeaderProps',
  'PageLayoutContentProps',
  'PageLayoutPaneProps',
  'PageLayoutFooterProps'
];
const draftsFileName = 'PageLayout';

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName);
};

module.exports = transform;
