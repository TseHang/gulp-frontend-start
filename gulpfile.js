// Gulp
var gulp = require('gulp');               
var gulpUglify = require('gulp-uglify');  
var gulpCompass = require('gulp-compass');
var gulpImagemin = require('gulp-imagemin');
var gulpPlumber = require('gulp-plumber'); // 記錄錯誤訊息，並不會讓gulp停止
var gulpMinifyHTML = require('gulp-minify-html');

// Concat-Min-CSS JS
var gulpConcat = require('gulp-concat');
var gulpMinifyCss = require('gulp-minify-css');
var gulpRename = require('gulp-rename');

// Handlebars
var gulpHandlebars = require('gulp-compile-handlebars');

/*
	【Concat】
  input: src/
  output: lib/
  - 
	All 'lib' css to all.min.css
	All 'lib' js to all.min.js

  When you need , then you do it .

*/
gulp.task('concate-css', function () {
  gulp.src('src/*.css')
  	.pipe(gulpPlumber())
   	.pipe(gulpConcat('all.css'))
    .pipe(gulp.dest('lib/'));
});

gulp.task('concate-js', function () {
  gulp.src('src/*.js')
  	.pipe(gulpPlumber())
   	.pipe(gulpConcat('all.js'))
    .pipe(gulp.dest('lib/'));
});

/*
  若是要合併檔案記得變成
  gulp.task('minify-css',['concate-css'],function(){
    ...
  })
*/

gulp.task('minify-css',function(){
	gulp.src('src/**/*.css')
		.pipe(gulpPlumber())
		.pipe(gulpMinifyCss({
      keepBreaks: true,
    }))
    .pipe(gulpRename(function(path){
    	path.basename += ".min" ;
    	path.extname = ".css";
    }))
    .pipe(gulp.dest('lib/'));
})

gulp.task('minify-js',function(){
	gulp.src('src/**/*.js')
		.pipe(gulpPlumber())
		.pipe(gulpUglify())
    .pipe(gulpRename(function(path){
    	path.basename += ".min" ;
    	path.extname = ".js";
    }))
    .pipe(gulp.dest('lib/'));
})

/*
	【Image】
  input: dist/img/
  output: dist/img/
  - 
	並不需要一直watch , 最後在 compress 一次就好
*/
gulp.task('image', function () {
  gulp.src('dist/img/**/**')
  	.pipe(gulpPlumber())
   	.pipe(gulpImagemin())
    .pipe(gulp.dest('dist/img/'));
});

/*
	【 Handlebars 】
  input: layout/*.handlebars
  output: ''
	partial: layout/partial/
  -

*/
gulp.task('handlebars', function () {
	
	var templateData = {
    /*
      write Data
    */

    my:{
      title:"Gulp-Frontend-Start Example"
    }
  }

  options = {
    ignorePartials: false, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
    partials : {
      /*
        write your partial
        -

        ex:
        footer: <footer>the end</footer>
      */
    },
    batch : ['./layout/partial/'],
    helpers : {
      // usuage: {{capital First}}
      capitals : function(str){
        return str.toUpperCase();
      }
    }
  }

  return gulp.src('layout/*.handlebars')
  	.pipe(gulpPlumber())	
    .pipe(gulpHandlebars(templateData, options))
    .pipe(gulpMinifyHTML())
    .pipe(gulpRename(function(path){
  		path.extname = ".html";

      if(path.dirname === ".")
        console.log("\n \033[32m compile \033[0m '"+path.basename+path.extname+"'");
      else
        console.log("\n \033[32m compile \033[0m '"+path.dirname+path.basename+path.extname+"'");
    }))
    .pipe(gulp.dest(''));
});


/*
  【 command : ｀gulp｀ 】
  that will do task --> js , sass , handlebars , watch
  -
  js:
  input: ./js/*.js
  output: dist/js
  -
  css:
  input: ./sass/*.scss
  output: dist/css/
  -
*/
gulp.task('js', function () {
  gulp.src('./js/*.js')        // 指定要處理的原始 JavaScript 檔案目錄
  	.pipe(gulpPlumber())
  	.pipe(gulpUglify())                     // 將 JavaScript 做最小化
  	.pipe(gulp.dest('dist/js/'));  // 指定最小化後的 JavaScript 檔案目錄
});

gulp.task('sass', function () {
  gulp.src('./sass/*.scss')
  	.pipe(gulpPlumber())
  	.pipe(gulpCompass({
  		sass: 'sass/',
  		css: 'dist/css/',
      style: 'compressed', //這樣在編譯出來後的 css 檔案就會是壓縮過後的狀態
      comments: false  // 不包括註解在裡面
    }))
  	.pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function () {
    gulp.watch('./js/**/*.js' ,['js']);
    gulp.watch('./sass/**/*.scss',['sass']);
    gulp.watch('./layout/**/*.handlebars',['handlebars']);
});

gulp.task('default',['sass','js','handlebars','watch']);