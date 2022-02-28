const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = ['BorderBox', 'BorderBoxProps'];
const fileName = 'BorderBox';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
