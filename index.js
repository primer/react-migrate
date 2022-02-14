#!/usr/bin/env node

const { resolve } = require('path');
const args = require('yargs-parser')(process.argv.slice(2));
const { createProject } = require('./src/utils');

const project = createProject();

const srcPath = args._[0] || 'src';
const globPath = resolve(srcPath + '/**/*.{tsx,ts,jsx,js}');

project.addSourceFilesAtPaths(globPath);
console.log(`Processing ${project.getSourceFiles().length} files at ${globPath} \n`);

const preset = args.preset || args.p;
const migration = args.migration || args.m;

if (preset === 'v35') {
  require('./src/button-import-deprecated')(project);
  require('./src/use-deprecated-actionlist')(project);
} else {
  if (migration === 'deprecate-buttons') require('./src/button-import-deprecated')(project);
  else if (migration === 'use-deprecated-actionlist') require('./src/use-deprecated-actionlist')(project);
  else console.log('Migration not found! Did you mean `npx primer-react-migrate src -m deprecate-buttons`');
}

module.export = { project };
