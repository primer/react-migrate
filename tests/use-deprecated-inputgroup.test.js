const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-inputfield');

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
  createFixture(`import { InputField } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { InputField } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { InputField } from '@primer/react/lib-esm/InputField';`);
  transform(project);
  expect(getResult()).toBe(`import { InputField } from '@primer/react/lib-esm/deprecated/InputField';`);
});

test('change import specifier when specifier is lib', () => {
  createFixture(`import { InputField } from '@primer/react/lib/InputField';`);
  transform(project);
  expect(getResult()).toBe(`import { InputField } from '@primer/react/lib/deprecated/InputField';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { InputField, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { InputField } from '@primer/react/deprecated';\n`
  );
});
