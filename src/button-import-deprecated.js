const { SyntaxKind } = require('ts-morph');
const { convertToStringLiteral } = require('./utils');

const buttonImportNames = [
  'Button',
  'ButtonProps',
  'ButtonDanger',
  'ButtonDangerProps',
  'ButtonGroup',
  'ButtonGroupProps',
  'ButtonOutline',
  'ButtonOutlineProps',
  'ButtonPrimary',
  'ButtonPrimaryProps',
  'ButtonInvisible',
  'ButtonInvisibleProps',
  'ButtonTableList',
  'ButtonTableListProps',
  'ButtonClose',
  'ButtonCloseProps'
];

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
    moduleSpecifier.includes('Button2')
  ) {
    return declaration;
  }

  // import ... from '@primer/react/lib-esm/Button'
  if (moduleSpecifier.includes('lib-esm/Button')) {
    const newModuleSpecifier = moduleSpecifier.replace('lib-esm/Button', 'lib-esm/deprecated/Button');
    // have to remove quotes from string
    declaration.setModuleSpecifier(convertToStringLiteral(newModuleSpecifier));
    return declaration;
  } else if (moduleSpecifier.includes('lib/Button')) {
    const newModuleSpecifier = moduleSpecifier.replace('lib/Button', 'lib/deprecated/Button');
    declaration.setModuleSpecifier(convertToStringLiteral(newModuleSpecifier));
    return declaration;
  }

  const importClause = declaration.getImportClause();

  // import { ... } from '@primer/react'
  /**  import  {    Button, ButtonPrimary, TextInput    } from '@primer/react'
   *                [          nameBindings        ]
   */
  const nameBindings = importClause.getNamedBindings();

  if (nameBindings) {
    // nameBindings is array of elements
    const elements = nameBindings.getElements();

    const buttonElements = elements.filter((element) => {
      const importName = element.getName();
      return buttonImportNames.includes(importName);
    });

    // no Buttons in this import, skip
    if (buttonElements.length === 0) return declaration;

    // there's only Buttons in this import
    if (elements.length === buttonElements.length) {
      declaration.setModuleSpecifier('@primer/react/deprecated');
      return declaration;
    }

    // mixed imports: import {Button, TextInput} from '@primer/react'
    // we need to split the import statement
    const buttonElementNames = buttonElements.map((element) => element.getName());
    const otherElementNames = elements
      .filter((element) => !buttonImportNames.includes(element.getName()))
      .map((element) => element.getName());

    // reset imports and add non-Button imports back
    declaration.removeNamedImports().addNamedImports(otherElementNames);

    // create new import declaration for Button on the next line
    sourceFile.insertImportDeclaration(declaration.getChildIndex() + 1, {
      moduleSpecifier: 'primer/react/deprecated',
      namedImports: buttonElementNames
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
        declaration = updateImportDeclaration(declaration, sourceFile, 'Button', 'Button2');
      });

      // save source back to file
      sourceFile.saveSync();
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = transform;
