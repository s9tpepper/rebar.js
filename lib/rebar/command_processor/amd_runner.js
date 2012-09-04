var AmdRunner = function AmdRunner() {
  var path = require("path");
  var fs = require("fs");
  var fileSystem = AmdRunner.FileSystem(fs, process);
  var logger = AmdRunner.Logger();

  function createDeepPath(basePath, pathArr) {
    var pathLength = pathArr.length;
    for (var i = 0; i < pathLength; i++) {
      basePath = path.join(basePath, pathArr[i]);
      if (!fileSystem.dirExistsInPwd(basePath)) {
        fileSystem.makeDirInPwd(basePath);
      }
    }

    return basePath;
  }

  var self = {
    execute: function execute(commandArguments) {
      var rebarExists = fileSystem.dirExistsInPwd(".rebar");

      if (rebarExists) {
        var className = commandArguments.shift();
        var classFilesExist = self.checkIfClassFilesExist(className);

        if (classFilesExist) {
          logger.error(AmdRunner.CLASS_FILES_EXIST);
        } else {
          self.createClass(className);
          self.createSpec(className);
        }
      } else {
        logger.error(AmdRunner.REBAR_MISSING);
      }
    },

    checkIfClassFilesExist: function checkIfClassFilesExist(className) {
      var classPath = "source" + path.sep + className + ".js";
      var classPathExists = fileSystem.dirExistsInPwd(classPath);

      var testPath = "spec" + path.sep + className + "_spec.js";
      var testPathExists = fileSystem.dirExistsInPwd(testPath);

      return classPathExists || testPathExists;
    },

    createClass: function createClass(className) {
      var classTemplate = fileSystem.readFile("." + path.sep + ".rebar" + path.sep + "class_require.js");
      classTemplate = classTemplate.replace(/%CLASS_NAME%/gm, className);

      var pathArr = className.split(path.sep);
      pathArr.pop();

      createDeepPath("source", pathArr);

      fileSystem.makeFileInPwd("source" + path.sep +className+".js", classTemplate);
    },

    createSpec: function createSpec(className) {
      var classPath = "source" + path.sep + className + ".js";
      var testPath = "spec" + path.sep + className + "_spec.js";

      classPath = path.resolve(classPath);
      testPath = path.resolve(testPath);

      var pathArr = className.split(path.sep);
      className = pathArr.pop();

      var basePath = createDeepPath("spec", pathArr);
      var testParent = testPath.split(path.sep);
      testParent.pop();
      testParent = testParent.join(path.sep);
      var pathToClassFromTest = path.relative(testParent, classPath);
      pathToClassFromTest = pathToClassFromTest.replace(".js", "");

      var testContents = fileSystem.readFile("." + path.sep + ".rebar" + path.sep + "unit_test_require.js");
      testContents = testContents.replace(/%CLASS_NAME%/gm, className);

      var classVarName = className.charAt(0).toLowerCase() + className.slice(1);
      testContents = testContents.replace(/%CLASS_VAR%/gm, classVarName);

      testContents = testContents.replace(/%CLASS_DEPTH%/gm, pathToClassFromTest);

      fileSystem.makeFileInPwd(basePath + path.sep + className + "_spec.js", testContents);
    }
  };

  return self;
};

AmdRunner.CLASS_FILES_EXIST   = "Files for that class name already exist. Delete them first or try another class name.";
AmdRunner.REBAR_MISSING       = "The .rebar folder can not be found in the current directory.";

AmdRunner.FileSystem  = require("../utils/file_system");
AmdRunner.Logger      = require("../utils/logger");

module.exports = AmdRunner;