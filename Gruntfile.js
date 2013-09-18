module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            geojson_to_gmaps: {
                src: 'src/**/*.js',
                options: {
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js',
                    vendor: 'vendor/*.js'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task(s).
    grunt.registerTask('default', ['jasmine']);

};
