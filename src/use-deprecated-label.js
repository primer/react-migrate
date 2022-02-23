const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-import-to-deprecated');

const componentImportNames = ['Label', 'LabelProps'];
const fileName = 'Label';
const v2FileNameToIgnore = 'Label2';

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
