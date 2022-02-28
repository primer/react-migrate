const createProject = require('../src/utils/create-project');
const transform = require('../src/use-main-pagelayout');

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
  createFixture(`import { PageLayout } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { PageLayout } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { PageLayout, PageLayoutProps, PageLayoutHeaderProps } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { PageLayout, PageLayoutProps, PageLayoutHeaderProps } from '@primer/react';`);
});

test('change import specifier when specifier is lib-esm/', () => {
  createFixture(`import { PageLayout } from '@primer/react/lib-esm/PageLayout';`);
  transform(project);
  expect(getResult()).toBe(`import { PageLayout } from '@primer/react/lib-esm/PageLayout';`);
});

test('change import specifier when specifier is lib/', () => {
  createFixture(`import { PageLayout } from '@primer/react/lib/PageLayout';`);
  transform(project);
  expect(getResult()).toBe(`import { PageLayout } from '@primer/react/lib/PageLayout';`);
});

test('skip import declaration when specifier is a different draft component', () => {
  createFixture(`import { ActionList } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/drafts';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { PageLayout, Button } from '@primer/react/drafts';`);
  transform(project);
  expect(getResult()).toBe(
    `import { Button } from '@primer/react/drafts';\nimport { PageLayout } from '@primer/react';\n`
  );
});
