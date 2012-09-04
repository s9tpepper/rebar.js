Feature: $ rebar cjs MyClass
  As a JS dev that uses node and other CommonJS module loaders
  I want a cjs command
  So that I can generate class and test stub for CommonJS modules

  Scenario: User runs 'rebar cjs MyClass' in a rebar project root where the MyClass files don't exist
    Given the user is in the root folder of a rebar.js project
    And the "MyClass" files do not exist
    When the user runs "rebar cjs MyClass"
    Then the "MyClass" js file is created in the "./source" directory
    And the "MyClass_spec" js file is created in the "./spec" directory

  Scenario: User runs 'rebar cjs deep/deeper/MyClass' in a rebar project root where the MyClass files don't exist
    Given the user is in the root folder of a rebar.js project
    And the "MyClass" files do not exist
    When the user runs "rebar cjs deep/deeper/MyClass"
    Then the "MyClass" js file is created in the "./source/deep/deeper" directory
    And the "MyClass_spec" js file is created in the "./spec/deep/deeper" directory

  Scenario: User runs 'rebar cjs MyClass' without a .rebar folder present
    Given the user is not in the root of a rebar.js project
    When the user runs 'rebar cjs MyClass'
    Then the console tells the user they're not in a rebar.js project

  Scenario: User runs 'rebar cjs MyClass' in a rebar project root where the MyClass.js file exists
    Given the user is in the root folder of a rebar.js project
    And the "MyClass" js file exists
    When the user runs "rebar cjs MyClass"
    Then the console tells the user that the "MyClass.js" file exists

  Scenario: User runs 'rebar cjs MyClass' in a rebar project root where the MyClass_spec.js file exists
    Given the user is in the root folder of a rebar.js project
    And the MyClass_spec.js file exists
    When the user runs "rebar cjs MyClass"
    Then the console tells the user that the "MyClass_spec.js" file exists