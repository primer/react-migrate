// remove quotes from string so that they can be used as StringLiteral
const convertToStringLiteral = (string) => string.replaceAll(`'`, ``).replaceAll(`"`, ``);

module.exports = { convertToStringLiteral };
