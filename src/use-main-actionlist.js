const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-drafts-import-to-main');

const componentImportNames = [
  'ActionList',
  'ActionListProps',
  'ActionListGroupProps',
  'ActionListItemProps',
  'ActionListDescriptionProps',
  'ActionListLeadingVisualProps',
  'ActionListTrailingVisualProps'
];
const draftsFileName = 'ActionList2';

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(declaration, sourceFile, componentImportNames, draftsFileName);
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
