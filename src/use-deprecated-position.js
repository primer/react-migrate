const deprecateComponent = require('./utils/deprecate-component');

const componentImportNames = [
  'Position',
  'PositionProps',
  'Absolute',
  'AbsoluteProps',
  'Fixed',
  'FixedProps',
  'Relative',
  'RelativeProps',
  'Sticky',
  'StickyProps'
];
const fileName = 'Position';

const transform = (project) => {
  deprecateComponent(project, componentImportNames, fileName);
};

module.exports = transform;
