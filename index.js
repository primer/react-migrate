#!/usr/bin/env node

const { resolve } = require('path');
const loader = require('./src/utils/loader');
const createProject = require('./src/utils/create-project');
const { createCommit, getPrettyMessage } = require('./src/utils/create-commit');

const project = createProject();

const args = require('yargs-parser')(process.argv.slice(2));
const srcPath = args._[0] || 'src';
const globPath = resolve(srcPath + '/**/*.{tsx,ts,jsx,js}');

project.addSourceFilesAtPaths(globPath);
console.log(`${project.getSourceFiles().length} files found at ${globPath} \n`);

const preset = args.preset || args.p;
const migration = args.migration || args.m;
const createCommits = args['create-commits'];

const migrations = [
  // old deprecations
  'use-deprecated-borderbox',
  'use-deprecated-flex',
  'use-deprecated-grid',
  'use-deprecated-label',
  'use-deprecated-position',
  'use-deprecated-dropdown',
  'use-deprecated-formgroup',
  'use-deprecated-selectmenu',

  // new deprecations
  'use-deprecated-button',
  'use-deprecated-actionlist',
  'use-deprecated-actionmenu',
  'use-deprecated-dropdownmenu',
  'use-deprecated-inputfield',
  'use-deprecated-choicefieldset',
  'use-deprecated-choiceinputfield',

  // promotions, should be run after deprecations
  'use-main-label',
  'use-main-button',
  'use-main-actionlist',
  'use-main-actionmenu',
  'use-main-pagelayout'
];

if (preset === 'v35') {
  async function runSequentially() {
    for (const migrationName of migrations) {
      const message = getPrettyMessage(migrationName);
      const { success, skip } = loader(message);

      require(`./src/${migrationName}.js`)(project);

      if (createCommits) {
        const changed = await createCommit(migrationName);
        changed ? await success() : await skip();
      } else await success();
    }
  }

  runSequentially();
} else {
  if (migrations.includes(migration)) {
    const path = './src/' + migration + '.js';
    require(path)(project);
    if (createCommits) createCommit(migration);
  } else {
    console.log(
      'Migration not found! Check the list of available migrations on https://github.com/primer/react-migrate'
    );
  }
}

module.export = { project };
