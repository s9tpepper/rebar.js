var fs = require("fs");
var InitRunner = function InitRunner() {
  var fileSystem = InitRunner.FileSystem(fs, process);
  var logger = InitRunner.Logger();

  var self = {
    execute: function execute() {
      if (fileSystem.isPwdEmpty()) {
        self.createRebarFolder();
      } else {
        var rebarExists = fileSystem.dirExistsInPwd(".rebar");
        if (rebarExists) {
          logger.error(InitRunner.REBAR_FOLDER_EXISTS_ERROR);
        } else {
          self.createRebarFolder();
        }
      }
    },

    createRebarFolder: function createRebarFolder() {
      fileSystem.makeDirInPwd(".rebar");
      fileSystem.makeFileInPwd("./.rebar/package.json", InitRunner.PACKAGE_JSON_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/grunt.js", InitRunner.GRUNT_JS_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/.gitignore", InitRunner.GIT_IGNORE_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/class.js", InitRunner.CLASS_JS_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/unit_test.js", InitRunner.UNIT_TEST_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/step_definition.js", InitRunner.STEP_DEFINITION_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/cucumber.feature", InitRunner.CUCUMBER_FEATURE_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/README.md", InitRunner.README_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/LICENSE", InitRunner.LICENSE_TEMPLATE);
      fileSystem.makeFileInPwd("./.rebar/rebar.json", InitRunner.REBAR_JSON_TEMPLATE);
      logger.success(InitRunner.INIT_SUCCESS_MESSAGE);
    }
  };

  return self;
};

InitRunner.INIT_SUCCESS_MESSAGE       = ".rebar folder created.";
InitRunner.REBAR_FOLDER_EXISTS_ERROR  = "The .rebar folder exists.";
InitRunner.FileSystem                 = require("../utils/file_system");
InitRunner.PACKAGE_JSON_TEMPLATE      = "{}";
InitRunner.GRUNT_JS_TEMPLATE          = "grunt.js file";
InitRunner.GIT_IGNORE_TEMPLATE        = ".gitignore file";
InitRunner.CLASS_JS_TEMPLATE          = "class.js file";
InitRunner.UNIT_TEST_TEMPLATE         = "unit test class file";
InitRunner.STEP_DEFINITION_TEMPLATE   = "unit test class file";
InitRunner.CUCUMBER_FEATURE_TEMPLATE  = "cucumber feature file";
InitRunner.README_TEMPLATE            = "README file";
InitRunner.LICENSE_TEMPLATE           = "LICENSE file";
InitRunner.REBAR_JSON_TEMPLATE        = "rebar.json file";
InitRunner.Logger                     = require("../utils/logger");

module.exports = InitRunner;