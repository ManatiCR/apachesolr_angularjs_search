'use strict';
// Configuring Grunt tasks:
// http://gruntjs.com/configuring-tasks
module.exports = function (grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    // https://github.com/sindresorhus/load-grunt-tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Watch for changes and trigger compass, jshint & uglify
        watch: {
          sass: {
            files: ['sass/{,**/}*.scss'],
            tasks: ['sass:dev'],
            options: {
              livereload: true,
            }
          },
          js: {
            files: '<%= jshint.all %>',
            tasks: ['newer:jshint', 'uglify:dev']
          },
          images: {
            files: ['src-img/**/*.{png,jpg,gif}'],
            tasks: ['newer:imagemin'],
            options: {
            spawn: false,
            }
          }
        },

        // Sass
        sass: {
          options: {
            sourceMap: true,
            includePaths: require('node-neat').includePaths,
          },
          dev: {
            options: {
              outputStyle: 'nested',
            },
            files: {
              'css/style.css': 'sass/style.scss',
            }
          },
          prod: {
            options: {
              outputStyle: 'compressed',
            },
            files: {
              'css/style.css': 'sass/style.scss',
            },
          },
        },

        // PostCSS Autoprefixer
        postcss: {
          options: {
            map: true,
            processors: [
              require('autoprefixer-core')({browsers: 'last 2 versions'}).postcss
            ]
          },
          dist: {
            src: 'css/*.css'
          }
        },

        // Javascript linting with jshint
        jshint: {
          options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
          },
          all: [
            'js/script.js',
            '!js/*.min.js'
          ]
        },

        imagemin: {
          options: {
            optimizationLevel: 3,
            cache: false
          },
          dist: {
            files: [{
              // cwd is 'current working directory'
              expand: true,                  // Enable dynamic expansion
              cwd: 'src-img/',               // Src matches are relative to this path
              src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
              dest: 'img/'                  // Destination path prefix
            }]
          }
        },

        // Concat & minify
        uglify: {
          dev: {
            options: {
              mangle: false,
              compress: false,
              preserveComments: 'all',
              beautify: true
            },
            files: {
              'js/script.min.js': ['src-js/*.js']
            }
          },
          prod: {
            options: {
              mangle: true,
              compress: true
            },
            files: {
              'js/script.min.js': ['src-js/*.js']
            }
          }
        }
    });

    // Load the plugin(s), but I'm using load-grunt-tasks
    // https://github.com/sindresorhus/load-grunt-tasks
    // grunt.loadNpmTasks('grunt-concurrent');


    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    // The "default" task is what I leave running all the time. Since it is the default,
    // you can start it by simply running
    // $ grunt
    // or, to run production's tasks
    // $ grunt build

    grunt.registerTask('prod', [
        'jshint',
        'uglify:prod',
        'sass:prod',
        'postcss'
    ]);

    grunt.registerTask('default', [
        'imagemin',
        'newer:jshint',
        'uglify:dev',
        'sass:dev',
        'watch'
    ]);
};
