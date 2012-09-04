var HelpRunner = function HelpRunner() {
  var logger = HelpRunner.Logger();

  var help = "rebar - A JavaScript code generation tool.\n\
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
For more information please see: https://github.com/s9tpepper/rebar.js";

  var self = {
    execute: function execute(commandArguments) {
      logger.write(help);
    }
  };

  return self;
};

HelpRunner.Logger      = require("../utils/logger");

module.exports = HelpRunner;