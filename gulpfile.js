var gulp = require( 'gulp' ),
    less = require( 'gulp-less' ),
    livereload = require( 'gulp-livereload' ),
    gutil = require( 'gulp-util' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    browserify = require( 'browserify' ),
    source = require( 'vinyl-source-stream' ),
    watchify = require( 'watchify' ),
    uglify = require( 'gulp-uglify' ),
    csso = require( 'gulp-csso' ),
    rename = require( 'gulp-rename' ),
    rev = require( 'gulp-rev' ),
    rimraf = require( 'gulp-rimraf' ),
    _ = require( 'lodash' );

gulp.task( 'less', function() {
    return gulp.src([
        './assets/less/main.less'
    ])
        .pipe( less().on( 'error', gutil.log ).on( 'error', gutil.beep ) )
        .pipe( autoprefixer() )
        .pipe( gulp.dest( './assets/css' ) );
});

var rebundle = function( bundler ) {
    return bundler.bundle()
        .pipe( source( 'bundle.js' ) )
        .pipe( gulp.dest( './assets/js' ) );
};

gulp.task( 'browserify', function() {
    var bundler = browserify( './assets/js/app.jsx', { extensions: [ '.jsx' ] });

    return rebundle( bundler );
});

gulp.task( 'watchify', function() {
    var watchifyArgs = _.extend({}, watchify.args, {
        debug: true,
        extensions: [ '.jsx' ]
    });
    var bundler = watchify( browserify( './assets/js/app.jsx', watchifyArgs ) );

    bundler.on( 'update', rebundle.bind( this, bundler ) );

    return rebundle( bundler );
});

gulp.task( 'watch', function() {
    gulp.watch( './assets/less/**/*.less', [ 'less' ] );

    var lr = livereload.listen( 35730 );
    gulp.watch([
        './assets/css/main.css',
        './assets/js/bundle.js'
    ])
      .on( 'change', function( file ) {
          livereload.changed( file, lr );
      });
});

gulp.task( 'uglify', [ 'browserify' ], function() {
    return gulp.src([
        './assets/js/bundle.js'
    ])
        .pipe( uglify() )
        .pipe( rename( 'bundle.min.js' ) )
        .pipe( gulp.dest( './assets/js' ) );
});

gulp.task( 'csso', function() {
    return gulp.src([
        'assets/css/main.css'
    ])
        .pipe( csso() )
        .pipe( rename( 'main.min.css' ) )
        .pipe( gulp.dest( 'assets/css' ) );
});

gulp.task( 'revision', [ 'uglify', 'csso' ], function() {
    return gulp.src([
        'assets/js/bundle.min.js',
        'assets/css/main.min.css'
    ], { base: __dirname })
        .pipe( rev() )
        .pipe( gulp.dest( '.' ) )
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'assets' ) );
});

gulp.task( 'clean', [ 'revision' ], function() {
    return gulp.src([
        'assets/css/main.min.css',
        'assets/js/bundle.min.js'
    ])
        .pipe( rimraf() );
});

gulp.task( 'default', [ 'less', 'watchify', 'watch' ] );
gulp.task( 'dev', [ 'default' ] );
gulp.task( 'release', [ 'uglify', 'csso', 'revision', 'clean' ] );
gulp.task( 'all', [ 'less', 'browserify', 'release' ] );