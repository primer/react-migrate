const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-actionmenu');

// setup a project
const project = createProject();

const createFixture = (code) => {
  project.createSourceFile('tmp/fixture.js', code, { overwrite: true });
};
const getResult = () => {
  const sourceFile = project.getSourceFile('tmp/fixture.js');
  return sourceFile.getFullText();
};

test('change import specifier to @primer/react/deprecated', () => {
  createFixture(`import { ActionMenu } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionMenu, ActionMenuProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu, ActionMenuProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { ActionMenu } from '@primer/react/lib-esm/ActionMenu';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/lib-esm/deprecated/ActionMenu';`);
});

test('change import specifier when specifier is lib-esm/ActionMenu/Divider', () => {
  createFixture(`import Divider from '@primer/react/lib-esm/ActionMenu/Divider';`);
  transform(project);
  expect(getResult()).toBe(`import Divider from '@primer/react/lib-esm/deprecated/ActionMenu/Divider';`);
});

test('change import specifier when specifier is lib/ActionMenu', () => {
  createFixture(`import { ActionMenu } from '@primer/react/lib/ActionMenu';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/lib/deprecated/ActionMenu';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { ActionMenu, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { ActionMenu } from '@primer/react/deprecated';\n`
  );
});

test('skip import declaration when specifier is drafts', () => {
  createFixture(`import { ActionMenu } from '@primer/react/lib-esm/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/lib-esm/drafts';`);
});

test('skip import declaration when specifier is lib-esm/ActionMenu2', () => {
  createFixture(`import { ActionMenu } from '@primer/react/lib-esm/drafts/ActionMenu2';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/lib-esm/drafts/ActionMenu2';`);
});
