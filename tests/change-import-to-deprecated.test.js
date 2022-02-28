const { SyntaxKind } = require('ts-morph');
const createProject = require('../src/utils/create-project');
const updateImportDeclaration = require('../src/utils/change-import-to-deprecated');

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
const ActionListFileName = 'ActionList';
const ActionListv2FileNameToIgnore = 'ActionList2';

test('change import specifier to @primer/react/deprecated', () => {
  createFixture(`import { ActionList } from '@primer/react';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have ActionList', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionList, ActionListProps } from '@primer/react';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList, ActionListProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm/ActionList', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/ActionList';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/deprecated/ActionList';`);
});

test('change import specifier when specifier is lib-esm/ActionList/Divider', () => {
  createFixture(`import Divider from '@primer/react/lib-esm/ActionList/Divider';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import Divider from '@primer/react/lib-esm/deprecated/ActionList/Divider';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { ActionList } from '@primer/react/lib/ActionList';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib/deprecated/ActionList';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { ActionList, TextInput } from '@primer/react';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { ActionList } from '@primer/react/deprecated';\n`
  );
});

test('skip import declaration when specifier is drafts', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/drafts';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/drafts';`);
});

test('skip import declaration when specifier is lib-esm/ActionList2', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/drafts/ActionList2';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/drafts/ActionList2';`);
});

test('skip import declaration when specifier is a different component from lib-esm', () => {
  createFixture(`import { AnchoredOverlay } from '@primer/react/lib-esm/AnchoredOverlay';`);
  transform(ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { AnchoredOverlay } from '@primer/react/lib-esm/AnchoredOverlay';`);
});

test("deprecated DropDown, but skip DropdownMenu, that's a different component", () => {
  createFixture(`
    import { Dropdown } from '@primer/react'
    import { DropdownMenu } from '@primer/react';
    import { DropdownMenu } from '@primer/react/lib/DropdownMenu';
  `);

  const importNames = ['Dropdown', 'DropdownProps'];
  const fileName = 'Dropdown';
  const fileNameToIgnore = 'DropdownMenu';
  transform(importNames, fileName, fileNameToIgnore);

  expect(getResult()).toBe(`
    import { Dropdown } from '@primer/react/deprecated'
    import { DropdownMenu } from '@primer/react';
    import { DropdownMenu } from '@primer/react/lib/DropdownMenu';
  `);
});
