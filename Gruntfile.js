// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here
    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Grunfile.js', 'src/js/dev/*.js']
    },
    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/js/dmjs.min.js': 'src/js/dev/*.js'
        }
      },
      dev : {
        files: { 'dist/js/dmjs.min.js': 'src/js/dev/*.js' } 
      },
      production: { 
        files: { 'dist/js/dmjs.min.js': 'src/js/dev/*.js'} 
      } 
    },
    // // configure cssmin to minify css files ------------------------------------
    // cssmin: {
    //   options: {
    //     banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
    //   },
    //   build: {
    //     files: {
    //       'dist/css/style.min.css': 'src/css/style.css'
    //     }
    //   }
    // },
    concat : {
      build : {
        files : {
          'dist/concat/dmjs.js' : [
            'src/js/dev/export.js',
            'src/js/dev/girvan_newman.js',
            'src/js/dev/edge_betweenness_centrality.js',
            'src/js/dev/breadth_first.js',
            'src/js/dev/shortest_path_dijkstra.js',
            'src/js/dev/graph.js',
            'src/js/dev/ClusterEvaluation.js', 
            'src/js/dev/data_utils.js',
            'src/js/dev/distance_metrics.js',
            'src/js/dev/Evaluation.js',
            'src/js/dev/HierachicalCluster.js',
            'src/js/dev/KMean.js',
            'src/js/dev/SparseVector.js',
            'src/js/dev/statistic.js',
            'src/js/dev/utils.js',
            'src/js/dev/return.js'
          ]
        }
      }
    },

    umd : {
      all : {
        options : {
          src :　[
           'dist/concat/*.js'
          ],
          dest : 'dist/dmjs.js',
          amdModuleId : 'dm',
          globalAlias : 'dm'
        }
      }
    }
    
  });

  // ============= // CREATE TASKS ========== //
  grunt.registerTask('default', ['concat', 'umd']); 

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-umd');
};

