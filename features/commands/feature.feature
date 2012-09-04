@Pending
Feature: $ rebar feature MyFeature
  As a JS dev that uses Cucumber.js
  I want a feature command
  So that I can generate feature file and step definition stub for Cucumber.js features

  Scenario: User runs 'rebar feature MyFeature' in a rebar project root where the MyFeature files don't exist
    Given the user is in the root folder of a rebar.js project
    And the "MyFeature" Cucumber.js files do not exist
    When the user runs 'rebar feature MyFeature'
    Then the "MyFeature" feature file is created in the "./features" directory
    And the "MyFeature_steps" js file is created in the "./features/step_definitions" directory

  Scenario: User runs 'rebar feature MyFeature' without a .rebar folder present
    Given the user is not in the root of a rebar.js project
    When the user runs 'rebar feature MyFeature'
    Then the console tells the user they're not in a rebar.js project

  Scenario: User runs 'rebar feature MyFeature' in a rebar project root where the MyFeature.feature file exists
    Given the user is in the root folder of a rebar.js project
    And the "MyFeature" feature file exists
    When the user runs 'rebar feature MyFeature'
    Then the console tells the user that the "MyFeature.feature" file exists

  Scenario: User runs 'rebar feature MyFeature' in a rebar project root where the MyFeature_steps.js file exists
    Given the user is in the root folder of a rebar.js project
    And the "MyFeature_steps" js file exists
    When the user runs 'rebar feature MyFeature'
    Then the console tells the user that the "MyFeature_steps.js" file exists