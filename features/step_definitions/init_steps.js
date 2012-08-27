var fs = require('fs');
var assert = require('assert');

var init_steps = function init_steps() {
  var World = require("../support/rebar_world").World;
  this.World = World;

  var cwd, tempDirectory, originalCwd;
  var lastCommandError, lastCommandStdout, lastCommandStderr;

  function deleteTempDir(world) {
    if (fs.existsSync(tempDirectory)) {
      world.deleteDirectory(tempDirectory);
    }
  }

  this.Before(function (callback) {
    cwd = process.cwd();
    tempDirectory = cwd + "/tmp";
    callback();
  });

  this.After(function (callback) {
    lastCommandError = null;
    lastCommandStderr = null;
    lastCommandStdout = null;
    process.chdir(cwd);
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
    var exec = require("child_process").exec;
    var cmd = "../bin/rebar.js init";

    var child = exec(cmd, function (error, stdout, stderr) {
      lastCommandError = error;
      lastCommandStderr = stderr;
      lastCommandStdout = stdout;

      if (null === error) {
        child.kill();
        callback();
      } else {
        console.log("error:");
        console.log(error);
        console.log("stdout = '" + stdout + "'");
        console.log("stderr:");
        console.log(stderr);
        throw new Error("init did not run.");
      }
    });
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

  this.Given(/^the current working directory is not empty$/, function(callback) {
    deleteTempDir(this);

    fs.mkdirSync(tempDirectory);
    fs.mkdirSync(tempDirectory + "/.rebar");

    try {
      process.chdir(tempDirectory);
      callback();
    } catch (e) {
      console.log(e);
      throw new Error("Failed to move into a new temp directory with content.");
    }
  });

  this.Then(/^the \.rebar folder exists error is sent to the console$/, function(callback) {
    var expectedMsg = ">> ERROR".red + " :: The .rebar folder exists.\n";
    assert.equal(lastCommandStdout, expectedMsg);
    callback();
  });

};

module.exports = init_steps;