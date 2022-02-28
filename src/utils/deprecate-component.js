const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./change-import-to-deprecated');

const deprecateComponent = (project, componentImportNames, fileName, v2FileNameToIgnore) => {
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

module.exports = deprecateComponent;
