module.exports = "\
require([\"%CLASS_DEPTH%\"], function (%CLASS_NAME%) {\n\
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
  });\n\
});";