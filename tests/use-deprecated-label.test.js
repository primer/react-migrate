const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-label');

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
  createFixture(`import { Label } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Label } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Label', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { Label, LabelProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Label, LabelProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { Label } from '@primer/react/lib-esm/Label';`);
  transform(project);
  expect(getResult()).toBe(`import { Label } from '@primer/react/lib-esm/deprecated/Label';`);
});

test('change import specifier when specifier is lib', () => {
  createFixture(`import { Label } from '@primer/react/lib/Label';`);
  transform(project);
  expect(getResult()).toBe(`import { Label } from '@primer/react/lib/deprecated/Label';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { Label, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { Label } from '@primer/react/deprecated';\n`
  );
});
