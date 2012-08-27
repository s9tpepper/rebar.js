require("../../support/spec_helper");
var InitRunner = require("../../../lib/rebar/command_processor/init_runner");

describe("InitRunner", function () {

  var initRunner, commandArguments, FileSystem, fileSystem, logger;

  beforeEach(function () {
    logger      = createSpyWithStubs("logger", {success: null, error: null});
    fileSystem = createSpyWithStubs("file system", {isPwdEmpty: null, makeDirInPwd: null, makeFileInPwd: null, dirExistsInPwd: null});
    FileSystem = jasmine.createSpy("FileSystem").andReturn(fileSystem);

    InitRunner.FileSystem                 = FileSystem;
    InitRunner.PACKAGE_JSON_TEMPLATE      = "package.json template";
    InitRunner.GRUNT_JS_TEMPLATE          = "grunt.js template";
    InitRunner.GIT_IGNORE_TEMPLATE        = ".gitignore template";
    InitRunner.CLASS_JS_TEMPLATE          = "js class template";
    InitRunner.UNIT_TEST_TEMPLATE         = "unit test class template";
    InitRunner.STEP_DEFINITION_TEMPLATE   = "step definition template";
    InitRunner.CUCUMBER_FEATURE_TEMPLATE  = "cucumber feature template";
    InitRunner.README_TEMPLATE            = "README template";
    InitRunner.LICENSE_TEMPLATE           = "LICENSE template";
    InitRunner.REBAR_JSON_TEMPLATE        = "rebar.json template";
    InitRunner.Logger                     = jasmine.createSpy("Logger").andReturn(logger);

    initRunner = InitRunner();
  });

  describe("constructor", function () {
    beforeEach(function () {
    });

    it("makes a FileSystem object", function () {
      expect(InitRunner.FileSystem).toHaveBeenCalled();
    });

    it("makes a Logger", function () {
      expect(InitRunner.Logger).toHaveBeenCalled();
    });
  });

  describe("execute()", function () {
    beforeEach(function () {
      commandArguments = ["arg1", "arg2"];
    });

    it("asks the file system if the process's working directory is empty", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.isPwdEmpty).toHaveBeenCalled();
    });

    describe("when the pwd is not empty", function () {
      beforeEach(function () {
        fileSystem.isPwdEmpty.andReturn(false);
      });

      it("asks the file system if .rebar exists", function () {
        initRunner.execute(commandArguments);

        expect(fileSystem.dirExistsInPwd).toHaveBeenCalledWith(".rebar");
      });

      describe("when .rebar folder exists", function () {
        beforeEach(function () {
          fileSystem.dirExistsInPwd.andReturn(true);
        });

        it("logs an error with the .rebar folder exists message", function () {
          var expectedError = InitRunner.REBAR_FOLDER_EXISTS_ERROR;

          initRunner.execute(commandArguments);

          expect(logger.error).toHaveBeenCalledWith(expectedError);
        });
      });

      describe("when the .rebar folder doesn't exist", function () {
        beforeEach(function () {
          fileSystem.dirExistsInPwd.andReturn(false);

          spyOn(initRunner, "createRebarFolder");
        });

        it("creates the .rebar folder", function () {
          initRunner.execute(commandArguments);

          expect(initRunner.createRebarFolder).toHaveBeenCalled();
        });
      });
    });

    describe("when the pwd is empty", function () {
      beforeEach(function () {
        fileSystem.isPwdEmpty.andReturn(true);
        spyOn(initRunner, "createRebarFolder");
      });

      it("creates the .rebar folder", function () {
        initRunner.execute(commandArguments);

        expect(initRunner.createRebarFolder).toHaveBeenCalled();
      });
    });
  });

  describe("createRebarFolder", function () {
    it("makes a .rebar folder", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(".rebar");
    });

    it("makes the package.json file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/package.json", InitRunner.PACKAGE_JSON_TEMPLATE);
    });

    it("makes the grunt.js file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/grunt.js", InitRunner.GRUNT_JS_TEMPLATE);
    });

    it("makes the .gitignore file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/.gitignore", InitRunner.GIT_IGNORE_TEMPLATE);
    });

    it("makes the class.js file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/class.js", InitRunner.CLASS_JS_TEMPLATE);
    });

    it("makes the unit_test.js file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/unit_test.js", InitRunner.UNIT_TEST_TEMPLATE);
    });

    it("makes the step_definition.js file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/step_definition.js", InitRunner.STEP_DEFINITION_TEMPLATE);
    });

    it("makes the cucumber.feature file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/cucumber.feature", InitRunner.CUCUMBER_FEATURE_TEMPLATE);
    });

    it("makes the README.md file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/README.md", InitRunner.README_TEMPLATE);
    });

    it("makes the LICENSE file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/LICENSE", InitRunner.LICENSE_TEMPLATE);
    });

    it("makes the rebar.json file", function () {
      initRunner.execute(commandArguments);

      expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/rebar.json", InitRunner.REBAR_JSON_TEMPLATE);
    });

    it("logs the init success message to the console.", function () {
      initRunner.execute(commandArguments);

      expect(logger.success).toHaveBeenCalledWith(InitRunner.INIT_SUCCESS_MESSAGE);
    })
  });
});