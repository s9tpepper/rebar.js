var assert = require("assert");
var exec = require("child_process").exec;

var help_steps = function help_steps() {
  var lastCommandError, lastCommandStdout, lastCommandStderr;

  this.When(/^the user runs 'rebar help'$/, function(callback) {
    var child = exec("bin/rebar help", function (error, stdout, stderr) {
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
        callback.fail(new Error("Could not run help command."));
      }
    });
  });

  this.Then(/^the help content is displayed:$/, function(string, callback) {
    var helpContent = "rebar - A JavaScript code generation tool.\n\
\n\
Usage\n\
rebar [cmd] [args]\n\
\n\
Commands\n\
new   Creates a new project folder and files\n\
cjs   Creates a new CommonJS based class file and test stub\n\
amd   Creates a new AMD based class file and test stub\n\
help   This help file\n\
\n\
For more information please see: https://github.com/s9tpepper/rebar.js\n";

    assert.equal(lastCommandStdout, helpContent, "The help content was not displayed correctly.");

    callback();
  });
};

module.exports = help_steps;