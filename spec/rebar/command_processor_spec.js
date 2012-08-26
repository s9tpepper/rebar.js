require("../support/spec_helper");

describe("CommandProcessor", function () {

  var CommandProcessor = require("../../lib/rebar/command_processor");
  var commandProcessor, logger, command, InitRunner, initRunner,
      ProjectRunner, projectRunner;

  var knownCommands = ["init","project","class","feature","test"];

  beforeEach(function () {
    command = jasmine.createSpy("command-name");
    logger = createSpyWithStubs("logger", {error: null});
    CommandProcessor.Logger = jasmine.createSpy("Logger").andReturn(logger);

    initRunner = createSpyWithStubs("init command runner", {execute: null});
    InitRunner = jasmine.createSpy("InitRunner").andReturn(initRunner);
    CommandProcessor.InitRunner = InitRunner;

    projectRunner = createSpyWithStubs("project command runner", {execute: null});
    ProjectRunner = jasmine.createSpy("ProjectRunner").andReturn(projectRunner);
    CommandProcessor.ProjectRunner = ProjectRunner;

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
                                                            1
        expect(logger.error).toHaveBeenCalledWith(expectedCommandError);
      });
    });
  });

  describe("getRunnerFor()", function () {

    describe("when the command is 'init'", function () {

      beforeEach(function () {
        command = "init";
      });

      it("creates an InitRunner", function () {
        commandProcessor.getRunnerFor(command);

        expect(CommandProcessor.InitRunner).toHaveBeenCalled();
      });

      it("returns an InitRunner instance", function () {
        var runner = commandProcessor.getRunnerFor(command);

        expect(runner).toBe(initRunner);
      });
    });

    describe("when the command is 'project'", function () {
      beforeEach(function () {
        command = "project";
      });

      it("creates a ProjectRunner", function () {
        commandProcessor.getRunnerFor(command);

        expect(CommandProcessor.ProjectRunner).toHaveBeenCalled();
      });

      it("returns an ProjectRunner instance", function () {
        var runner = commandProcessor.getRunnerFor(command);

        expect(runner).toBe(projectRunner);
      });
    });

  });

});