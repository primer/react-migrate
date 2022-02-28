const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./change-drafts-import-to-main');

const promoteDraftsComponent = (project, componentImportNames, draftsFileName) => {
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

module.exports = promoteDraftsComponent;
