Feature: $ rebar amd MyClass
  As a JS dev that uses requirejs and other amd module loaders
  I want an amd command
  So that I can generate class and test stub for amd modules

  Scenario: User runs 'rebar amd MyClass' in a rebar project root where the MyClass files don't exist
    Given the user is in the root folder of a rebar.js project
    And the "MyClass" files do not exist
    When the user runs 'rebar amd MyClass'
    Then the "MyClass" js file is created in the "./source" directory
    And the "MyClass_spec" js file is created in the "./spec" directory

  Scenario: User runs 'rebar amd MyClass' without a .rebar folder present
    Given the user is not in the root of a rebar.js project
    When the user runs 'rebar amd MyClass'
    Then the console tells the user they're not in a rebar.js project

  Scenario: User runs 'rebar amd MyClass' in a rebar project root where the MyClass.js file exists
    Given the user is in the root folder of a rebar.js project
    And the "MyClass" js file exists
    When the user runs 'rebar amd MyClass'
    Then the console tells the user that the "MyClass.js" file exists

  Scenario: User runs 'rebar amd MyClass' in a rebar project root where the MyClass_spec.js file exists
    Given the user is in the root folder of a rebar.js project
    And the "MyClass_spec" js file exists
    When the user runs 'rebar amd MyClass'
    Then the console tells the user that the "MyClass_spec.js" file exists