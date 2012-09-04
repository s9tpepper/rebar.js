require("../../support/spec_helper");
var HelpRunner = require("../../../lib/rebar/command_processor/help_runner");

describe("HelpRunner()", function () {

  var helpRunner, logger;

  beforeEach(function () {
    logger = createSpyWithStubs("logger", {write: null});
    HelpRunner.Logger = jasmine.createSpy("logger").andReturn(logger);
    helpRunner = HelpRunner();
  });

  describe("constructor", function () {
    beforeEach(function () {
    });

    it("makes a Logger", function () {
      expect(HelpRunner.Logger).toHaveBeenCalled();
    });
  });

  describe("execute()", function () {

    var helpContents = "rebar - A JavaScript code generation tool.\n\
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

    it("logs the help contents", function () {
      helpRunner.execute([]);

      expect(logger.write).toHaveBeenCalledWith(helpContents);
    });


  });
});