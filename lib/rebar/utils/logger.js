var Logger = function Logger() {
  var self = {
    success: function success(message) {
      var successPrefix = ">> Success".green + " :: ";
      var msg = self.prefix(successPrefix, message);
      self.write(msg);
    },

    error: function error(message) {
      var err = self.prefix(">> ERROR".red + " :: ", message);
      self.write(err);
    },

    prefix: function prefix(pfix, message) {
      return pfix + message;
    },

    write: function write(message) {
      process.stdout.write(message + "\n");
    }
  };

  return self;
};

module.exports = Logger;