"use strict";

var path = require("path");
var request = require("request");
var fs = require("fs-extra");
var zlib = require("zlib");
var mkdirp = require("mkdirp");
var utils = require("./utils");

var ProgressBar = require("progress");

var runtimeUrl = {
	"iojs": "https://iojs.org/dist",
	"nodejs": "https://nodejs.org/dist"
};

var download = function(runtime, version, os, arch, targetDir) {
	var appCachePath = utils.getAppCachePath();
	var enginePath = path.join(appCachePath, [runtime, version, os, arch].join("-") + ".tar.gz")

	return new Promise(function(resolve, reject) {
		var downloadUrl = [runtimeUrl[runtime], version, [runtime, version, os, arch].join("-") + ".tar.gz"].join("/");

		fs.access(enginePath, fs.R_OK, function(err) {
			var tar = require("tar").Extract({
				path: targetDir,
				strip: 1
			})
				.on("close", function() {
					resolve(targetDir);
				}).on('error', function(err) {
					return reject(err);
				});

			var gunzip = zlib.createGunzip()
				.on('error', function(err) {
					return reject(err);
				});

			var source;

			if (err) {
				console.log("No runtime found, downloading");
				var bar;

				var targetCache = fs.createWriteStream(enginePath);				
				source = request(downloadUrl)
					.on('response', function(response) {
						if (response.statusCode < 200 || response.statusCode > 299) {
							return reject("Error loading " + downloadUrl + ": " + response.statusMessage);
						}
						if (response.headers["content-length"]) {
							var contentLength = parseInt(response.headers["content-length"], 10);
							bar = new ProgressBar('downloading engine [:bar] :percent :etas', {
								complete: '=',
								incomplete: ' ',
								width: 20,
								total: contentLength
							});
						}
					})
					.on('data', function(chunk) {
						if (bar) {
							bar.tick(chunk.length);
						}
					})
					.on('end', function() {
						console.log("");
					})
					.on('error', function(err) {
						return reject(err);
					});

				source.pipe(targetCache);
			} else {
				console.log("Using cached runtime");
				source = fs.createReadStream(enginePath);
			}

			source.pipe(gunzip).pipe(tar);
		});
	});
};

var copyRuntime = function(runtime, runtimePath, targetPath) {
	if (runtime == "iojs") {
		return utils.copyFile(path.join(runtimePath, "bin", "iojs"), path.join(targetPath, "node"), 0o755);
	} else if (runtime == "nodejs") {
		return utils.copyFile(path.join(runtimePath, "bin", "node"), path.join(targetPath, "node"), 0o755);
	} else {
		throw new Error("Unknown runtime");
	}
};

module.exports = {
	download: download,
	copyRuntime: copyRuntime
};