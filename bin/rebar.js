#!/usr/bin/env node

function initColors() {
  var methods = Object.keys(String.prototype);
  // Requiring this here will modify String prototype everywhere.
  require('colors');

  // TODO: Implement a way to turn off colors
  // Disable colors.
  if (false) {
    // Override "colors".
    Object.keys(String.prototype).filter(function(method) {
      // Filter out methods that existed before "colors" was required.
      return methods.indexOf(method) === -1;
    }).forEach(function(method) {
        // Replace each new method with a function that just returns `this`.
        String.prototype.__defineGetter__(method, function() { return this; });
      });

    // Override console.log (nodeunit, maybe others).
    console._log = console.log;
    console.log = function() {
      var args = utils.toArray(arguments).map(function(value) {
        if (typeof value === 'string') {
          return value.replace(/\033\[[\d;]+m/g, '');
        }
        return value;
      });
      console._log.apply(console, args);
    };
  }
}

initColors();

var Rebar = require("../lib/rebar");

var rebar = Rebar();
process.argv.splice(0, 2);

var command = process.argv.shift();
rebar.run(command, process.argv);

process.exit(0);
