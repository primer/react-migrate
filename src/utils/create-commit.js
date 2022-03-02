const git = require('simple-git')();

const createCommit = async (migrationName, createCommits) => {
  const { changed } = await git.diffSummary();
  if (!changed) return;

  await git.add('.');
  if (createCommits) await git.commit(getPrettyCommitMessage(migrationName));
  return { changed };
};

module.exports = createCommit;

const getPrettyCommitMessage = (migrationName) => {
  if (migrationName.includes('use-deprecated')) {
    const componentName = migrationName.replace('use-deprecated-', '');
    return `Change import path for ${componentName} → deprecated/${componentName}`;
  }

  if (migrationName.includes('use-main')) {
    const componentName = migrationName.replace('use-main-', '');
    return `Change import path for drafts/${componentName} → ${componentName}`;
  }

  return migrationName;
};
