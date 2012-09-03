var CjsRunner = function CjsRunner() {
  var fileSystem = CjsRunner.FileSystem();
  var logger = CjsRunner.Logger();

  var self = {
    execute: function execute(commandArguments) {
      var rebarExists = fileSystem.dirExistsInPwd(".rebar");

      if (rebarExists) {
        var className = commandArguments.shift();
        var classFilesExist = self.checkIfClassFilesExist(className);

        if (classFilesExist) {
          logger.error(CjsRunner.CLASS_FILES_EXIST);
        } else {
          self.createClass(className);
          self.createSpec(className);
        }
      } else {
        logger.error(CjsRunner.REBAR_MISSING);
      }
    },

    checkIfClassFilesExist: function checkIfClassFilesExist(className) {
      var classPath = "source/" + className + ".js";
      var classPathExists = fileSystem.dirExistsInPwd(classPath);

      var testPath = "spec/" + className + "_spec.js";
      var testPathExists = fileSystem.dirExistsInPwd(testPath);

      return classPathExists || testPathExists;
    },

    createClass: function createClass(className) {

    },

    createSpec: function createSpec(className) {

    }
  };

  return self;
};

CjsRunner.CLASS_FILES_EXIST   = "Files for that class name already exist. Delete them first or try another class name.";
CjsRunner.REBAR_MISSING       = "The .rebar folder can not be found in the current directory.";

CjsRunner.FileSystem  = require("../utils/file_system");
CjsRunner.Logger      = require("../utils/logger");

module.exports = CjsRunner;