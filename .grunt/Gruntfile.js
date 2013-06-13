
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
					"../style/css/style.min.css": "../style/less/style.less"
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
				dest: '../scripts/all.min.js'
			}
		},
		watch : {
			less : {
				files : ['../style/less/**/*.less'],
				tasks : ['less']
			},
			js: {
				files: ['../scripts/src/**/*.js'],
				tasks: ['concat', 'uglify']
			}
	    }
	});

	// load grunt-* packages
	for(var task in grunt.config.data.pkgs.devDependencies){
		if( task.substring(0,6) == 'grunt-'){
			grunt.loadNpmTasks(task);
		}
	}

	// set default tasks
	grunt.registerTask('default',['less', 'concat', 'uglify','watch']);
};