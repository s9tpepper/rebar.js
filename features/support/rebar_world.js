var fs = require("fs");
var Rebar = require("../../lib/rebar");
var rebar = Rebar();
var World = function (callback) {
  World.runRebarCommand = function runRebarCommand(commandName, commandArguments) {
    rebar.run(commandName, commandArguments);
  };

  World.deleteDirectory = function deleteDirectory(path) {
    var world = this;
    var directoryContents = fs.readdirSync(path);
    var directoryPath;
    var fStats;
    for (var i = 0; i < directoryContents.length; i++) {
      directoryPath = path + "/" + directoryContents[i];

      if (fs.existsSync(directoryPath)) {
        fStats = fs.statSync(directoryPath);

        if (fStats.isFile()) {
          fs.unlinkSync(directoryPath);
        } else if (fStats.isDirectory()) {
          world.deleteDirectory(directoryPath);
        }
      }
    }

    if (0 == fs.readdirSync(path).length) {
      fs.rmdirSync(path);
    } else {
      world.deleteDirectory(path);
    }
  };

  World.mostRecentInstance = this;

  callback(World);
};

exports.World = World;