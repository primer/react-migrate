const createProject = require('../src/utils/create-project');
const deprecateComponent = require('../src/utils/deprecate-component');

// setup a project
const project = createProject();

const createFixture = (code) => {
  project.createSourceFile('tmp/fixture.js', code, { overwrite: true });
};

const getResult = () => {
  const sourceFile = project.getSourceFile('tmp/fixture.js');
  return sourceFile.getFullText();
};

const ActionListImportNames = ['ActionList', 'ActionListProps', 'GroupProps', 'ItemProps'];
const ActionListFileName = 'ActionList';
const ActionListv2FileNameToIgnore = 'ActionList2';

test('change import specifier to @primer/react/deprecated', () => {
  createFixture(`import { ActionList } from '@primer/react';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have ActionList', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionList, ActionListProps } from '@primer/react';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList, ActionListProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm/ActionList', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/ActionList';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/deprecated/ActionList';`);
});

test('change import specifier when specifier is lib-esm/ActionList/Divider', () => {
  createFixture(`import Divider from '@primer/react/lib-esm/ActionList/Divider';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import Divider from '@primer/react/lib-esm/deprecated/ActionList/Divider';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { ActionList } from '@primer/react/lib/ActionList';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib/deprecated/ActionList';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { ActionList, TextInput } from '@primer/react';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { ActionList } from '@primer/react/deprecated';\n`
  );
});

test('skip import declaration when specifier is drafts', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/drafts';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/drafts';`);
});

test('skip import declaration when specifier is lib-esm/ActionList2', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/drafts/ActionList2';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/drafts/ActionList2';`);
});

test('skip import declaration when specifier is a different component from lib-esm', () => {
  createFixture(`import { AnchoredOverlay } from '@primer/react/lib-esm/AnchoredOverlay';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { AnchoredOverlay } from '@primer/react/lib-esm/AnchoredOverlay';`);
});

test('skip default import declaration when specifier is a different component from lib-esm', () => {
  createFixture(`import sx from '@primer/react/lib-esm/sx';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import sx from '@primer/react/lib-esm/sx';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { ActionList } from '@primer/react/lib/ActionList';`);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib/deprecated/ActionList';`);
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

  deprecateComponent(project, importNames, fileName, fileNameToIgnore);

  expect(getResult()).toBe(`
    import { Dropdown } from '@primer/react/deprecated'
    import { DropdownMenu } from '@primer/react';
    import { DropdownMenu } from '@primer/react/lib/DropdownMenu';
  `);
});

test('deprecate ActionList, but keep the rename of adjacent Link component', () => {
  createFixture(`
import { ActionList, Link as PrimerLink } from '@primer/react';
  `);
  deprecateComponent(project, ActionListImportNames, ActionListFileName, ActionListv2FileNameToIgnore);
  expect(getResult()).toBe(`
import { Link as PrimerLink } from '@primer/react';
import { ActionList } from '@primer/react/deprecated';
  `);
});
