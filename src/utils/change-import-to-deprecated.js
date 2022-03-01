const { convertToStringLiteral } = require('./string-literal');

const updateImportDeclaration = (
  declaration,
  sourceFile,
  componentImportNames,
  fileName,
  v2FileNameToIgnore = null
) => {
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
    moduleSpecifier.includes(v2FileNameToIgnore)
  ) {
    return declaration;
  }

  // import ... from '@primer/react/lib-esm/*'
  if (moduleSpecifier.includes('lib-esm/' + fileName) || moduleSpecifier.includes('lib/' + fileName)) {
    declaration.setModuleSpecifier(getUpdatedModuleSpecifier(moduleSpecifier));
    return declaration;
  } else if (moduleSpecifier.includes('lib-esm/') || moduleSpecifier.includes('lib/' + fileName)) {
    return declaration; // skip different component from lib-esm
  }

  /**
   * import {   ...    } from '@primer/react'
   *        importClause
   */
  const importClause = declaration.getImportClause();

  /**
   * import { ButtonPrimary, ButtonDanger } from '@primer/react/lib-esm/Button'
   *          [      namedBindings      ]
   */
  const namedBindings = importClause.getNamedBindings();

  if (namedBindings) {
    // namedBindings is array of elements
    const elements = namedBindings.getElements();

    const componentElements = elements.filter((element) => {
      const importName = element.getName();
      return componentImportNames.includes(importName);
    });

    // if there are no componnent imports in this import, skip this import
    if (componentElements.length === 0) return declaration;

    // only deprecated component in this import
    if (elements.length === componentElements.length) {
      declaration.setModuleSpecifier(getUpdatedModuleSpecifier(moduleSpecifier));
      return declaration;
    }

    // mixed imports: import {Button, TextInput} from '@primer/react'
    // we need to split the import statement
    const componentElementNames = componentElements.map((element) => element.getName());
    const otherElementNames = elements
      .filter((element) => !componentImportNames.includes(element.getName()))
      .map((element) => element.getName());

    // reset imports and add non-deprecated imports back
    declaration.removeNamedImports().addNamedImports(otherElementNames);

    // create new import declaration for deprecated component on the next line

    sourceFile.insertImportDeclaration(declaration.getChildIndex() + 1, {
      moduleSpecifier: getUpdatedModuleSpecifier(moduleSpecifier),
      namedImports: componentElementNames
    });
    return declaration;
  }

  // if there is an unhandled import statement that makes it till the end
  console.log('skipping unhandled declaration:', declaration.getFullText());
  return declaration;
};

module.exports = updateImportDeclaration;

const getUpdatedModuleSpecifier = (currentModuleSpecifier) => {
  let newModuleSpecifier;

  if (currentModuleSpecifier === `'@primer/react'`) newModuleSpecifier = '@primer/react/deprecated';
  else if (currentModuleSpecifier.includes('lib-esm/') || currentModuleSpecifier.includes('lib/')) {
    newModuleSpecifier = currentModuleSpecifier
      .replace('lib-esm/', 'lib-esm/deprecated/')
      .replace('lib/', 'lib/deprecated/');
  }

  // have to remove quotes from string
  return convertToStringLiteral(newModuleSpecifier);
};
