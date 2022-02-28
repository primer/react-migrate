const { SyntaxKind } = require('ts-morph');
const createProject = require('../src/utils/create-project');
const updateImportDeclaration = require('../src/utils/change-drafts-import-to-main');

// setup a project
const project = createProject();

const createFixture = (code) => {
  project.createSourceFile('tmp/fixture.js', code, { overwrite: true });
};

const getResult = () => {
  const sourceFile = project.getSourceFile('tmp/fixture.js');
  return sourceFile.getFullText();
};

const transform = (componentImportNames, fileName, v2FileNameToIgnore) => {
  const sourceFile = project.getSourceFiles()[0];

  sourceFile.getDescendantsOfKind(SyntaxKind.ImportDeclaration).forEach((declaration) => {
    updateImportDeclaration(declaration, sourceFile, componentImportNames, fileName, v2FileNameToIgnore);
  });
};

const ActionListImportNames = ['ActionList', 'ActionListProps', 'GroupProps', 'ItemProps'];
const draftsFileName = 'ActionList2';

test('change import specifier from @primer/drafts to @primer/react', () => {
  createFixture(`import { ActionList } from '@primer/react/drafts';`);
  transform(ActionListImportNames, draftsFileName);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionList, ActionListProps } from '@primer/react/drafts';`);
  transform(ActionListImportNames, draftsFileName);
  expect(getResult()).toBe(`import { ActionList, ActionListProps } from '@primer/react';`);
});

test('change import specifier when specifier is lib-esm/', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/ActionList2';`);
  transform(ActionListImportNames, draftsFileName);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/ActionList2';`);
});

test('change import specifier when specifier is lib/', () => {
  createFixture(`import { ActionList } from '@primer/react/lib/ActionList2';`);
  transform(ActionListImportNames, draftsFileName);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib/ActionList2';`);
});

test('skip import declaration when specifier is a different draft component', () => {
  createFixture(`import { PageLayout } from '@primer/react/drafts';`);
  transform(ActionListImportNames, draftsFileName);
  expect(getResult()).toBe(`import { PageLayout } from '@primer/react/drafts';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { PageLayout, ActionList } from '@primer/react/drafts';`);
  transform(ActionListImportNames, draftsFileName);
  expect(getResult()).toBe(
    `import { PageLayout } from '@primer/react/drafts';\nimport { ActionList } from '@primer/react';\n`
  );
});
