const { convertToStringLiteral } = require('./string-literal');

const updateImportDeclaration = (
  declaration,
  sourceFile,
  componentImportNames,
  experimentalFileName,
  newFileName
) => {
  /**  import   { ... }      from     '....'
   *          importClause        moduleSpecifier
   */
  const moduleSpecifier = declaration.getModuleSpecifier().getText();

  // import ... from '@primer/react...'
  const isPrimerReact = moduleSpecifier.includes('@primer/react');
  if (!isPrimerReact) return declaration;

  // import ... from '@primer/react/lib-esm/*'
  if (
    moduleSpecifier.includes('lib-esm/experimental/' + experimentalFileName) ||
    moduleSpecifier.includes('lib/experimental/' + experimentalFileName) ||
    moduleSpecifier.includes('lib-esm/' + experimentalFileName) ||
    moduleSpecifier.includes('lib/' + experimentalFileName)
  ) {
    const newModuleSpecifier = moduleSpecifier
      .replace('lib-esm/experimental/', 'lib-esm/')
      .replace('lib/experimental/', 'lib/')
      .replace(experimentalFileName, newFileName);
    // have to remove quotes from string
    declaration.setModuleSpecifier(convertToStringLiteral(newModuleSpecifier));
    return declaration;
  }

  // if it isn't experimental, skip
  if (!moduleSpecifier.includes('experimental')) return declaration;

  const importClause = declaration.getImportClause();

  // import { ... } from '@primer/react/experimental'
  /**  import  {    PageLayout, Button, ActioLiist    } from '@primer/react'
   *                [          nameBindings      ]
   */
  const nameBindings = importClause.getNamedBindings();

  if (nameBindings) {
    // nameBindings is array of elements
    const elements = nameBindings.getElements();

    const componentElements = elements.filter((element) => {
      const importName = element.getName();
      return componentImportNames.includes(importName);
    });

    // if there are no componnent imports in this import, skip this import
    if (componentElements.length === 0) return declaration;

    // only experimental component in this import
    if (elements.length === componentElements.length) {
      declaration.setModuleSpecifier('@primer/react');
      return declaration;
    }

    // mixed imports: import {Button, TextInput} from '@primer/react'
    // we need to split the import statement
    const componentElementNames = componentElements.map((element) =>
      element.getName()
    );
    const otherElementNames = elements
      .filter((element) => !componentImportNames.includes(element.getName()))
      .map((element) => element.getFullText().trim());

    // reset imports and add non-deprecated imports back
    declaration.removeNamedImports().addNamedImports(otherElementNames);

    // create new import declaration for deprecated component on the next line
    sourceFile.insertImportDeclaration(declaration.getChildIndex() + 1, {
      moduleSpecifier: '@primer/react',
      namedImports: componentElementNames
    });
    return declaration;
  }

  // if there is an unhandled import statement that makes it till the end
  console.log('skipping unhandled import', declaration.getFullText());
  return declaration;
};

module.exports = updateImportDeclaration;
