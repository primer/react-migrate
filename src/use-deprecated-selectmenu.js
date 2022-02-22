const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-import-to-deprecated');

const componentImportNames = [
  'SelectMenu',
  'SelectMenuProps',
  'SelectMenuDividerProps',
  'SelectMenuFilterProps',
  'SelectMenuFooterProps',
  'SelectMenuItemProps',
  'SelectMenuListProps',
  'SelectMenuModalProps',
  'SelectMenuTabsProps',
  'SelectMenuHeaderProps',
  'SelectMenuTabProps',
  'SelectMenuTabPanelProps',
  'SelectMenuLoadingAnimationProps'
];

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(declaration, sourceFile, componentImportNames);
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
