require("../../support/spec_helper");
var NewRunner = require("../../../lib/rebar/command_processor/new_runner");

describe("NewRunner()", function () {

  var newRunner, FileSystem, fileSystem, Logger, logger;

  beforeEach(function () {
    fileSystem = createSpyWithStubs("file system", {dirExistsInPwd: null});
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
    var commandArguments;

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

          spyOn(newRunner, "createProjectFolder");
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
    beforeEach(function () {
    });
  });

});