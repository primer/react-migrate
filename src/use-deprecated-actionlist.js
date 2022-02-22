const { SyntaxKind } = require('ts-morph');
const updateImportDeclaration = require('./utils/change-import-to-deprecated');

const actionListImportNames = ['ActionList', 'ActionListProps', 'GroupProps', 'ItemProps'];

const ignoreNewModuleSpecifier = 'ActionList2';

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(declaration, sourceFile, actionListImportNames, ignoreNewModuleSpecifier);
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
