module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: [ 'jasmine' ],
    browsers: [
        'PhantomJS',
        'Chrome', 
        // 'ChromeCanary',
        // 'Safari',
        // 'Firefox',
        // 'IE',
    ], 
    files: [
        'dist/girder-client.js',
        'tests/*-browser-*.js',
        'src/tests/**/*.js'
    ],
    exclude: [
        'src/tests/**/*-node-only.js'
    ],
    proxies: {
        '/api': 'http://localhost:8080/api'
    }
  });
};
