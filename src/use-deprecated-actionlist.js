const { SyntaxKind } = require('ts-morph');
const { convertToStringLiteral } = require('./utils');

const actionListImportNames = ['ActionList', 'ActionListProps', 'GroupProps', 'ItemProps'];

const updateImportDeclaration = (declaration, sourceFile) => {
  /**  import   { ... }      from     '....'
   *          importClause        moduleSpecifier
   */
  const moduleSpecifier = declaration.getModuleSpecifier().getText();

  // import ... from '@primer/react...'
  const isPrimerReact = moduleSpecifier.includes('@primer/react');
  if (!isPrimerReact) return declaration;

  // Skip imports of v2 components
  if (
    moduleSpecifier.includes('drafts') ||
    moduleSpecifier.includes('deprecated') ||
    moduleSpecifier.includes('ActionList2')
  ) {
    return declaration;
  }

  // import ... from '@primer/react/lib-esm/ActionList'
  if (moduleSpecifier.includes('lib-esm/ActionList')) {
    const newModuleSpecifier = moduleSpecifier.replace('lib-esm/ActionList', 'lib-esm/deprecated/ActionList');
    // have to remove quotes from string
    declaration.setModuleSpecifier(convertToStringLiteral(newModuleSpecifier));
    return declaration;
  } else if (moduleSpecifier.includes('lib/ActionList')) {
    const newModuleSpecifier = moduleSpecifier.replace('lib/ActionList', 'lib/deprecated/ActionList');
    declaration.setModuleSpecifier(convertToStringLiteral(newModuleSpecifier));
    return declaration;
  }

  const importClause = declaration.getImportClause();

  // import { ... } from '@primer/react'
  /**  import  {    ActionList, TextInput    } from '@primer/react'
   *                [    nameBindings   ]
   */
  const nameBindings = importClause.getNamedBindings();

  if (nameBindings) {
    // nameBindings is array of elements
    const elements = nameBindings.getElements();

    const actionListElements = elements.filter((element) => {
      const importName = element.getName();
      return actionListImportNames.includes(importName);
    });

    // no ActionList in this import, skip
    if (actionListElements.length === 0) return declaration;

    // there's only ActionList in this import
    if (elements.length === actionListElements.length) {
      declaration.setModuleSpecifier('@primer/react/deprecated');
      return declaration;
    }

    // mixed imports: import {ActionList, TextInput} from '@primer/react'
    // we need to split the import statement
    const actionListElementNames = actionListElements.map((element) => element.getName());
    const otherElementNames = elements
      .filter((element) => !actionListImportNames.includes(element.getName()))
      .map((element) => element.getName());

    // reset imports and add non-ActionList imports back
    declaration.removeNamedImports().addNamedImports(otherElementNames);

    // create new import declaration for ActionList on the next line
    sourceFile.insertImportDeclaration(declaration.getChildIndex() + 1, {
      moduleSpecifier: '@primer/react/deprecated',
      namedImports: actionListElementNames
    });
    return declaration;
  }

  // if there is an unhandled import statement that makes it till the end
  console.log('skipping unhandled import', declaration.getFullText());
  return declaration;
};

const transform = (project) => {
  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    try {
      sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
        declaration = updateImportDeclaration(declaration, sourceFile);
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
