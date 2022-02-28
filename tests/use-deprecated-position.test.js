const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-position');

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
  createFixture(`import { Position } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Position } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { Position, PositionProps, Absolute, Fixed, Relative, Sticky } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { Position, PositionProps, Absolute, Fixed, Relative, Sticky } from '@primer/react/deprecated';`
  );
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { Position } from '@primer/react/lib-esm/Position';`);
  transform(project);
  expect(getResult()).toBe(`import { Position } from '@primer/react/lib-esm/deprecated/Position';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { Position } from '@primer/react/lib/Position';`);
  transform(project);
  expect(getResult()).toBe(`import { Position } from '@primer/react/lib/deprecated/Position';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { Position, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { Position } from '@primer/react/deprecated';\n`
  );
});
