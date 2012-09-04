require("../support/spec_helper");

describe("CommandProcessor", function () {

  var CommandProcessor = require("../../lib/rebar/command_processor");
  var commandProcessor, logger, command, NewRunner, newRunner, CjsRunner, cjsRunner,
    AmdRunner, amdRunner, HelpRunner, helpRunner;

  var knownCommands = ["new","amd","cjs","feature","help"];

  beforeEach(function () {
    command = jasmine.createSpy("command-name");
    logger = createSpyWithStubs("logger", {error: null});
    CommandProcessor.Logger = jasmine.createSpy("Logger").andReturn(logger);

    helpRunner = createSpyWithStubs("help command runner", {execute: null});
    HelpRunner = jasmine.createSpy("HelpRunner").andReturn(helpRunner);
    CommandProcessor.HelpRunner = HelpRunner;

    newRunner = createSpyWithStubs("new command runner", {execute: null});
    NewRunner = jasmine.createSpy("NewRunner").andReturn(newRunner);
    CommandProcessor.NewRunner = NewRunner;

    amdRunner = createSpyWithStubs("amd command runner", {execute: null});
    AmdRunner = jasmine.createSpy("AmdRunner").andReturn(amdRunner);
    CommandProcessor.AmdRunner = AmdRunner;

    cjsRunner = createSpyWithStubs("cjs command runner", {execute: null});
    CjsRunner = jasmine.createSpy("CjsRunner").andReturn(cjsRunner);
    CommandProcessor.CjsRunner = CjsRunner;

    commandProcessor = CommandProcessor();
  });

  describe("constructor", function () {
    it("creates list of known commands/getCommandNames()", function () {
      expect(commandProcessor.getCommandNames()).toEqual(knownCommands);
    });

    it("creates a Logger", function () {
      expect(CommandProcessor.Logger).toHaveBeenCalled();
    });
  });

  describe("process()", function () {
    var commands, commandArguments;

    beforeEach(function () {
      commandArguments = jasmine.createSpy("command-arguments array");
      commands = createSpyWithStubs("commands array", {lastIndexOf: -1});

      spyOn(commandProcessor, "getCommandNames").andReturn(commands);
    });

    it("gets the command names", function () {
      commandProcessor.process(command, commandArguments);

      expect(commandProcessor.getCommandNames).toHaveBeenCalled();
    });

    it("validates that the requested command is in the commands list", function () {
      commandProcessor.process(command, commandArguments);

      expect(commands.lastIndexOf).toHaveBeenCalledWith(command);
    });

    describe("when the command is found", function () {
      var runner;

      beforeEach(function () {
        runner = createSpyWithStubs("command runner", {execute: null});
        commands.lastIndexOf.andReturn(0);
        spyOn(commandProcessor, "getRunnerFor").andReturn(runner);
      });

      it("gets the runner for the requested command", function () {
        commandProcessor.process(command, commandArguments);

        expect(commandProcessor.getRunnerFor).toHaveBeenCalledWith(command);
      });

      it("tells the runner to execute the arguments for the command", function () {
        commandProcessor.process(command, commandArguments);

        expect(runner.execute).toHaveBeenCalledWith(commandArguments);
      });
    });


    describe("when the command is not found", function () {
      beforeEach(function () {
        commands.lastIndexOf.andReturn(-1);
        spyOn(commandProcessor, "getRunnerFor");
      });

      it("does not get the runner for the requested command", function () {
        commandProcessor.process(command, commandArguments);

        expect(commandProcessor.getRunnerFor).not.toHaveBeenCalledWith(command);
      });

      it("tells the logger about the command not found error", function () {
        command = "command-name";
        var expectedCommandError = CommandProcessor.COMMAND_NOT_FOUND_ERROR.replace("%COMMAND%", command);

        commandProcessor.process(command, commandArguments);

        expect(logger.error).toHaveBeenCalledWith(expectedCommandError);
      });
    });
  });

  describe("getRunnerFor()", function () {

    describe("when the command is 'new'", function () {
      beforeEach(function () {
        command = "new";
      });

      it("creates a NewRunner", function () {
        commandProcessor.getRunnerFor(command);

        expect(CommandProcessor.NewRunner).toHaveBeenCalled();
      });

      it("returns an NewRunner instance", function () {
        var runner = commandProcessor.getRunnerFor(command);

        expect(runner).toBe(newRunner);
      });
    });

    describe("when the command is 'cjs'", function () {
      beforeEach(function () {
        command = "cjs";
      });

      it("creates a CjsRunner", function () {
        commandProcessor.getRunnerFor(command);

        expect(CommandProcessor.CjsRunner).toHaveBeenCalled();
      });
    });

    describe("when the command is 'amd'", function () {
      beforeEach(function () {
        command = "amd";
      });

      it("creates an AmdRunner", function () {
        commandProcessor.getRunnerFor(command);

        expect(CommandProcessor.AmdRunner).toHaveBeenCalled();
      });
    });

    describe("when the command is 'help'", function () {
      beforeEach(function () {
        command = "help";
      });

      it("creates a HelpRunner", function () {
        commandProcessor.getRunnerFor(command);

        expect(CommandProcessor.HelpRunner).toHaveBeenCalled();
      });

    });

  });

});