const { Project, ScriptTarget, QuoteKind } = require('ts-morph');

// setup new project
const createProject = () => {
  return new Project({
    compilerOptions: { target: ScriptTarget.ES3 },
    manipulationSettings: { quoteKind: QuoteKind.Single }
  });
};

module.exports = createProject;
