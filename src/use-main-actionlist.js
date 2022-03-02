const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = [
  'ActionList',
  'ActionListProps',
  'ActionListGroupProps',
  'ActionListItemProps',
  'ActionListDescriptionProps',
  'ActionListLeadingVisualProps',
  'ActionListTrailingVisualProps'
];
const draftsFileName = 'ActionList2';
const newFileName = 'ActionList';

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName, newFileName);
};

module.exports = transform;
