const promoteDraftsComponent = require('./utils/promote-drafts-component');

const componentImportNames = ['Button', 'ButtonProps', 'IconButton', 'IconButtonProps', 'LinkButton'];
const draftsFileName = 'Button2';
const newFileName = 'Button';

const transform = (project) => {
  declaration = promoteDraftsComponent(project, componentImportNames, draftsFileName, newFileName);
};

module.exports = transform;
