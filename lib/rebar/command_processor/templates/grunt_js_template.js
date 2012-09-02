module.exports = 'module.exports = function (grunt) {\n\
  \n\
  grunt.initConfig({\n\
    jasmine_node: {\n\
      spec: "%JASMINE_SPECS_LOCATION",\n\
      projectRoot: ".",\n\
      requirejs: "%JASMINE_USE_REQUIREJS%,\n\
      forceExit: %JASMINE_FORCE_EXIT%,\n\
      jUnit: {\n\
        report: %JUNIT_EXPORT%,\n\
        savePath : "%JUNIT_REPORT_LOCATION%",\n\
        useDotNotation: "%JUNIT_USE_DOT_NOTATION%,\n\
        consolidate: %JUNIT_CONSOLIDATE%\n\
      }\n\
    },\n\
    cucumberjs: {\n\
      features: "%CUCUMBER_FEATURES_LOCATION%",\n\
      steps: "%CUCUMBER_STEP_DEFS_LOCATION%",\n\
      tags: "%CUCUMBER_TAGS%"\n\
    },\n\
    lint: {\n\
      all: "%JSHINT_PATHS%"\n\
    },\n\
    jshint: {\n\
      options: {\n\
        %JSHINT_OPTIONS%\n\
      },\n\
      globals: {}\n\
    },\n\
    clean: {\n\
      build: [\n\
      ]\n\
    }\n\
  });\n\
 \n\
  grunt.file.mkdir("build/reports/jasmine");\n\
 \n\
  grunt.loadNpmTasks("grunt-contrib");\n\
  grunt.loadNpmTasks("grunt-cucumber");\n\
 \n\
  grunt.loadTasks("tasks");\n\
 \n\
  grunt.registerTask("default", "lint jasmine_node cucumberjs");\n\
  grunt.registerTask("cuke", "lint cucumberjs");\n\
  grunt.registerTask("jasmine", "lint jasmine_node");\n\
 \n\
};';