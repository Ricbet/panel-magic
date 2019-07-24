const replace = require("replace-in-file");

const changesOption = {
    files: "src/environments/*.ts",
    from: /statics_version: '(.*)'/g,
    to: `statics_version: ${new Date().getTime()}`
};

try {
    replace.sync(changesOption);
} catch (error) {
    console.error("出错了:", error);
}
