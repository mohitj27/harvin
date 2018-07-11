const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const pump = require('pump');


// Optimize Images
gulp.task('imageMin', function() {
	gulp.src([
        'app/public/assets/img/**/*.+(jpg|png)',
        'app/public/assets/img/**/**/*.+(jpg|png)',
        'app/public/assets/img/*.+(png|jpg)',
        'app/public/icons/*.+(png|jpg)',
        'app/public/images/*.+(png|jpg|JPG|jpeg|svg)',
        'app/public/images/icons/*.+(png|jpg)',
        'app/public/images/testimonials/*.+(png|jpg)',
        'app/public/img/*.+(png|jpg|JPG|jpeg|svg)',
        'app/public/img/relatedposts/*.+(png|jpg|JPG|jpeg|svg)',
        'app/public/*.+(png|jpg|JPG|jpeg|svg)',
    ])
	.pipe(imagemin())
	.pipe(gulp.dest('app/public/dist/images'))
});

// Minify JS
gulp.task('minifyJs', function(e) {
    pump([
        gulp.src([
            // 'app/public/assets/js/*.js', ERROR IN THIS FILE (COUNTER IS UNEXPECTED TOKEN ON LINE 198 OF PUBLIC/ASSETS/JS/MAIN.JS)
            // 'app/public/js/*.js',
            // '!app/public/js/QB.js',
        ]),
        uglify(),
        gulp.dest('app/public/dist/js')
      ],
      e
    );
});




// Clean CSS

gulp.task('cleanCss', function () {	
    gulp.src([
        'app/public/assets/stylesheets/*.css',
        'app/public/css/*.css'
    ])
    .pipe(cleanCss())
	.pipe(gulp.dest('app/public/dist/css'))
});

gulp.task('default', ['imageMin', 'cleanCss', 'minifyJs']);