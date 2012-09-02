var fs = require("fs");
var exec = require("child_process").exec;
var NewRunner = function NewRunner() {
  var fileSystem  = NewRunner.FileSystem(fs, process);
  var logger      = NewRunner.Logger();

  var self = {
    execute: function execute(commandArguments) {
      commandArguments = commandArguments || [];

      if (0 === commandArguments.length) {
        logger.error(NewRunner.PROJECT_NAME_MISSING_ERROR);
      } else {
        var projectName = commandArguments.shift();
        var projectDirExists = fileSystem.dirExistsInPwd(projectName);

        if (projectDirExists) {
          logger.error(NewRunner.PROJECT_DIR_EXISTS_ERROR);
        } else {
          self.createProjectFolder(projectName, commandArguments);
        }
      }
    },

    createProjectFolder: function createProjectFolder(projectName, commandArguments) {
      fileSystem.makeDirInPwd(projectName);

      var projectPath = "./" + projectName + "/";
      fileSystem.makeDirInPwd(projectPath + ".rebar");

      var rebarPath = projectPath + ".rebar/";
      fileSystem.makeFileInPwd(rebarPath + "rebar.json", NewRunner.REBAR_JSON_TEMPLATE);
      fileSystem.makeFileInPwd(rebarPath + "class.js", NewRunner.CLASS_JS_TEMPLATE);
      fileSystem.makeFileInPwd(rebarPath + "class_require.js", NewRunner.CLASS_REQUIREJS_TEMPLATE);
      fileSystem.makeFileInPwd(rebarPath + "unit_test.js", NewRunner.UNIT_TEST_TEMPLATE);
      fileSystem.makeFileInPwd(rebarPath + "unit_test_require.js", NewRunner.UNIT_TEST_REQUIRE_TEMPLATE);
      fileSystem.makeFileInPwd(rebarPath + "step_definition.js", NewRunner.STEP_DEFINITION_TEMPLATE);
      fileSystem.makeFileInPwd(rebarPath + "cucumber.feature", NewRunner.CUCUMBER_FEATURE_TEMPLATE);
      fileSystem.makeFileInPwd(projectPath + "package.json", NewRunner.PACKAGE_JSON_TEMPLATE);
      fileSystem.makeFileInPwd(projectPath + "grunt.js", NewRunner.GRUNT_JS_TEMPLATE);
      fileSystem.makeFileInPwd(projectPath + ".gitignore", NewRunner.GIT_IGNORE_TEMPLATE);
      fileSystem.makeFileInPwd(projectPath + "README.md", NewRunner.README_TEMPLATE);
      fileSystem.makeFileInPwd(projectPath + "LICENSE", NewRunner.LICENSE_TEMPLATE);
      fileSystem.makeDirInPwd(projectPath + "source");
      fileSystem.makeDirInPwd(projectPath + "spec");
      fileSystem.makeDirInPwd(projectPath + "features");
      fileSystem.makeDirInPwd(projectPath + "features/step_definitions");

      self.installNpmDeps(projectPath);
    },

    installNpmDeps: function installNpmDeps(projectPath) {
      var oldCwd = process.cwd();
      console.log(oldCwd);
      process.chdir(projectPath);

      var cmd = "npm install";

      var child = exec(cmd, function (error, stdout, stderr) {
        if (null === error) {
          child.kill();
        } else {
          console.log("error:");
          console.log(error);
          console.log("stdout = '" + stdout + "'");
          console.log("stderr:");
          console.log(stderr);
          throw new Error("init did not run.");
        }
      });
    }
  };

  return self;
};

NewRunner.PROJECT_NAME_MISSING_ERROR  = "You must provide a project name: rebar new my_project";
NewRunner.PROJECT_DIR_EXISTS_ERROR    = "A directory already exists with the name you've chosen for your project.";
NewRunner.FileSystem                  = require("../utils/file_system");
NewRunner.Logger                      = require("../utils/logger");

NewRunner.PACKAGE_JSON_TEMPLATE      = require("./templates/package_json_template");
NewRunner.GRUNT_JS_TEMPLATE          = require("./templates/grunt_js_template");
NewRunner.GIT_IGNORE_TEMPLATE        = require("./templates/gitignore_template");
NewRunner.CLASS_JS_TEMPLATE          = require("./templates/class_template");
NewRunner.UNIT_TEST_TEMPLATE         = require("./templates/unit_test_template");
NewRunner.UNIT_TEST_REQUIRE_TEMPLATE = require("./templates/unit_test_require_template");
NewRunner.STEP_DEFINITION_TEMPLATE   = require("./templates/step_definition_template");
NewRunner.CUCUMBER_FEATURE_TEMPLATE  = require("./templates/cucumber_feature_template");
NewRunner.README_TEMPLATE            = require("./templates/readme_template");
NewRunner.LICENSE_TEMPLATE           = require("./templates/license_template");
NewRunner.REBAR_JSON_TEMPLATE        = require("./templates/rebar_json_template");
NewRunner.CLASS_REQUIREJS_TEMPLATE   = require("./templates/class_requirejs_template");

module.exports = NewRunner;