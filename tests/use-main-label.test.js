const createProject = require('../src/utils/create-project');
const transform = require('../src/use-main-label');

// setup a project
const project = createProject();

const createFixture = (code) => {
  project.createSourceFile('tmp/fixture.js', code, { overwrite: true });
};
const getResult = () => {
  const sourceFile = project.getSourceFile('tmp/fixture.js');
  return sourceFile.getFullText();
};

test('change import specifier from @primer/drafts to @primer/react', () => {
  createFixture(`import { Label } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { Label } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { Label, LabelProps } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { Label, LabelProps } from '@primer/react';`);
});

test('change import specifier when specifier is lib-esm/', () => {
  createFixture(`import { Label } from '@primer/react/lib-esm/Label2';`);
  transform(project);
  expect(getResult()).toBe(`import { Label } from '@primer/react/lib-esm/Label2';`);
});

test('change import specifier when specifier is lib/', () => {
  createFixture(`import { Label } from '@primer/react/lib/Label2';`);
  transform(project);
  expect(getResult()).toBe(`import { Label } from '@primer/react/lib/Label2';`);
});

test('skip import declaration when specifier is a different draft component', () => {
  createFixture(`import { ActionList } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/drafts';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { PageLayout, Label } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(
    `import { PageLayout } from '@primer/react/drafts';\nimport { Label } from '@primer/react';\n`
  );
});
