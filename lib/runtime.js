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
	return new Promise(function(resolve, reject) {
		var downloadUrl = [runtimeUrl[runtime], version, [runtime, version, os, arch].join("-") + ".tar.gz"].join("/");

		var tar = require("tar").Extract({
			path: targetDir,
			strip: 1
		});
		tar.on("close", function() {
			resolve(targetDir);
		});
		var gunzip = zlib.createGunzip();

		var contentLength = null;
		var downloadedLength = 0;
		request(downloadUrl)
			.on('response', function(response) {
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
			})
			.pipe(gunzip)
			.pipe(tar);
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