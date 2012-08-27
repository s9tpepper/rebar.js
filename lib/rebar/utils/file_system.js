var FileSystem = function FileSystem(fs, nodeProcess) {
  var self = {
    makeDirInPwd: function makeDirInPwd(dirName) {
      var cwd = nodeProcess.cwd();
      var newDirPath = cwd.concat("/"+dirName);
      fs.mkdirSync(newDirPath);
    },

    makeFileInPwd: function makeFileInPwd(fileName, fileContents) {
      fs.writeFileSync(fileName, fileContents);
    },

    isPwdEmpty: function isPwdEmpty() {
      var cwd = nodeProcess.cwd();
      var files = fs.readdirSync(cwd);

      var isEmpty;
      if (0 == files.length) {
        isEmpty = true;
      } else if (files.length > 0) {
        isEmpty = false;
      }
      return isEmpty;
    },

    dirExistsInPwd: function dirExistsInPwd(dirName) {
      var cwd = nodeProcess.cwd();
      var contents = fs.readdirSync(cwd);

      var dirExists = false;
      var item;
      for (var i = 0; i < contents.length; i++) {
        item = contents[i];
        if (dirName === item) {
          dirExists = true;
        }
      }

      return dirExists;
    }
  };

  return self;
};

module.exports = FileSystem;