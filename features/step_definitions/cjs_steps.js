var assert = require("assert");
var fs = require("fs");
var exec = require("child_process").exec;

var cjs_steps = function cjs_steps() {

  this.World = require("../support/rebar_world").World;

  var cwd, tempDirectory, originalCwd;
  var lastCommandError, lastCommandStdout, lastCommandStderr;

  function deleteTempDir(world) {
    if (fs.existsSync(tempDirectory)) {
      world.deleteDirectory(tempDirectory);
    }
  }

  this.Before(function (callback) {
    deleteTempDir(this);
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

  this.Given(/^the user is in the root folder of a rebar\.js project$/, function(callback) {
    fs.mkdirSync(tempDirectory);
    process.chdir(tempDirectory);

    var child = exec("../bin/rebar new Test", function (error, stdout, stderr) {
      lastCommandError = error;
      lastCommandStderr = stderr;
      lastCommandStdout = stdout;

      if (null === error) {
        child.kill();
        process.chdir(tempDirectory + "/Test");

        if (fs.existsSync(process.cwd() + "/.rebar")) {
          callback();
        } else {
          callback.fail(new Error("The .rebar folder does not exist in the pwd"));
        }
      } else {
        console.log("error:");
        console.log(error);
        console.log("stdout = '" + stdout + "'");
        console.log("stderr:");
        console.log(stderr);
        callback.fail(new Error("Could not start a tmp rebar project."));
      }
    });
  });

  this.Given(/^the "([^"]*)" files do not exist$/, function(className, callback) {
    var classPath = "source/" + className + ".js";
    var testPath = "spec/" + className + "_spec.js";

    var classExists = fs.existsSync(classPath);
    var testExists = fs.existsSync(testPath);

    assert.equal(classExists, false, "The class file exists.");
    assert.equal(testExists, false, "The test file exists.");

    callback();
  });

  this.When(/^the user runs "([^"]*)"$/, function(command, callback) {
    var child = exec("../../bin/" + command, function (error, stdout, stderr) {
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
        callback.fail(new Error("Could not run 'cjs' command from " + process.cwd()));
      }
    });
  });

  this.Then(/^the "([^"]*)" js file is created in the "([^"]*)" directory$/, function(fileName, dir, callback) {
    var filePath = dir + "/" + fileName + ".js";
    assert.ok(fs.existsSync(filePath), "Could not locate: " + filePath);
    callback();
  });




  this.Given(/^the user is not in the root of a rebar\.js project$/, function(callback) {
    var isRebarFolder = fs.existsSync(process.cwd() + "/.rebar");
    assert.equal(isRebarFolder, false, "Found an unexpected .rebar folder.");
    callback();
  });

  this.When(/^the user runs 'rebar cjs MyClass'$/, function(callback) {
    var child = exec("bin/rebar cjs MyClass", function (error, stdout, stderr) {
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
        callback.fail(new Error("Could not run 'cjs' command from " + process.cwd()));
      }
    });
  });

  this.Then(/^the console tells the user they're not in a rebar\.js project$/, function(callback) {
    var expectedError = ">> ERROR".red + " :: The .rebar folder can not be found in the current directory.\n";
    assert.equal(lastCommandStdout, expectedError, "Did not output correct error message: " + lastCommandStdout);
    callback();
  });



  this.Given(/^the "([^"]*)" js file exists$/, function(className, callback) {
    var filePath = "source/" + className + ".js";
    fs.writeFileSync(filePath, "test");
    assert.ok(fs.existsSync, "Did not find: " + filePath + ", in the pwd: " + process.cwd());
    callback();
  });

  this.Then(/^the console tells the user that the "([^"]*)" file exists$/, function(arg1, callback) {
    var expectedError = ">> ERROR".red + " :: Files for that class name already exist. Delete them first or try another class name.\n";
    assert.equal(lastCommandStdout, expectedError, "Did not output correct file exists error message: " + lastCommandStdout);
    callback();
  });


  this.Given(/^the MyClass_spec\.js file exists$/, function(callback) {
    var filePath = "spec/MyClass_spec.js";
    fs.writeFileSync(filePath, "test");
    assert.ok(fs.existsSync, "Did not find: " + filePath + ", in the pwd: " + process.cwd());
    callback();
  });

};

module.exports = cjs_steps;