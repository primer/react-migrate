const { createProject } = require('../src/utils');
const transform = require('../src/use-deprecated-actionlist');

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
  createFixture(`import { ActionList } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionList, ActionListProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList, ActionListProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/ActionList';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/deprecated/ActionList';`);
});

test('change import specifier when specifier is lib-esm/ActionList/Divider', () => {
  createFixture(`import Divider from '@primer/react/lib-esm/ActionList/Divider';`);
  transform(project);
  expect(getResult()).toBe(`import Divider from '@primer/react/lib-esm/deprecated/ActionList/Divider';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { ActionList } from '@primer/react/lib/ActionList';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib/deprecated/ActionList';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { ActionList, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { ActionList } from '@primer/react/deprecated';\n`
  );
});

test('skip import declaration when specifier is drafts', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/drafts';`);
});

test('skip import declaration when specifier is lib-esm/ActionList2', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/drafts/ActionList2';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/drafts/ActionList2';`);
});
