var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

module.exports = function(grunt) {

	grunt.initConfig({
		pkgs: grunt.file.readJSON('package.json'),
		less: {
			dev: {
				files: {
					"../style/css/style.css": "../style/less/style.less"
				}
			},
			build: {
				options: {
					yuicompress: true
				},
				files: {
					"../style/css/style.css": "../style/less/style.less"
				}
			}
		},
		concat: {
			all: {
				src: '../scripts/src/**/*.js',
				dest: '../scripts/all.js'
			}
		},
		uglify: {
			build: {
				src: ['../scripts/all.js'],
				dest: '../scripts/all.js'
			}
		},
		connect: {
			options :{
				port: 3000,
				hostname: '*',
				base: '..',
				middleware: function (connect, options) {
					connect.static.mime.default_type = 'text/html'; // hack for scriptogr.am
					return [
						require('connect-livereload')(), // add livereload-snippets
						rewriteRulesSnippet, // RewriteRules support
						connect.static(require('path').resolve(options.base),'./html')
					];
				}
			},
			rules: { '/': '.grunt/html/'}
		},
		watch: {
			options: {
				livereload: true,
				nospawn: false
			},
			less : {
				files : ['../style/less/**/*.less'],
				tasks : ['less', 'notify']
			},
			js: {
				files: ['../scripts/src/**/*.js'],
				tasks: ['concat', 'notify']
			}
		},
		notify: {
			watch: {
				options:{
				message: 'Done, without errors'
				}
			},
		}
	});

	// load grunt-* packages
	for(var task in grunt.config.data.pkgs.devDependencies){
		if( task.substring(0,6) == 'grunt-'){
			grunt.loadNpmTasks(task);
		}
	}

	// set default tasks
	grunt.registerTask(
		'default',
		[
			'less:dev',
			'concat',
			'notify',
			'configureRewriteRules',
			'connect',
			'watch'
		]
	);

	// set build tasks
	grunt.registerTask(
		'build',
		[
			'less:build',
			'concat',
			'uglify:build',
		]
	);
};
