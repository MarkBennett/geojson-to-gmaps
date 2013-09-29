module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            geojson_to_gmaps: {
                src: 'geojson_to_gmaps.js',
                options: {
                    specs: 'spec/*_spec.js',
                    helpers: 'spec/*Helper.js',
                    vendor: 'vendor/*.js'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'geojson_to_gmaps.js', 'spec/**/*.js']
        },
        uglify: {
            options: {
                banner: "/***\n\ngeojson_to_gmaps.js\n\n" + grunt.file.read('LICENSE') + "\n\n***/\n"
            },
            my_target: {
                files: {
                    'geojson_to_gmaps.min.js': ['geojson_to_gmaps.js']
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
