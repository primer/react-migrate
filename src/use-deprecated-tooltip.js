const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['Tooltip', 'TooltipProps'];
const fileName = 'Tooltip';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
