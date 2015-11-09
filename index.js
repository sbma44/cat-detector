var fs = require('fs');
var pixelmatch = require('pixelmatch');
var jpeg = require('jpeg-js');
var queue = require('queue-async');
// var PNG = require('pngjs2').PNG;
var jimp = require("jimp");
var path = require('path');

var width = 2560, height = 1920;

if (require.main === module) {
    var fileCache = [];

    function loadFile(filename, callback) {
        fs.readFile(path.normalize(process.argv[2] + '/' + filename), function(err, data) {
            if (err) return callback(err);
            fileCache.push(jpeg.decode(data));
            callback();
        });
    }

    // console.log(process.argv)
    fs.readdir(process.argv[2], function(err, files) {
        files.sort();
        for(var i = 1; i < files.length; i++) {
            var q = queue();
            if (fileCache.length === 0) {
                q.defer(loadFile, files[i - 1]);
            }
            q.defer(loadFile, files[i]);
            q.awaitAll(function() {
                // var diff = new PNG({width: width, height: height});
                console.log(fileCache);
                var numDiff = pixelmatch(fileCache[0], fileCache[1], null, width, height);
                console.log(files[i - 1], files[i], numDiff);
                // if (numDiff > 100) {
                //     console.log(files[i]);
                // }
                fileCache.shift();
            });
        }
    });
}