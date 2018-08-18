const conf = require('./gulp.conf');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.example
      ],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    open: false
  };
};
