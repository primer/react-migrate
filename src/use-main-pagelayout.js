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
const newFileName = 'PageLayout'; // same as old name :)

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName, newFileName);
};

module.exports = transform;
