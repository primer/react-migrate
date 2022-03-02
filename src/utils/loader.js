const ora = require('ora');
const chalk = require('chalk');

const loader = (message) => {
  const spinner = ora(chalk.yellow(message));
  spinner.color = 'yellow';
  spinner.spinner = 'arc';
  spinner.start();

  return {
    success: () => spinner.succeed(chalk.green(message)),
    skip: () => spinner.stopAndPersist({ symbol: chalk.gray('-'), text: chalk.gray(message) })
  };
};

module.exports = loader;
