require("../support/spec_helper");
var Logger = require("../../lib/rebar/utils/logger");

describe("Logger", function () {

  var logger;

  beforeEach(function () {
    logger = Logger();
  });

  describe("success()", function () {
    var message = "success message";
    var prefix = ">> Success".green + " :: ";
    var prefixedMessage = prefix + message;

    beforeEach(function () {
      spyOn(logger, "prefix").andReturn(prefixedMessage);
      spyOn(logger, "write");
    });

    it("prefixes the message with a success title", function () {
      logger.success(message);

      expect(logger.prefix).toHaveBeenCalledWith(prefix, message);
    });

    it("writes the formatted success message to console", function () {
      logger.success(message);

      expect(logger.write).toHaveBeenCalledWith(prefixedMessage);
    });
  });

  describe("error()", function () {
    var message = "a message";
    var prefix = ">> ERROR".red + " :: ";
    var prefixedMessage = prefix + message;

    beforeEach(function () {
      spyOn(logger, "prefix").andReturn(prefixedMessage);
      spyOn(logger, "write");
    });

    it("prefixes the error message with red arrows", function () {
      logger.error(message);

      expect(logger.prefix).toHaveBeenCalledWith(prefix, message);
    });

    it("writes the formatted error to console", function () {
      logger.error(message);

      expect(logger.write).toHaveBeenCalledWith(prefixedMessage);
    });
  });

  describe("prefix()", function () {
    it("prefixes the second string with the first string", function () {
      var first = "first";
      var second = "second";

      var prefixed = logger.prefix(first, second);

      expect(prefixed).toEqual("firstsecond");
    });
  })
});