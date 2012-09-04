require("../../support/spec_helper");
var path = require("path");
var AmdRunner = require("../../../lib/rebar/command_processor/amd_runner");

describe("AmdRunner()", function () {
  var amdRunner, fileSystem, logger, commandArguments, className, contents, classContents, finalTestContents,
    pathParts;

  beforeEach(function () {
    pathParts = ["deep", "deeper", "ClassName"];
    className = createSpyWithStubs("deep/deeper/ClassName", {lastIndexOf: 3, charAt: "C", toLowerCase: "c", slice: "lassName", split: pathParts});
    commandArguments = [className];

    finalTestContents = createSpyWithStubs("final test contents", {replace: "test"});
    classContents = createSpyWithStubs("class contents", {replace: finalTestContents});
    contents = createSpyWithStubs("contents string", {replace: classContents});
    fileSystem = createSpyWithStubs("file system", {dirExistsInPwd: null, readFile: contents, makeFileInPwd: null, makeDirInPwd: null});
    AmdRunner.FileSystem = jasmine.createSpy("file system").andReturn(fileSystem);

    logger = createSpyWithStubs("logger", {error: null});
    AmdRunner.Logger = jasmine.createSpy("Logger").andReturn(logger);

    amdRunner = AmdRunner();
  });

  describe("constructor", function () {
    it("creates a FileSystem object", function () {
      expect(AmdRunner.FileSystem).toHaveBeenCalled();
    });

    it("creates a Logger object", function () {
      expect(AmdRunner.Logger).toHaveBeenCalled();
    });
  });

  describe("execute()", function () {
    beforeEach(function () {
      className = "ClassName";
      spyOn(commandArguments, "shift").andReturn(className);
      spyOn(amdRunner, "checkIfClassFilesExist");
    });

    it("checks if the current working directory has a .rebar folder", function () {
      amdRunner.execute(commandArguments);

      expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(".rebar");
    });

    describe("when the .rebar folder does not exist", function () {


      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturn(false);
      });

      it("logs a .rebar folder can not be found error", function () {
        var expectedError = "The .rebar folder can not be found in the current directory.";

        amdRunner.execute(commandArguments);

        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });
    });

    describe("when the .rebar folder exists", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturn(true);
      });

      it("gets the requested class name", function () {
        amdRunner.execute(commandArguments);

        expect(commandArguments.shift).toHaveBeenCalled();
      });

      it("checks if the class files exist", function () {
        amdRunner.execute(commandArguments);

        expect(amdRunner.checkIfClassFilesExist).toHaveBeenCalledWith(className);
      });

      describe("when the class files exist", function () {
        beforeEach(function () {
          amdRunner.checkIfClassFilesExist.andReturn(true);

          spyOn(amdRunner, "createClass");
          spyOn(amdRunner, "createSpec");
        });

        it("doesn't create a class file", function () {
          amdRunner.execute(commandArguments);

          expect(amdRunner.createClass).not.toHaveBeenCalled();
        });

        it("doesn't create a spec file", function () {
          amdRunner.execute(commandArguments);

          expect(amdRunner.createSpec).not.toHaveBeenCalled();
        });

        it("logs a class files exist error", function () {
          var expectedError = "Files for that class name already exist. Delete them first or try another class name.";

          amdRunner.execute(commandArguments);

          expect(logger.error).toHaveBeenCalledWith(expectedError);
        });
      });

      describe("when the class files don't exist", function () {
        beforeEach(function () {
          amdRunner.checkIfClassFilesExist.andReturn(false);

          spyOn(amdRunner, "createClass");
          spyOn(amdRunner, "createSpec");
        });

        it("creates the class file", function () {
          amdRunner.execute(commandArguments);

          expect(amdRunner.createClass).toHaveBeenCalledWith(className);
        });

        it("creates the spec file", function () {
          amdRunner.execute(commandArguments);

          expect(amdRunner.createSpec).toHaveBeenCalledWith(className);
        });
      });
    });
  });

  describe("checkIfClassFilesExist()", function () {
    it("checks if the class file exists", function () {
      var expectedPath = "source/" + className + ".js";

      amdRunner.checkIfClassFilesExist(className);

      expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(expectedPath);
    });

    it("checks if the test file exists", function () {
      var expectedPath = "spec/" + className + "_spec.js";

      amdRunner.checkIfClassFilesExist(className);

      expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(expectedPath);
    });

    describe("when class and test files do not exist", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturnSeveral([false, false]);
      });

      it("returns false", function () {
        var filesExist = amdRunner.checkIfClassFilesExist(className);

        expect(filesExist).toBe(false);
      });
    });

    describe("when class file does not exist but test file does", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturnSeveral([false, true]);
      });

      it("returns true", function () {
        var filesExist = amdRunner.checkIfClassFilesExist(className);

        expect(filesExist).toBe(true);
      });
    });

    describe("when test file does not exist but class file does", function () {
      beforeEach(function () {
        fileSystem.dirExistsInPwd.andReturnSeveral([true, false]);
      });

      it("returns true", function () {
        var filesExist = amdRunner.checkIfClassFilesExist(className);

        expect(filesExist).toBe(true);
      });
    });
  });

  describe("createClass()", function () {
    beforeEach(function () {
      spyOn(pathParts, "pop").andReturn("ClassName");
    });

    it("reads the class.js file", function () {
      amdRunner.createClass(className);

      expect(fileSystem.readFile).toHaveBeenCalledWith("./.rebar/class_require.js");
    });

    it("replaces the class name token with the class name", function () {
      amdRunner.createClass(className);

      expect(contents.replace).toHaveBeenCalledWith(/%CLASS_NAME%/gm, className);
    });

    it("splits the className by the path separator", function () {
      amdRunner.createClass(className);

      expect(className.split).toHaveBeenCalledWith(path.sep);
    });

    it("pops the actual class name off the path parts array", function () {
      amdRunner.createClass(className);

      expect(pathParts.pop).toHaveBeenCalled();
    });

    it("makes sure the path to the new class exists", function () {
      amdRunner.createClass(className);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith("source/deep");
      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith("source/deep/deeper");
    });

    it("makes the file", function () {
      amdRunner.createClass(className);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("source/"+className+".js", classContents);
    });
  });

  describe("createSpec()", function () {

    beforeEach(function () {
      spyOn(pathParts, "pop").andReturn("ClassName");
    })

    it("splits the class name by the path separator", function () {
      amdRunner.createSpec(className);

      expect(className.split).toHaveBeenCalledWith(path.sep);
    });

    it("pops the class name off the path parts array", function () {
      amdRunner.createSpec(className);

      expect(pathParts.pop).toHaveBeenCalled();
    });

    it("makes sure the path to the new class exists", function () {
      amdRunner.createSpec(className);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith("spec/deep");
      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith("spec/deep/deeper");
    });

    it("reads the unit_test.js file", function () {
      amdRunner.createSpec(className);

      expect(fileSystem.readFile).toHaveBeenCalledWith("./.rebar/unit_test_require.js");
    });

    it("replaces the class name token with the class name", function () {
      amdRunner.createSpec(className);

      expect(contents.replace).toHaveBeenCalledWith(/%CLASS_NAME%/gm, "ClassName");
    });

    it("replaces the class var token with the class instance var name", function () {
      var classVarName = "className";

      amdRunner.createSpec(className);

      expect(classContents.replace).toHaveBeenCalledWith(/%CLASS_VAR%/gm, classVarName);
    });

    it("replaces the class depth with correct relative path", function () {
      amdRunner.createSpec("deep/deeper/ClassName");

      expect(finalTestContents.replace).toHaveBeenCalledWith(/%CLASS_DEPTH%/gm, "../../../source/deep/deeper/ClassName");
    });

    it("makes the file", function () {
      amdRunner.createSpec("deep/deeper/ClassName");

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("spec/deep/deeper/ClassName_spec.js", "test");
    });
  });
});