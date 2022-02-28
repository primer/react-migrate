const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = [
  'Button',
  'ButtonProps',
  'ButtonDanger',
  'ButtonDangerProps',
  'ButtonGroup',
  'ButtonGroupProps',
  'ButtonOutline',
  'ButtonOutlineProps',
  'ButtonPrimary',
  'ButtonPrimaryProps',
  'ButtonInvisible',
  'ButtonInvisibleProps',
  'ButtonTableList',
  'ButtonTableListProps',
  'ButtonClose',
  'ButtonCloseProps'
];

const fileName = 'Button';
const v2FileNameToIgnore = 'Button2';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName, v2FileNameToIgnore);
};

module.exports = transform;
