require("../../support/spec_helper");
var CjsRunner = require("../../../lib/rebar/command_processor/cjs_runner");

describe("CjsRunner()", function () {
  var cjsRunner, fileSystem, logger, commandArguments, className;

  beforeEach(function () {
    className = "ClassName";
    commandArguments = [className];

    fileSystem = createSpyWithStubs("file system", {dirExistsInPwd: null});
    CjsRunner.FileSystem = jasmine.createSpy("file system").andReturn(fileSystem);

    logger = createSpyWithStubs("logger", {error: null});
    CjsRunner.Logger = jasmine.createSpy("Logger").andReturn(logger);

    cjsRunner = CjsRunner();
  });

  describe("constructor", function () {
    it("creates a FileSystem object", function () {
      expect(CjsRunner.FileSystem).toHaveBeenCalled();
    });

    it("creates a Logger object", function () {
      expect(CjsRunner.Logger).toHaveBeenCalled();
    });
  });

  describe("execute()", function () {
    beforeEach(function () {
      spyOn(commandArguments, "shift").andReturn(className);
      spyOn(cjsRunner, "checkIfClassFilesExist");
    });

    it("checks if the current working directory has a .rebar folder", function () {
      cjsRunner.execute(commandArguments);

      expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(".rebar");
    });

    describe("when the .rebar folder does not exist", function () {


      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturn(false);
      });

      it("logs a .rebar folder can not be found error", function () {
        var expectedError = "The .rebar folder can not be found in the current directory.";

        cjsRunner.execute(commandArguments);

        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });
    });

    describe("when the .rebar folder exists", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturn(true);
      });

      it("gets the requested class name", function () {
        cjsRunner.execute(commandArguments);

        expect(commandArguments.shift).toHaveBeenCalled();
      });

      it("checks if the class files exist", function () {
        cjsRunner.execute(commandArguments);

        expect(cjsRunner.checkIfClassFilesExist).toHaveBeenCalledWith(className);
      });

      describe("when the class files exist", function () {
        beforeEach(function () {
          cjsRunner.checkIfClassFilesExist.andReturn(true);

          spyOn(cjsRunner, "createClass");
          spyOn(cjsRunner, "createSpec");
        });

        it("doesn't create a class file", function () {
          cjsRunner.execute(commandArguments);

          expect(cjsRunner.createClass).not.toHaveBeenCalled();
        });

        it("doesn't create a spec file", function () {
          cjsRunner.execute(commandArguments);

          expect(cjsRunner.createSpec).not.toHaveBeenCalled();
        });

        it("logs a class files exist error", function () {
          var expectedError = "Files for that class name already exist. Delete them first or try another class name.";

          cjsRunner.execute(commandArguments);

          expect(logger.error).toHaveBeenCalledWith(expectedError);
        });
      });

      describe("when the class files don't exist", function () {
        beforeEach(function () {
          cjsRunner.checkIfClassFilesExist.andReturn(false);

          spyOn(cjsRunner, "createClass");
          spyOn(cjsRunner, "createSpec");
        });

        it("creates the class file", function () {
          cjsRunner.execute(commandArguments);

          expect(cjsRunner.createClass).toHaveBeenCalledWith(className);
        });

        it("creates the spec file", function () {
          cjsRunner.execute(commandArguments);

          expect(cjsRunner.createSpec).toHaveBeenCalledWith(className);
        });
      });
    });
  });

  describe("checkIfClassFilesExist()", function () {
    it("checks if the class file exists", function () {
      var expectedPath = "source/" + className + ".js";

      cjsRunner.checkIfClassFilesExist(className);

      expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(expectedPath);
    });

    it("checks if the test file exists", function () {
      var expectedPath = "spec/" + className + "_spec.js";

      cjsRunner.checkIfClassFilesExist(className);

      expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(expectedPath);
    });

    describe("when class and test files do not exist", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturnSeveral([false, false]);
      });

      it("returns false", function () {
        var filesExist = cjsRunner.checkIfClassFilesExist(className);

        expect(filesExist).toBe(false);
      });
    });

    describe("when class file does not exist but test file does", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturnSeveral([false, true]);
      });

      it("returns true", function () {
        var filesExist = cjsRunner.checkIfClassFilesExist(className);

        expect(filesExist).toBe(true);
      });
    });

    describe("when test file does not exist but class file does", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturnSeveral([true, false]);
      });

      it("returns true", function () {
        var filesExist = cjsRunner.checkIfClassFilesExist(className);

        expect(filesExist).toBe(true);
      });
    });
  });
});