module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			combinedCSS: {
				files: {
					'./css/less/combined.less': [
						'./css/less/source/_*.less',
						'./css/less/source/_*.css'
					]
				}
			},
		},
		less: {
			app: {
				files: {
					'./css/app.css': [
						'./css/less/combined.less'
					],
				}
			}
		},
		develop: {
			server: {
				file: 'app.js'
			}
		},
		watch: {
			// node: {
			// 	files: [
			// 		'./app.js',
			// 		'./serverResponse/*'
			// 	],
			// 	tasks: ['develop'],
			// 	options: { nospawn: true }
			// },
			combinedCSS: {
				files: [
					'./css/less/source/*'
				],
				tasks: ['concat:combinedCSS', 'less:app'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
		},
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-develop');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// grunt.registerTask('devserver', ['concat', 'jst', 'less', 'develop', 'watch']);
	grunt.registerTask('dev', ['concat', 'less']); // this one will not start a server
	grunt.registerTask('server', ['develop']); // Starting the server
	grunt.registerTask('auto', ['watch']); // Initiating the watch task cannot be called watch because that would cause an infinite loop
	// Default task(s).
	grunt.registerTask('default', ['concat', 'less']);

};
