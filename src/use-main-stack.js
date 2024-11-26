const promoteExperimentalComponent = require('./utils/promote-experimental-component');
const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = ['Stack', 'StackProps', 'StackItemProps'];
const experimentalFileName = 'Stack';
const newFileName = 'Stack';

const transform = (project) => {
  declaration = promoteExperimentalComponent(
    project,
    componentImportNames,
    experimentalFileName,
    newFileName
  );

  // for backward compatibility with drafts, don't need this after v37
  declaration = promoteDraftsComponent(
    project,
    componentImportNames,
    experimentalFileName,
    newFileName
  );
};

module.exports = transform;
