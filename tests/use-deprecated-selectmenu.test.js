const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-selectmenu');

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
  createFixture(`import { SelectMenu } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { SelectMenu } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Button', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(
    `import { SelectMenu, SelectMenuProps, SelectMenuDividerProps, SelectMenuFilterProps, SelectMenuFooterProps, SelectMenuItemProps, SelectMenuListProps, SelectMenuModalProps, SelectMenuTabsProps, SelectMenuHeaderProps, SelectMenuTabProps, SelectMenuTabPanelProps, SelectMenuLoadingAnimationProps } from '@primer/react';`
  );
  transform(project);
  expect(getResult()).toBe(
    `import { SelectMenu, SelectMenuProps, SelectMenuDividerProps, SelectMenuFilterProps, SelectMenuFooterProps, SelectMenuItemProps, SelectMenuListProps, SelectMenuModalProps, SelectMenuTabsProps, SelectMenuHeaderProps, SelectMenuTabProps, SelectMenuTabPanelProps, SelectMenuLoadingAnimationProps } from '@primer/react/deprecated';`
  );
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { SelectMenu } from '@primer/react/lib-esm/SelectMenu';`);
  transform(project);
  expect(getResult()).toBe(`import { SelectMenu } from '@primer/react/lib-esm/deprecated/SelectMenu';`);
});

test('change import specifier when specifier is lib/ActionList', () => {
  createFixture(`import { SelectMenu } from '@primer/react/lib/SelectMenu';`);
  transform(project);
  expect(getResult()).toBe(`import { SelectMenu } from '@primer/react/lib/deprecated/SelectMenu';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { SelectMenu, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { SelectMenu } from '@primer/react/deprecated';\n`
  );
});
