const createProject = require('../src/utils/create-project');
const transform = require('../src/use-deprecated-dropdown');

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
  createFixture(`import { Dropdown } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Dropdown } from '@primer/react/deprecated';`);
});

test('skip import declaration that does not have Dropdown', () => {
  createFixture(`import { ThemeProvider } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { ThemeProvider } from '@primer/react';`);
});

test('change import specifier with multiple imports', () => {
  createFixture(`import { Dropdown, DropdownProps } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(`import { Dropdown, DropdownProps } from '@primer/react/deprecated';`);
});

test('change import specifier when specifier is lib-esm', () => {
  createFixture(`import { Dropdown } from '@primer/react/lib-esm/Dropdown';`);
  transform(project);
  expect(getResult()).toBe(`import { Dropdown } from '@primer/react/lib-esm/deprecated/Dropdown';`);
});

test('change import specifier when specifier is lib', () => {
  createFixture(`import { Dropdown } from '@primer/react/lib/Dropdown';`);
  transform(project);
  expect(getResult()).toBe(`import { Dropdown } from '@primer/react/lib/deprecated/Dropdown';`);
});

test('split + change import declaration when multiple components are imported', () => {
  createFixture(`import { Dropdown, TextInput } from '@primer/react';`);
  transform(project);
  expect(getResult()).toBe(
    `import { TextInput } from '@primer/react';\nimport { Dropdown } from '@primer/react/deprecated';\n`
  );
});

test("skip DropdownMenu, that's a different component", () => {
  createFixture(`
    import { DropdownMenu } from '@primer/react';
    import { DropdownMenu } from '@primer/react/lib/DropdownMenu';
  `);
  transform(project);
  expect(getResult()).toBe(`
    import { DropdownMenu } from '@primer/react';
    import { DropdownMenu } from '@primer/react/lib/DropdownMenu';
  `);
});
