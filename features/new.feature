Feature: $ rebar.js new project_name
  As a JavaScript developer
  I want a new command
  So that I can quickly create a new JavaScript project

  The 'rebar.js new projectname' command will create a new folder named
  'projectname' in the current working directory and it will generate
  all of the initial project files

  Scenario: The new command is run in a directory that does not have a folder with that project name
    Given the current working directory does not have a folder named "my_project"
    When the command "rebar.js new my_project" is run
    Then "./my_project" is created in the current working directory
    And "./my_project/.rebar" is created in the current working directory
    And "./my_project/.rebar/rebar.json" is created in the current working directory
    And "./my_project/.rebar/class.js" is created in the current working directory
    And "./my_project/.rebar/unit_test.js" is created in the current working directory
    And "./my_project/.rebar/step_definition.js" is created in the current working directory
    And "./my_project/.rebar/cucumber.feature" is created in the current working directory
    And "./my_project/package.json" is created in the current working directory
    And "./my_project/grunt.js" is created in the current working directory
    And "./my_project/.gitignore" is created in the current working directory
    And "./my_project/README.md" is created in the current working directory
    And "./my_project/LICENSE" is created in the current working directory
    And "./my_project/features" is created in the current working directory
    And "./my_project/features/step_definitions" is created in the current working directory
    And "./my_project/spec" is created in the current working directory
    And "./my_project/source" is created in the current working directory
    And "./my_project/node_modules" is created in the current working directory

  Scenario: The new command is run in a directory that has a folder with the desired project name
    Given the current working directory has a folder named "project"
    When the command "rebar.js new project" is run
    Then the folder exists with project name error is outputted to console