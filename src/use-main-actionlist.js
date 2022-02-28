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

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName);
};

module.exports = transform;
