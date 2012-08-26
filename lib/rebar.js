var Rebar = function Rebar() {

  var commandProcessor = Rebar.CommandProcessor();

  var self = {
    run: function run(command, commandArguments) {
      commandProcessor.process(command, commandArguments)
    }
  };

  return self;
};

Rebar.CommandProcessor = require("./rebar/command_processor");

module.exports = Rebar;