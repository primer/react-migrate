#!/usr/bin/env node

const { Project, ScriptTarget } = require('ts-morph');
const args = require('yargs-parser')(process.argv.slice(2));

const project = new Project({ compilerOptions: { target: ScriptTarget.ES3 } });

const srcPath = args._[0] || 'src';
const globPath = __dirname + '/' + srcPath + '/**/*.js';

project.addSourceFilesAtPaths(globPath);
console.log(`Adding ${project.getSourceFiles().length} files ${globPath} to project. \n`);

const migration = args.migration || args.m;
if (migration === 'deprecate-buttons') require('./src/button-import-deprecated')(project);
else console.log('Migration not found! Did you mean `npx primer-react-migrate src -m deprecate-buttons`');
