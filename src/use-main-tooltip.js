const promoteExperimentalComponent = require('./utils/promote-experimental-component');
const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = ['Tooltip', 'TooltipProps'];
const experimentalFileName = 'TooltipV2';
const newFileName = 'TooltipV2';

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
