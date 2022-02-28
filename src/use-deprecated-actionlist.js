const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['ActionList', 'ActionListProps', 'GroupProps', 'ItemProps'];
const fileName = 'ActionList';
const v2FileNameToIgnore = 'ActionList2';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName, v2FileNameToIgnore);
};

module.exports = transform;
