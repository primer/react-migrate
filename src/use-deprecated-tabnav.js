const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['TabNav', 'TabNavProps', 'TabNavLinkProps'];
const fileName = 'TabNav';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
