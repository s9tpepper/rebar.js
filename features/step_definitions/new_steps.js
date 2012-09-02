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
    deleteTempDir(this);
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

  var child;
  this.When(/^the command "([^"]*)" is run$/, function(command, callback) {
    var exec = require("child_process").exec;
    var cmd = "../bin/" + command;

    child = exec(cmd, function (error, stdout, stderr) {
      lastCommandError = error;
      lastCommandStderr = stderr;
      lastCommandStdout = stdout;

      if (null === error) {
//        child.kill();
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
    function checkPath() {
      var pathExists = fs.existsSync(path);
      assert.ok(pathExists, "Path does not exist at: " + process.cwd() + path);
      callback();
    }

    if (path.search("node_modules") > -1) {
      setTimeout(checkPath, 3000);
    } else {
      checkPath();
    }
  });

  this.Given(/^the current working directory has a folder named "([^"]*)"$/, function(projectName, callback) {
    deleteTempDir(this);
    fs.mkdirSync(tempDirectory);

    var testProjectPath = tempDirectory+"/"+projectName;
    fs.mkdirSync(testProjectPath);

    process.chdir(tempDirectory);

    assert.ok(fs.existsSync(testProjectPath));

    callback();
  });

  this.Then(/^the folder exists with project name error is outputted to console$/, function(callback) {
    var expectedError = ">> ERROR".red + " :: A directory already exists with the name you've chosen for your project.\n";

    assert.equal(lastCommandStdout, expectedError, "pwd: " + process.cwd() + "\n\
    lastCommandError = " + lastCommandError + "\n\
    lastCommandStderr = " + lastCommandStderr + "\n\
    lastCommandStdout = '" + lastCommandStdout + "'\n\
    ");

    callback();
  });
};

module.exports = new_steps;