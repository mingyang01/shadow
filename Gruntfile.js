// 包装函数
module.exports = function(grunt) {

  // 任务配置,所有插件的配置信息
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // // uglify插件的配置信息
    // uglify: {
    //     options: {
    //       banner: '/*! This is uglify test - ' +
    //         '<%= grunt.template.today("yyyy-mm-dd") %> */'
    //     },
    //     app_task: {
    //       files: {
    //         'build/app.min.js': ['lib/index.js', 'lib/test.js']
    //       }
    //     }
    // },
    // watch插件的配置信息
    watch: {
    	// jade : {
    	// 	files: ['views/**/*.jade'],
    	// 	options : {
    	// 		livereload: true
    	// 	}
    	// },
        js: {
            files: ['models/*.js','routes/*.js'],
            tasks: ['jshint'],
            options: {
                // Start another live reload server on port 1337
                livereload: 3001
            }
        }
    },

    nodemon: {
	    dev: {
	        script: 'bin/www',
	        options: {
				args: [],
				nodeArgs: ['--debug'],
				ignore: ['README.md', 'node_modules/**', '.DS_Store'],
				ext: 'js',
				watch: ['./'],
				delay: 1,
				env: {
				    PORT: '3000'
				},
				cwd: __dirname
	        }
	     }
	},

	concurrent: {
        target1: ['nodemon', 'watch'],
        options: {
        	logConcurrentOutput: true
        }
    }


  });

  // 告诉grunt我们将使用插件
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  // 告诉grunt当我们在终端中输入grunt时需要做些什么
  grunt.registerTask('default', ['concurrent']);

};
