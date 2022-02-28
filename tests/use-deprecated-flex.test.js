const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-flex');

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
  createFixture(`import { Flex } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Flex } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { Flex, FlexProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Flex, FlexProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { Flex } from '@primer/react/lib-esm/Flex';`);
  transform(project);
  expect(getResult()).toBe(`import { Flex } from '@primer/react/lib-esm/deprecated/Flex';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { Flex } from '@primer/react/lib/Flex';`);
  transform(project);
  expect(getResult()).toBe(`import { Flex } from '@primer/react/lib/deprecated/Flex';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { Flex, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { Flex } from '@primer/react/deprecated';\n`
  );
});
