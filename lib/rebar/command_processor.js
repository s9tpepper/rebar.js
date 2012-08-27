var CommandProcessor = function CommandProcessor() {
  var commands = ["init","project","class","feature","test"];
  var logger = CommandProcessor.Logger();

  var commandMap = {
    init:     CommandProcessor.InitRunner,
    project:  CommandProcessor.ProjectRunner
  };

  var self = {
    process: function process(command, commandArguments) {
      var commandNames = self.getCommandNames();
      var commandIndex = commandNames.lastIndexOf(command);

      if (commandIndex > -1) {
        var runner = self.getRunnerFor(command);
        runner.execute(commandArguments);
      } else {
        logger.error(CommandProcessor.COMMAND_NOT_FOUND_ERROR.replace("%COMMAND%", command));
      }
    },

    getRunnerFor: function getRunnerFor(command) {
      return commandMap[command]();
    },

    getCommandNames: function getCommandNames() {
      return commands;
    }
  };

  return self;
};

CommandProcessor.COMMAND_NOT_FOUND_ERROR  = "The %COMMAND% command was not found. Try 'rebar help' for a list of commands";
CommandProcessor.Logger                   = require("./utils/logger");
CommandProcessor.InitRunner               = require("./command_processor/init_runner");
CommandProcessor.ProjectRunner            = require("./command_processor/project_runner");

module.exports = CommandProcessor;