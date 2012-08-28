require("../../support/spec_helper");
var FileSystem = require("../../../lib/rebar/utils/file_system");

describe("FileSystem", function () {

  var fileSystem, fs, nodeProcess, currentWorkingDirectory, newDirPath, dirName;

  beforeEach(function () {
    dirName = "new directory name";
    newDirPath = createSpyWithStubs("new directory path", {});
    currentWorkingDirectory = createSpyWithStubs("process cwd", {concat: newDirPath});
    nodeProcess = createSpyWithStubs("node process object", {cwd: currentWorkingDirectory});
    fs = createSpyWithStubs("node fs module", {mkdirSync: null, writeFileSync: null, readdirSync: []});
    fileSystem = FileSystem(fs, nodeProcess);
  });

  describe("makeDirInPwd()", function () {
    it("gets the process's current working directory", function () {
      fileSystem.makeDirInPwd(dirName);

      expect(nodeProcess.cwd).toHaveBeenCalled();
    });

    it("concatenates the new directory name to the cwd", function () {
      fileSystem.makeDirInPwd(dirName);

      expect(currentWorkingDirectory.concat).toHaveBeenCalledWith("/"+dirName);
    });

    it("makes the new directory", function () {
      fileSystem.makeDirInPwd(dirName);

      expect(fs.mkdirSync).toHaveBeenCalledWith(newDirPath);
    });
  });

  describe("makeFileInPwd()", function () {
    it("makes the file", function () {
      fileSystem.makeFileInPwd("fileName", "file contents");

      expect(fs.writeFileSync).toHaveBeenCalledWith("fileName", "file contents");
    });
  });

  describe("isPwdEmpty()", function () {
    it("gets the cwd", function () {
      fileSystem.isPwdEmpty();

      expect(nodeProcess.cwd).toHaveBeenCalled();
    });

    it("gets the list of files in the cwd", function () {
      fileSystem.isPwdEmpty();

      expect(fs.readdirSync).toHaveBeenCalledWith(currentWorkingDirectory);
    });

    describe("when there are no contents in the directory", function () {
      beforeEach(function () {
        fs.readdirSync.andReturn([]);
      });

      it("returns true", function () {
        var isEmpty = fileSystem.isPwdEmpty();
        expect(isEmpty).toBe(true);
      })
    });

    describe("when there are contents in the directory", function () {
      beforeEach(function () {
        fs.readdirSync.andReturn(['name', 'another name']);
      });

      it("returns false", function () {
        var isEmpty = fileSystem.isPwdEmpty();
        expect(isEmpty).toBe(false);
      })
    });
  });

  describe("dirExistsInPwd()", function () {
    it("gets the cwd", function () {
      fileSystem.dirExistsInPwd();
      expect(nodeProcess.cwd).toHaveBeenCalled();
    });

    it("gets the list of files in the cwd", function () {
      fileSystem.dirExistsInPwd("dirName");

      expect(fs.readdirSync).toHaveBeenCalledWith(currentWorkingDirectory);
    });

    describe("when the list has the folder being searched in it", function () {
      beforeEach(function () {
        fs.readdirSync.andReturn(["somefile.txt", ".rebar"]);
      });

      it("returns true", function () {
        var folderSearch = ".rebar";
        var rebarExists = fileSystem.dirExistsInPwd(folderSearch);
        expect(rebarExists).toBe(true);
      });
    });

    describe("when the list does not have the folder being searched for in it", function () {
      beforeEach(function () {
        fs.readdirSync.andReturn(["someFile.txt"]);
      });

      it("returns false", function () {
        var folderSearch = ".rebar";
        var rebarExists = fileSystem.dirExistsInPwd(folderSearch);
        expect(rebarExists).toBe(false);
      });
    });
  });
});