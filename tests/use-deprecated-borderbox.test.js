const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-borderbox');

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
  createFixture(`import { BorderBox } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { BorderBox } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have BorderBox', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { BorderBox, BorderBoxProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { BorderBox, BorderBoxProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { BorderBox } from '@primer/react/lib-esm/BorderBox';`);
  transform(project);
  expect(getResult()).toBe(`import { BorderBox } from '@primer/react/lib-esm/deprecated/BorderBox';`);
});

test('change import specifier when specifier is lib', () => {
  createFixture(`import { BorderBox } from '@primer/react/lib/BorderBox';`);
  transform(project);
  expect(getResult()).toBe(`import { BorderBox } from '@primer/react/lib/deprecated/BorderBox';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { BorderBox, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { BorderBox } from '@primer/react/deprecated';\n`
  );
});
