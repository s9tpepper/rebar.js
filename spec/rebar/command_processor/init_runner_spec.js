require("../../support/spec_helper");
var InitRunner = require("../../../lib/rebar/command_processor/init_runner");

describe("InitRunner", function () {

  var initRunner, commandArguments, FileSystem, fileSystem;

  beforeEach(function () {
    fileSystem = createSpyWithStubs("file system", {isPwdEmpty: null, makeDirInPwd: null, makeFileInPwd: null});
    FileSystem = jasmine.createSpy("FileSystem").andReturn(fileSystem);

    InitRunner.FileSystem = FileSystem;
    InitRunner.PACKAGE_JSON_TEMPLATE = "package.json template";

    initRunner = InitRunner();
  });

  describe("constructor", function () {
    beforeEach(function () {
    });

    it("makes a FileSystem object", function () {
      expect(InitRunner.FileSystem).toHaveBeenCalled();
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

    describe("when the pwd is empty", function () {
      beforeEach(function () {
        fileSystem.isPwdEmpty.andReturn(true);
      });

      it("makes a .rebar folder", function () {
        initRunner.execute(commandArguments);

        expect(fileSystem.makeDirInPwd).toHaveBeenCalledWith(".rebar");
      });

      it("makes the package.json file", function () {
        initRunner.execute(commandArguments);

        expect(fileSystem.makeFileInPwd).toHaveBeenCalledWith("./.rebar/package.json", InitRunner.PACKAGE_JSON_TEMPLATE);
      });
    });
  });
});