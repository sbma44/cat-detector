var fs = require('fs');
var pixelmatch = require('pixelmatch');
var jpeg = require('jpeg-js');
var queue = require('queue-async');
var PNG = require('pngjs2').PNG;
var path = require('path');

// var width = 2560, height = 1920;
var width = null, height = null;

if (require.main === module) {
    var fileCache = [];

    function loadFile(filename, callback) {
        var jpegData = jpeg.decode(fs.readFileSync(path.normalize(filename)));
        width = jpegData.width;
        height = jpegData.height;
        fileCache.push(jpegData.data);
        callback();
    }

    // console.log(process.argv)
    fs.readdir(process.argv[2], function(err, files) {
        files.sort();
        for(var i = 1; i < files.length; i++) {
            var q = queue();

            if (fileCache.length === 0) {
                q.defer(function(cb) { loadFile(process.argv[2] + '/' + files[i - 1], cb); });
            }
            q.defer(function(cb) { loadFile(process.argv[2] + '/' + files[i], cb); });

            q.awaitAll(function() {
                var diff = new PNG({width: width, height: height});
                var numDiff = pixelmatch(fileCache[0], fileCache[1], diff.data, width, height, {threshold: 0.1, includeAA: false});

                if (numDiff > 100) {
                    diff.pack().pipe(fs.createWriteStream('diff_' + path.basename(files[i], '.jpg') + '.png'));
                    console.log(files[i]);
                }
                fileCache.shift();
            });
        }
    });
}