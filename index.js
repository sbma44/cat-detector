var fs = require('fs');
var pixelmatch = require('pixelmatch');
var jpeg = require('jpeg-js');
var queue = require('queue-async');
var PNG = require('pngjs2').PNG;
var path = require('path');

var width = null, height = null;

if (require.main === module) {
    var fileCache = [];

    function loadFile(filename, callback) {
        var jpegData = jpeg.decode(fs.readFileSync(path.normalize(filename)));
        width = parseInt(jpegData.width);
        height = parseInt(jpegData.height);
        fileCache.push(jpegData.data);
        callback();
    }

    function imgdiff(f1, f2) {
        var q = queue();
        if (fileCache.length === 0) {
            q.defer(function(cb) { loadFile(process.argv[2] + '/' + f1, cb); });
        }
        q.defer(function(cb) { loadFile(process.argv[2] + '/' + f2, cb); });

        q.awaitAll(function() {
            var diff = new PNG({width: width, height: height});
            // var diff = { data: new Buffer(width * height) };
            var numDiff = pixelmatch(fileCache[0], fileCache[1], diff.data, width, height, {threshold: 0.1, includeAA: false});
            if (numDiff > 200) {
                // fs.writeFileSync(path.normalize(process.argv[3] + '/img/diff_' + path.basename(f2, '.jpg') + '.png'), diff);
                diff.pack().pipe(fs.createWriteStream(path.normalize(process.argv[3] + '/diff_' + path.basename(f2, '.jpg') + '.png')));
                console.log(f2);
            }
            fileCache.shift();
        });
    }

    fs.readdir(process.argv[2], function(err, files) {
        files.sort();
        for(var i = 1; i < files.length; i++) {
            imgdiff(files[i-1], files[i]);
        }
    });
}