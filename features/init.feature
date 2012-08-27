Feature: $ rebar init
  As a JavaScript developer
  I want to create the rebar config files before creating project files
  So that I can tweak the project templates to my preferences

  The "rebar init" command creates a .rebar folder in the current working
  directory. The .rebar folder will contain all of the rebar project file
  templates, providing a way to customize the code templates for the project
  as well as configuring some rebar options specific to the project.

  Scenario: User runs 'rebar init' in a folder that has a .rebar folder
    Given the current working directory is not empty
    When the 'rebar init' command is executed
    Then the .rebar folder exists error is sent to the console

  Scenario: User runs 'rebar init' in an empty folder
    Given the current working directory is empty
    When the 'rebar init' command is executed
    Then a ".rebar" folder is created in the current working directory
    And a file is created named "package.json"
    And a file is created named "grunt.js"
    And a file is created named ".gitignore"
    And a file is created named "class.js"
    And a file is created named "unit_test.js"
    And a file is created named "step_definition.js"
    And a file is created named "cucumber.feature"
    And a file is created named "README.md"
    And a file is created named "LICENSE"
    And a file is created named "rebar.json"
