#!/usr/bin/env node

const fs = require('fs');
const { resolve } = require('path');
const args = require('yargs-parser')(process.argv.slice(2));
const createProject = require('./src/utils/create-project');

const project = createProject();

const srcPath = args._[0] || 'src';
const globPath = resolve(srcPath + '/**/*.{tsx,ts,jsx,js}');

project.addSourceFilesAtPaths(globPath);
console.log(`${project.getSourceFiles().length} files found at ${globPath} \n`);

const preset = args.preset || args.p;
const migration = args.migration || args.m;

if (preset === 'v35') {
  require('./src/use-deprecated-borderbox.js')(project);
  require('./src/use-deprecated-flex.js')(project);
  require('./src/use-deprecated-grid.js')(project);
  require('./src/use-deprecated-position.js')(project);
  require('./src/use-deprecated-dropdown.js')(project);
  require('./src/use-deprecated-formgroup.js')(project);
  require('./src/use-deprecated-selectmenu.js')(project);

  require('./src/use-deprecated-button.js')(project);
  require('./src/use-deprecated-actionlist.js')(project);
  require('./src/use-deprecated-actionmenu.js')(project);
  require('./src/use-deprecated-dropdownmenu.js')(project);
  require('./src/use-deprecated-inputfield.js')(project);
  require('./src/use-deprecated-choicefieldset.js')(project);
  require('./src/use-deprecated-choiceinputfield.js')(project);

  require('./src/use-main-label.js')(project);
  require('./src/use-main-button.js')(project);
  require('./src/use-main-actionlist.js')(project);
  require('./src/use-main-actionmenu.js')(project);
  require('./src/use-main-pagelayout.js')(project);
} else {
  const path = './src/' + migration + '.js';
  if (fs.existsSync(resolve(__dirname, path))) require(path)(project);
  else {
    console.log(
      'Migration not found! Check the list of available migrations on https://github.com/primer/react-migrate'
    );
  }
}

module.export = { project };
