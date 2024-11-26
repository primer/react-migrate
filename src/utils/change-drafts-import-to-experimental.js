const { convertToStringLiteral } = require('./string-literal');

const updateImportDeclaration = (declaration) => {
  /**  import   { ... }      from     '....'
   *          importClause        moduleSpecifier
   */
  const moduleSpecifier = declaration.getModuleSpecifier().getText();

  // import { ... } from '@primer/react/drafts'
  /**  import  {    PageLayout, Button, ActioLiist    } from '@primer/react/drafts'
   *                [          nameBindings      ]
   */
  if (moduleSpecifier === '@primer/react/drafts') {
    declaration.setModuleSpecifier('@primer/react/experimental');
    return declaration;
  }

  // import ... from '@primer/react/lib-esm/*'
  if (
    moduleSpecifier.includes('lib-esm/drafts/') ||
    moduleSpecifier.includes('lib/drafts/')
  ) {
    const newModuleSpecifier = moduleSpecifier
      .replace('lib-esm/drafts/', 'lib-esm/experimental/')
      .replace('lib/drafts/', 'lib/experimental/');

    // have to remove quotes from string
    declaration.setModuleSpecifier(convertToStringLiteral(newModuleSpecifier));
    return declaration;
  }
};

module.exports = updateImportDeclaration;
