module.exports = "(function (global) {\n\
  \n\
  var %CLASS_NAME% = function %CLASS_NAME%() {\n\
    var self = {\n\
    };\n\
    \n\
    return self;\n\
  };\n\
  \n\
  if (typeof define === \"function\" && define.amd) {\n\
    define([], function () {\n\
      return %CLASS_NAME%;\n\
    };\n\
  } else {\n\
    global[\"%CLASS_NAME%\"] = %CLASS_NAME%;\n\
  }\n\
  \n\
}(this));";