module.exports = function (grunt) {

  grunt.initConfig({
    jasmine_node: {
      spec: "./spec",
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: true,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    cucumberjs: {
      features: "features",
      steps: "features/step_definitions",
      tags: "~@Pending"
    },
    lint: {
      all: ['source/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    clean: {
      build: [
      ]
    }
  });

  grunt.file.mkdir("build/reports/jasmine");

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-cucumber');

  grunt.loadTasks("tasks");

  grunt.registerTask('default', 'lint jasmine_node cucumberjs');
  grunt.registerTask('cuke', 'lint cucumberjs');
  grunt.registerTask('jasmine', 'lint jasmine_node');

};