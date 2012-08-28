var NewRunner = function NewRunner() {
  var fileSystem  = NewRunner.FileSystem();
  var logger      = NewRunner.Logger();

  var self = {
    execute: function execute(commandArguments) {
      commandArguments = commandArguments || [];

      if (0 === commandArguments.length) {
        logger.error(NewRunner.PROJECT_NAME_MISSING_ERROR);
      } else {
        var projectName = commandArguments.shift();
        var projectDirExists = fileSystem.dirExistsInPwd(projectName);

        if (projectDirExists) {
          logger.error(NewRunner.PROJECT_DIR_EXISTS_ERROR);
        } else {
          self.createProjectFolder(projectName, commandArguments);
        }
      }
    },

    createProjectFolder: function createProjectFolder(projectName, commandArguments) {

    }
  };

  return self;
};

NewRunner.PROJECT_NAME_MISSING_ERROR  = "You must provide a project name: rebar new my_project";
NewRunner.PROJECT_DIR_EXISTS_ERROR    = "A directory already exists with the name you've chosen for your project.";
NewRunner.FileSystem                  = require("../utils/file_system");
NewRunner.Logger                      = require("../utils/logger");

module.exports = NewRunner;