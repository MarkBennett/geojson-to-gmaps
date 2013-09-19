module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            geojson_to_gmaps: {
                src: 'geojson-to-gmaps.js',
                options: {
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js',
                    vendor: 'vendor/*.js'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
        },
        uglify: {
            my_target: {
                files: {
                    'geojson-to-gmaps.min.js': ['geojson-to-gmaps.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['jasmine']);

    grunt.registerTask('build', 'Build a release.', ['jasmine', 'uglify']);

};
