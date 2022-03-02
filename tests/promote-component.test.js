const createProject = require('../src/utils/create-project');
const promoteDraftsComponent = require('../src/utils/promote-drafts-component');

// setup a project
const project = createProject();

const createFixture = (code) => {
  project.createSourceFile('tmp/fixture.js', code, { overwrite: true });
};

const getResult = () => {
  const sourceFile = project.getSourceFile('tmp/fixture.js');
  return sourceFile.getFullText();
};

const ActionListImportNames = ['ActionList', 'ActionListProps', 'GroupProps', 'ItemProps'];
const draftsFileName = 'ActionList2';
const newFileName = 'ActionList';

test('change import specifier from @primer/drafts to @primer/react', () => {
  createFixture(`import { ActionList } from '@primer/react/drafts';`);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { ActionList, ActionListProps } from '@primer/react/drafts';`);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(`import { ActionList, ActionListProps } from '@primer/react';`);
});

test('change import specifier when specifier is lib-esm/', () => {
  createFixture(`import { ActionList } from '@primer/react/lib-esm/ActionList2';`);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib-esm/ActionList';`);
});

test('change import specifier when specifier is lib/', () => {
  createFixture(`import { ActionList } from '@primer/react/lib/ActionList2';`);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(`import { ActionList } from '@primer/react/lib/ActionList';`);
});

test('skip import declaration when specifier is a different draft component', () => {
  createFixture(`import { PageLayout } from '@primer/react/drafts';`);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(`import { PageLayout } from '@primer/react/drafts';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { PageLayout, ActionList } from '@primer/react/drafts';`);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(
    `import { PageLayout } from '@primer/react/drafts';\nimport { ActionList } from '@primer/react';\n`
  );
});

test('promote ActionList, but keep the rename of adjacent Link component', () => {
  createFixture(`
import { ActionList, Button as Button2 } from '@primer/react/drafts';
  `);
  promoteDraftsComponent(project, ActionListImportNames, draftsFileName, newFileName);
  expect(getResult()).toBe(`
import { Button as Button2 } from '@primer/react/drafts';
import { ActionList } from '@primer/react';
  `);
});
