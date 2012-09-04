var path = require("path");
var FileSystem = function FileSystem(fs, nodeProcess) {
  var self = {
    readFile: function readFile(filePath) {
      return String(fs.readFileSync(filePath));
    },

    makeDirInPwd: function makeDirInPwd(dirName) {
      var cwd = nodeProcess.cwd();
      var newDirPath = cwd.concat(path.sep + dirName);
      fs.mkdirSync(newDirPath);
    },

    makeFileInPwd: function makeFileInPwd(fileName, fileContents) {
      fs.writeFileSync(fileName, fileContents);
    },

    isPwdEmpty: function isPwdEmpty() {
      var cwd = nodeProcess.cwd();
      var files = fs.readdirSync(cwd);

      var isEmpty;
      if (0 === files.length) {
        isEmpty = true;
      } else if (files.length > 0) {
        isEmpty = false;
      }
      return isEmpty;
    },

    dirExistsInPwd: function dirExistsInPwd(dirName) {
      return fs.existsSync(dirName);
    }
  };

  return self;
};

module.exports = FileSystem;