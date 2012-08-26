require("./support/spec_helper");

describe("Rebar()", function () {
  var Rebar = require("../lib/rebar");
  var rebar, commandProcessor, command, commandArguments;

  beforeEach(function () {
    command = "command-name";
    commandArguments = ["arguments", "array"];
    commandProcessor = createSpyWithStubs("command processor", {process: null});

    Rebar.CommandProcessor = jasmine.createSpy("CommandProcessor").andReturn(commandProcessor);

    rebar = Rebar();
  });

  describe("constructor", function () {
    it("makes a CommandProcessor", function () {
      expect(Rebar.CommandProcessor).toHaveBeenCalled();
    });
  });

  describe("run()", function () {
    it("processes the command and command arguments requested", function () {
      rebar.run(command, commandArguments);

      expect(commandProcessor.process).toHaveBeenCalledWith(command, commandArguments);
    });
  });
});