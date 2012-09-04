Feature: $ rebar help
  As a rebar user
  I want a help command
  So that I can learn to use the program

  Scenario: User runs 'rebar help' and sees the help content
    When the user runs 'rebar help'
    Then the help content is displayed:
      """
      rebar - A JavaScript code generation tool.

      Usage
        rebar [cmd] [args]

      Commands
           new   Creates a new project folder and files
           cjs   Creates a new CommonJS based class file and test stub
           amd   Creates a new AMD based class file and test stub
          help   This help file

      For more information please see: https://github.com/s9tpepper/rebar.js
      """