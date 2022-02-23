const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-import-to-deprecated');

const componentImportNames = [
  'Dropdown',
  'DropdownProps',
  'DropdownMenuProps',
  'DropdownItemProps',
  'DropdownButtonProps',
  'DropdownCaretProps'
];
const fileName = 'Dropdown';
const fileNameToIgnore = 'DropdownMenu'; // not the same component

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(
          declaration,
          sourceFile,
          componentImportNames,
          fileName,
          fileNameToIgnore
        );
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
