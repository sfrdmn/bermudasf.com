module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      build: {
        options: {
          noLineComments: true,
          outputStyle: 'expanded',
          sassDir: 'css',
          cssDir: 'build/css'
        }
      }
    },

    concat: {
      build: {
        src: [
          'js/intro.js',
          'js/lib.js',
          'js/views.js',
          'js/app.js',
          'js/outro.js'
        ],
        dest: 'build/js/app.js'
      }
    },

    watch: {
      files: ['js/*.js', 'css/*'],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['compass:build', 'concat:build']);
};
