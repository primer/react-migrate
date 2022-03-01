const git = require('simple-git')();

const createCommit = async (migrationName) => {
  const { changed } = await git.diffSummary();
  if (!changed) return;

  await git.add('.');
  await git.commit(migrationName);
};

module.exports = createCommit;
