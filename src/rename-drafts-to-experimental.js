const { SyntaxKind } = require('ts-morph');
const changeDraftsImportToExperimental = require('./utils/change-drafts-import-to-experimental');

const renameDraftsToExperimental = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile
        .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
        .forEach((declaration) => {
          declaration = changeDraftsImportToExperimental(declaration);
        });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = renameDraftsToExperimental;
