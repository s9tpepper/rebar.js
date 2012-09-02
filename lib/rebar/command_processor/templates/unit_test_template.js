module.exports = "var %CLASS_NAME% = require(\"%CLASS_PATH%\");\n\
describe(\"%CLASS_NAME%()\", function () {\n\
  var %CLASS_VAR%;\n\
  \n\
  beforeEach(function () {\n\
    %CLASS_VAR% = %CLASS_NAME%();\n\
  });\n\
  \n\
  describe(\"constructor\", function () {\n\
    it(\"does something\", function () {\n\
      \n\
    });\n\
  });\n\
});";