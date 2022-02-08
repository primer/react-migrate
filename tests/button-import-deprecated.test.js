const { createProject } = require('../src/utils');
const transform = require('../src/button-import-deprecated');

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
  createFixture(`import { Button } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Button } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple Button imports', () => {
  createFixture(`import { ButtonPrimary, ButtonClose as Dismiss } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ButtonPrimary, ButtonClose as Dismiss } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm/Button', () => {
  createFixture(`import Button from '@primer/react/lib-esm/Button';`);
  transform(project);
  expect(getResult()).toBe(`import Button from '@primer/react/lib-esm/deprecated/Button';`);
});

test('change import specifier when specifier is lib-esm/Button/ButtonPrimary', () => {
  createFixture(`import PrimaryButton from '@primer/react/lib-esm/Button/ButtonPrimary';`);
  transform(project);
  expect(getResult()).toBe(`import PrimaryButton from '@primer/react/lib-esm/deprecated/Button/ButtonPrimary';`);
});

test('change import specifier when specifier is lib/Button', () => {
  createFixture(`import { ButtonPrimary } from '@primer/react/lib/Button';`);
  transform(project);
  expect(getResult()).toBe(`import { ButtonPrimary } from '@primer/react/lib/deprecated/Button';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { ButtonDanger, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { ButtonDanger } from '@primer/react/deprecated';\n`
  );
});

test('skip import declaration when specifier is drafts', () => {
  createFixture(`import { Button as Button2 } from '@primer/react/lib-esm/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { Button as Button2 } from '@primer/react/lib-esm/drafts';`);
});

test('skip import declaration when specifier is lib-esm/Button2', () => {
  createFixture(`import { IconButton } from '@primer/react/lib-esm/Button2';`);
  transform(project);
  expect(getResult()).toBe(`import { IconButton } from '@primer/react/lib-esm/Button2';`);
});
