({
    baseUrl: "./app",
    paths: {
      jquery: './lib/jquery/jquery',
      angular: './lib/angular/angular',
      app: './js/app'
    },
    name: "js/main",
    out: "app/js/main-built.js",
    optimize: "uglify2",
    uglify2: {
        output: {
            beautify: false
        },
        compress: {
            sequences: true,
            global_defs: {
                DEBUG: false
            }
        },
        mangle: false
    }
});
