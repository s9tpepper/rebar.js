var Logger = function Logger() {
  var self = {
    error: function error(message) {
      var err = self.prefix(">> ".red, message);
      self.write(err);
    },

    prefix: function prefix(prefix, message) {
      return prefix + message;
    },

    write: function write(message) {
      console.log(message);
    }
  };

  return self;
};

module.exports = Logger;