var new_steps = function new_steps() {
  this.Given(/^the current working directory does not have a folder named "([^"]*)"$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.When(/^the command "([^"]*)" is run$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^"([^"]*)" is created in the current working directory$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Given(/^the current working directory has a folder named "([^"]*)"$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^the folder exists with project name error is outputted to console$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });
};

module.exports = new_steps;