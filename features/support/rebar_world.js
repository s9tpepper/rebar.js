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

      fStats = fs.statSync(directoryPath);

      if (fStats.isFile()) {
        fs.unlinkSync(directoryPath);
      } else if (fStats.isDirectory()) {
        world.deleteDirectory(directoryPath);
      }
    }
    fs.rmdirSync(path);
  };

  World.mostRecentInstance = this;

  callback(World);
};

exports.World = World;