"use strict";

var jslinker = require("./index");
var runtime = require("./runtime");
var path = require("path");
var fs = require("fs-extra");

var isIojs = require('is-iojs');

var serveRuntime = function(runtimeName, version, os, arch, tempDir) {
	var runtimePath = path.join(tempDir, "runtime");
	var targetPath = path.join(tempDir, "app", "_runtime");

	return runtime.download(runtimeName, version, os, arch, runtimePath)
		.then(function() {
			return runtime.copyRuntime(runtimeName, runtimePath, targetPath);
		});
	
};

var syntax = function() {
	var param = function(name, values, desc, def) {
		console.log("  --" + name + " "+ values +": " + desc + " (" + def + ")");	
	};

	console.log("Syntax: jslinker [options]");
	param("engine", "<iojs|nodejs>     ", "Sets engine for build executable", isIojs ? "iojs" : "nodejs");
	param("version", "<version string> ", "Sets version for build executable", process.version);
	param("platform", "<darwin|linux>  ", "Sets platform for build executable", process.platform);
	param("arch", "<ia32|x64>          ", "Sets architecture for build executable", process.arch);
};

var getOptions = function(argv, def) {
	for (var key in argv) {
		def[key] = argv[key];
	}

	return def;
};

var run = function(argv) {
	console.log("jslinker - Copyright (C) 2015 Sebastian Software GmbH, Mainz, Germany\n");

	var args = require('minimist')(argv.slice(2));

	if (args.help) {
		syntax();
		process.exit(1);
	}

	var config = getOptions(args, {
		engine: isIojs ? "iojs" : "nodejs",
		version: process.version,
		platform: process.platform,
		arch: process.arch
	});

	if (config.arch == "ia32") {
		config.arch = "x86";
	}
	jslinker.makeTempDir().then(function(tempDir) {
		var packageJson = fs.readJsonSync("./package.json");
		
		var app = path.join(".", [packageJson.name, packageJson.version, config.platform, config.arch].join("-"));

		return Promise.all([
			jslinker.resolveDependencies("."),
			serveRuntime(config.engine, config.version, config.platform, config.arch, tempDir)
		]).then(function() {
			return jslinker.copyApp(".", path.join(tempDir, "app"));
		}).then(function() {
			return jslinker.packApp(path.join(tempDir, "app"), app, packageJson.scripts.start);
		}).then(function() {
			return new Promise(function(resolve, reject) {
				fs.chmod(app, 0o755, function(err) {
					if (err) {
						return reject(err);
					}
					return resolve();
				});
			});
		}).then(function() {
			console.log(app + " created");
		});
	}).catch(function(err) {
		console.error(err.stack ? err.stack : err);
	});

};

module.exports = {
	run: run
};