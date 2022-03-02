const deprecateComponent = require("./utils/deprecate-component");

const componentImportNames = ["DropdownButton", "DropdownButtonProps"];
const fileName = "DropdownButton";

const transform = (project) => {
  deprecateComponent(
    project,
    componentImportNames,
    fileName,
    v2FileNameToIgnore
  );
};

module.exports = transform;
