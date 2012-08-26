var fs = require('fs');
var assert = require('assert');

var init_steps = function init_steps() {
  var World = require("../support/rebar_world").World;
  this.World = World;

  var cwd = process.cwd();
  var tempDirectory = cwd + "/tmp";

  function deleteTempDir(world) {
    if (fs.existsSync(tempDirectory)) {
      world.deleteDirectory(tempDirectory);
    }
  }

  this.Before(function (callback) {
    callback();
  });

  this.After(function (callback) {
    callback();
  });

  this.Given(/^the current working directory is empty$/, function(callback) {
    deleteTempDir(this);

    fs.mkdirSync(tempDirectory);

    try {
      process.chdir(tempDirectory);
      callback();
    } catch (e) {
      console.log(e);
      throw new Error("Failed to move into a new empty temp directory.");
    }
  });

  this.When(/^the 'rebar init' command is executed$/, function(callback) {
    this.runRebarCommand("init");
    callback();
  });

  this.Then(/^a "([^"]*)" folder is created in the current working directory$/, function(folderName, callback) {
    var folderPath = process.cwd() + "/" + folderName;
    var folderExists = fs.existsSync(folderPath);
    assert.ok(folderExists, "Folder does not exist at: " + folderPath);
    callback();
  });

  this.Then(/^a file is created named "([^"]*)"$/, function(fileName, callback) {
    var filePath = process.cwd() + "/.rebar/" + fileName;
    var fileExists = fs.existsSync(filePath);
    assert.ok(fileExists, "File does not exist at: " + filePath);
    callback();
  });

};

module.exports = init_steps;