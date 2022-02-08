const { Project, ScriptTarget, QuoteKind } = require('ts-morph');

// setup new project
const createProject = () => {
  return new Project({
    compilerOptions: { target: ScriptTarget.ES3 },
    manipulationSettings: { quoteKind: QuoteKind.Single }
  });
};

// remove quotes from string so that they can be used as StringLiteral
const convertToStringLiteral = (string) => string.replaceAll(`'`, ``).replaceAll(`"`, ``);

module.exports = { createProject, convertToStringLiteral };
