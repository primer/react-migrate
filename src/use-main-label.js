const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = ['Label', 'LabelProps', 'LabelColorOptions'];
const draftsFileName = 'Label2';

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName);
};

module.exports = transform;
