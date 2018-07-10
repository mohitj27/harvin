const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');


// Optimize Images
gulp.task('imageMin', function() {
	gulp.src([
        'app/public/assets/img/**/*.+(jpg|png)',
        'app/public/assets/img/**/**/*.+(jpg|png)',
        'app/public/assets/img/*.+(png|jpg)',
        'app/public/icons/*.+(png|jpg)',
    ])
	.pipe(imagemin())
	.pipe(gulp.dest('app/public/dist/images'))
});

// Minify JS
// gulp.task('minifyJs', function(){
//     return gulp.src([
//         'app/public/assets/js/main.js'
//         ])
//         .pipe(uglify())
//         .pipe(gulp.dest('app/public/dist/js'))
// });

// Clean CSS

gulp.task('cleanCss', function () {	
    gulp.src([
        'app/public/assets/stylesheets/*.css',
        'app/public/css/*.css'
    ])
    .pipe(cleanCss())
	.pipe(gulp.dest('app/public/dist/css'))
});

gulp.task('default', ['imageMin', 'cleanCss']);