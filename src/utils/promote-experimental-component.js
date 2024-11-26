const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./change-experimental-import-to-main');

const promoteExperimentalComponent = (
  project,
  componentImportNames,
  experimentalFileName,
  newFileName
) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile
        .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
        .forEach((declaration) => {
          declaration = updateImportDeclaration(
            declaration,
            sourceFile,
            componentImportNames,
            experimentalFileName,
            newFileName
          );
        });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = promoteExperimentalComponent;
