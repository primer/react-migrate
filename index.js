#!/usr/bin/env node

const { resolve } = require('path');
const args = require('yargs-parser')(process.argv.slice(2));
const { createProject } = require('./src/utils');

const project = createProject();

const srcPath = args._[0] || 'src';
const globPath = resolve(srcPath + '/**/*.{tsx,ts,jsx,js}');

project.addSourceFilesAtPaths(globPath);
console.log(`Adding ${project.getSourceFiles().length} files ${globPath} to project. \n`);

const migration = args.migration || args.m;
if (migration === 'deprecate-buttons') require('./src/button-import-deprecated')(project);
else console.log('Migration not found! Did you mean `npx primer-react-migrate src -m deprecate-buttons`');

module.export = { project };
