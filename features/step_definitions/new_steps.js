var fs = require('fs');
var assert = require('assert');

var new_steps = function new_steps() {
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

  this.Given(/^the current working directory does not have a folder named "([^"]*)"$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
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

  this.When(/^the command "([^"]*)" is run$/, function(command, callback) {
    var exec = require("child_process").exec;
    var cmd = "../bin/" + command;

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

  this.Then(/^"([^"]*)" is created in the current working directory$/, function(path, callback) {
    // express the regexp above with the code you wish you had
    var pathExists = fs.existsSync(path);
    assert.ok(pathExists, "Path does not exist at: " + path);
    callback();
  });

  this.Given(/^the current working directory has a folder named "([^"]*)"$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^the folder exists with project name error is outputted to console$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });
};

module.exports = new_steps;