"use strict";

var jslinker = require("./index");
var runtime = require("./runtime");
var path = require("path");
var fs = require("fs-extra");

var serveRuntime = function(runtimeName, version, os, arch, tempDir) {
	var runtimePath = path.join(tempDir, "runtime");
	var targetPath = path.join(tempDir, "app", "_runtime");

	return runtime.download(runtimeName, version, os, arch, runtimePath)
		.then(function() {
			return runtime.copyRuntime(runtimeName, runtimePath, targetPath);
		});
	
};

var run = function() {
	jslinker.makeTempDir().then(function(tempDir) {
		return Promise.all([
			jslinker.resolveDependencies("."),
			serveRuntime("iojs", "v1.6.4", "darwin", "x64", tempDir)
		]).then(function() {
			return jslinker.copyApp(".", path.join(tempDir, "app"));
		}).then(function() {
			var packageJson = fs.readJsonSync("./package.json");
			return jslinker.packApp(path.join(tempDir, "app"), path.join(".", "app"), packageJson.scripts.start);
		}).then(function() {
			console.log("result : ", tempDir);
		});
	}).catch(function(err) {
		console.error(err.stack ? err.stack : err);
	});

};

module.exports = {
	run: run
};