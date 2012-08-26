var fs = require("fs");
var InitRunner = function InitRunner() {
  var fileSystem = InitRunner.FileSystem(fs, process);

  var self = {
    execute: function execute() {
      if (fileSystem.isPwdEmpty()) {
        fileSystem.makeDirInPwd(".rebar");
        fileSystem.makeFileInPwd("./.rebar/package.json", InitRunner.PACKAGE_JSON_TEMPLATE);
      }
    }
  };

  return self;
};

InitRunner.FileSystem             = require("../utils/file_system");
InitRunner.PACKAGE_JSON_TEMPLATE  = "{}";

module.exports = InitRunner;