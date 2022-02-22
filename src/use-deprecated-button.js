const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-import-to-deprecated');

const buttonImportNames = [
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

const ignoreNewModuleSpecifier = 'Button2';

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(declaration, sourceFile, buttonImportNames, ignoreNewModuleSpecifier);
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
