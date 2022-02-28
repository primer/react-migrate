const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-dropdownmenu');

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
  createFixture(`import { DropdownMenu } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { DropdownMenu } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { DropdownMenu, DropdownMenuProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { DropdownMenu, DropdownMenuProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { DropdownMenu } from '@primer/react/lib-esm/DropdownMenu';`);
  transform(project);
  expect(getResult()).toBe(`import { DropdownMenu } from '@primer/react/lib-esm/deprecated/DropdownMenu';`);
});

test('change import specifier when specifier is lib/DropdownMenu', () => {
  createFixture(`import { DropdownMenu } from '@primer/react/lib/DropdownMenu';`);
  transform(project);
  expect(getResult()).toBe(`import { DropdownMenu } from '@primer/react/lib/deprecated/DropdownMenu';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { DropdownMenu, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { DropdownMenu } from '@primer/react/deprecated';\n`
  );
});

test('skip import declaration when specifier is drafts', () => {
  createFixture(`import { DropdownMenu } from '@primer/react/lib-esm/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { DropdownMenu } from '@primer/react/lib-esm/drafts';`);
});

test('skip import declaration when specifier is lib-esm/DropdownMenu2', () => {
  createFixture(`import { DropdownMenu } from '@primer/react/lib-esm/drafts/DropdownMenu2';`);
  transform(project);
  expect(getResult()).toBe(`import { DropdownMenu } from '@primer/react/lib-esm/drafts/DropdownMenu2';`);
});
