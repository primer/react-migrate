const createProject = require('../src/utils/create-project');
const transform = require('../src/use-main-actionmenu');

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
  createFixture(`import { ActionMenu } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionMenu, ActionMenuProps } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu, ActionMenuProps } from '@primer/react';`);
});

test('change import specifier when specifier is lib-esm/', () => {
  createFixture(`import { ActionMenu } from '@primer/react/lib-esm/ActionMenu2';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/lib-esm/ActionMenu2';`);
});

test('change import specifier when specifier is lib/', () => {
  createFixture(`import { ActionMenu } from '@primer/react/lib/ActionMenu2';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionMenu } from '@primer/react/lib/ActionMenu2';`);
});

test('skip import declaration when specifier is a different draft component', () => {
  createFixture(`import { PageLayout } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { PageLayout } from '@primer/react/drafts';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { PageLayout, ActionMenu } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(
    `import { PageLayout } from '@primer/react/drafts';\nimport { ActionMenu } from '@primer/react';\n`
  );
});
