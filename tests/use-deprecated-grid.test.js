const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-grid');

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
  createFixture(`import { Grid } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Grid } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { Grid, GridProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Grid, GridProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { Grid } from '@primer/react/lib-esm/Grid';`);
  transform(project);
  expect(getResult()).toBe(`import { Grid } from '@primer/react/lib-esm/deprecated/Grid';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { Grid } from '@primer/react/lib/Grid';`);
  transform(project);
  expect(getResult()).toBe(`import { Grid } from '@primer/react/lib/deprecated/Grid';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { Grid, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { Grid } from '@primer/react/deprecated';\n`
  );
});
