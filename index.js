#!/usr/bin/env node

const ora = require('ora');
const chalk = require('chalk');
const { resolve } = require('path');
const args = require('yargs-parser')(process.argv.slice(2));
const createProject = require('./src/utils/create-project');
const createCommit = require('./src/utils/create-commit');

const project = createProject();

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
      const spinner = ora(chalk.yellow(migrationName));
      spinner.color = 'yellow';
      spinner.spinner = 'arc';
      spinner.start();

      require(`./src/${migrationName}.js`)(project);

      if (createCommits) {
        const changed = await createCommit(migrationName);
        if (changed) spinner.succeed(chalk.green(migrationName));
        else spinner.info(chalk.green(migrationName));
      } else {
        spinner.succeed(chalk.green(migrationName));
      }
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
