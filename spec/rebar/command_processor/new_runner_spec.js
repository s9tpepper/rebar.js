require("../../support/spec_helper");
var fs = require("fs");
var NewRunner = require("../../../lib/rebar/command_processor/new_runner");

describe("NewRunner()", function () {

  var newRunner, FileSystem, fileSystem, Logger, logger, commandArguments;

  beforeEach(function () {
    fileSystem = createSpyWithStubs("file system", {dirExistsInPwd: null, makeDirInPwd: null, makeFileInPwd: null});
    FileSystem = jasmine.createSpy("FileSystem").andReturn(fileSystem);
    NewRunner.FileSystem = FileSystem;

    logger = createSpyWithStubs("logger", {error: null});
    Logger = jasmine.createSpy("Logger").andReturn(logger);
    NewRunner.Logger = Logger;

    newRunner = NewRunner();
  });

  describe("constructor", function () {
    it("makes a FileSystem", function () {
      expect(NewRunner.FileSystem).toHaveBeenCalled();
    });

    it("makes a Logger", function () {
      expect(NewRunner.Logger).toHaveBeenCalled();
    });
  });

  describe("execute()", function () {
    beforeEach(function () {
    });

    describe("when the command arguments are null", function () {
      beforeEach(function () {
        commandArguments = null;
      });

      it("logs an error using the project name missing error", function () {
        var expectedError = NewRunner.PROJECT_NAME_MISSING_ERROR;

        newRunner.execute(commandArguments);

        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });

    });

    describe("when the command arguments are empty", function () {
      beforeEach(function () {
        commandArguments = [];
      });

      it("logs an error using the project name missing error", function () {
        var expectedError = NewRunner.PROJECT_NAME_MISSING_ERROR;

        newRunner.execute(commandArguments);

        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });

    });

    describe("when the command arguments have items", function () {
      var projectName = "project_name";
      beforeEach(function () {
        commandArguments = [projectName, "junk"];
        spyOn(commandArguments, "shift").andReturn(projectName);
        spyOn(newRunner, "createProjectFolder");
      });

      it("gets the first argument from commandArguments array", function () {
        newRunner.execute(commandArguments);

        expect(commandArguments.shift).toHaveBeenCalled();
      });

      it("asks the FileSystem if the directory exists in the pwd", function () {
        newRunner.execute(commandArguments);

        expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(projectName);
      });

      describe("when the directory does not exist in the pwd", function () {
        beforeEach(function () {
          fileSystem.dirExistsInPwd.andReturn(false);
        });

        it("creates the project folder", function () {
          newRunner.execute(commandArguments);

          expect(newRunner.createProjectFolder).toHaveBeenCalledWith(projectName, commandArguments);
        });
      });

      describe("when the directory exists in the pwd", function () {
        beforeEach(function () {
          fileSystem.dirExistsInPwd.andReturn(true);
        });

        it("logs an error using the project directory exists error", function () {
          var expectedError = NewRunner.PROJECT_DIR_EXISTS_ERROR;

          newRunner.execute(commandArguments);

          expect(logger.error).toHaveBeenCalledWith(expectedError);
        });
      });
    });

  });

  describe("createProjectFolder()", function () {
    var projectName = "project name";
    beforeEach(function () {
      commandArguments = [];

      spyOn(newRunner, "installNpmDeps");
    });

    it("creates the project folder", function () {
      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(projectName);
    });

    it("installs npm deps", function () {
      newRunner.createProjectFolder(projectName, commandArguments);

      expect(newRunner.installNpmDeps).toHaveBeenCalled();
    });

    it("creates the source folder", function () {
      var expectedFolderPath = "./" + projectName + "/source";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(expectedFolderPath);
    });

    it("creates the spec folder", function () {
      var expectedFolderPath = "./" + projectName + "/spec";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(expectedFolderPath);
    });

    it("creates the features folder", function () {
      var expectedFolderPath = "./" + projectName + "/features";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(expectedFolderPath);
    });

    it("creates the step definitions folder", function () {
      var expectedFolderPath = "./" + projectName + "/features/step_definitions";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(expectedFolderPath);
    });

    it("creates the .rebar folder", function () {
      var expectedRebarPath = "./" + projectName + "/.rebar";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(expectedRebarPath);
    });

    it("creates the rebar.json file", function () {
      var expectedRebarJsonPath = "./" + projectName + "/.rebar/rebar.json";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedRebarJsonPath, NewRunner.REBAR_JSON_TEMPLATE);
    });

    it("creates the class.js file", function () {
      var expectedClassFilePath = "./" + projectName + "/.rebar/class.js";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedClassFilePath, NewRunner.CLASS_JS_TEMPLATE);
    });

    it("creates the class_require.js file", function () {
      var expectedClassFilePath = "./" + projectName + "/.rebar/class_require.js";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedClassFilePath, NewRunner.CLASS_REQUIREJS_TEMPLATE);
    });

    it("creates the unit_test.js file", function () {
      var expectedFilePath = "./" + projectName + "/.rebar/unit_test.js";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.UNIT_TEST_TEMPLATE);
    });

    it("creates the unit_test_require.js file", function () {
      var expectedFilePath = "./" + projectName + "/.rebar/unit_test_require.js";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.UNIT_TEST_REQUIRE_TEMPLATE);
    });

    it("creates the step_definition.js file", function () {
      var expectedFilePath = "./" + projectName + "/.rebar/step_definition.js";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.STEP_DEFINITION_TEMPLATE);
    });

    it("creates the cucumber.feature file", function () {
      var expectedFilePath = "./" + projectName + "/.rebar/cucumber.feature";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.CUCUMBER_FEATURE_TEMPLATE);
    });

    it("creates the package.json file", function () {
      var expectedFilePath = "./" + projectName + "/package.json";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.PACKAGE_JSON_TEMPLATE);
    });

    it("creates the grunt.js file", function () {
      var expectedFilePath = "./" + projectName + "/grunt.js";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.GRUNT_JS_TEMPLATE);
    });

    it("creates the .gitignore file", function () {
      var expectedFilePath = "./" + projectName + "/.gitignore";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.GIT_IGNORE_TEMPLATE);
    });

    it("creates the README.md file", function () {
      var expectedFilePath = "./" + projectName + "/README.md";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.README_TEMPLATE);
    });

    it("creates the LICENSE file", function () {
      var expectedFilePath = "./" + projectName + "/LICENSE";

      newRunner.createProjectFolder(projectName, commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith(expectedFilePath, NewRunner.LICENSE_TEMPLATE);
    });

  });



});