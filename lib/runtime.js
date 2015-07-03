"use strict";

var path = require("path");
var request = require("request");
var fs = require("fs-extra");
var zlib = require("zlib");
var mkdirp = require("mkdirp");
var utils = require("./utils");

var runtimeUrl = {
	"iojs": "https://iojs.org/dist",
	"nodejs": "https://nodejs.org/dist"
};

var download = function(runtime, version, os, arch, targetDir) {
	return new Promise(function(resolve) {
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
					contentLength = parseInt(response.headers["content-length"], 10);
				}
			})
			.on('data', function(chunk) {
				downloadedLength += chunk.length;
				console.log(Math.round(downloadedLength / contentLength * 100) + "%");
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