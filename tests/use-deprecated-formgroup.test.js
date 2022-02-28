const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-formgroup');

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
  createFixture(`import { FormGroup } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { FormGroup } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { FormGroup, FormGroupProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { FormGroup, FormGroupProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { FormGroup } from '@primer/react/lib-esm/FormGroup';`);
  transform(project);
  expect(getResult()).toBe(`import { FormGroup } from '@primer/react/lib-esm/deprecated/FormGroup';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { FormGroup } from '@primer/react/lib/FormGroup';`);
  transform(project);
  expect(getResult()).toBe(`import { FormGroup } from '@primer/react/lib/deprecated/FormGroup';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { FormGroup, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { FormGroup } from '@primer/react/deprecated';\n`
  );
});
