const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-import-to-deprecated');

const actionListImportNames = ['DropdownMenu', 'DropdownMenuProps'];
const fileName = 'DropdownMenu';
const v2FileNameToIgnore = 'DropdownMenu2';

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(
          declaration,
          sourceFile,
          actionListImportNames,
          fileName,
          v2FileNameToIgnore
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
