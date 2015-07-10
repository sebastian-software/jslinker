"use strict";

var path = require("path");
var fs = require("fs-extra");
var tempfs = require("temp-fs");
var utils = require("./utils");
var zlib = require("zlib");
var fstream = require("fstream");
var tar = require("tar");
var spawn = require("child_process").spawn;

var resolveDependencies = function(path) {
	console.log("Update npm dependencies in background")
	return new Promise(function(resolve, reject) {
		var npm = spawn("npm", ["install"], {
			cwd: path,
			stdio: "inherit"
		});

		npm.on("close", function(code) {
			if (code === 0) {
				console.log("All npm dependencies updated");
				resolve();
			} else {
				console.log("npm update failed with code", code)
				reject(code);
			}
		});
	});
};

var makeTempDir = function() {
	return new Promise(function(resolve, reject) {
		tempfs.mkdir({
			track: true,
			recursive: true
		}, function(err, dir) {
			if (err) {
				return reject(err);
			}

			return resolve(dir.path);
		});
	});
};

var copyApp = function(srcPath, dstPath) {
	return new Promise(function(resolve, reject) {
		fs.copy(srcPath, dstPath, function(err) {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});
};

var appendApp = function(appPath, destPath, command) {
	return new Promise(function(resolve, reject) {
		var onError = function(err) {
			console.error("ERR", err);
			reject(err);
		};

		//console.log("APPEND ", appPath, " TO ", destPath);

		var out = fs.createWriteStream(destPath, {
			flags: 'a'
		})
			.on("error", onError)
			.on("close", function() {
				//console.log("OUT CLOSE");
				resolve(destPath);
			});

		out.write("\n${OUTPUT}/app/_runtime/node ${OUTPUT}/app/" + command + " $*");
		out.write("\nEXITCODE=\"$?\"");
		out.write("\nrm -fr ${OUTPUT}/app")
		out.write("\nrmdir ${OUTPUT}")
		out.write("\nexit $EXITCODE")
		out.write("\n__END__\n")

		var zip = zlib.createGzip({
			level: 9
		})
			.on("error", onError);

		var packer = tar.Pack({ 
			noProprietary: true
		})
			.on("error", onError);

		fstream.Reader({ 
			path: appPath,
			type: "Directory"
		})
			.on('error', onError)
			.pipe(packer)
			.pipe(zip)
			.pipe(out);
	});
};

var packApp = function(appPath, executable, command) {
	var scriptPath = path.join(__dirname, "..", "scripts", "run.sh");
	return utils.copyFile(scriptPath, executable, 0o755)
		.then(function(destPath) {
			return appendApp(appPath, destPath, command);
		});
};

module.exports = {
	resolveDependencies: resolveDependencies,
	makeTempDir: makeTempDir,
	copyApp: copyApp,
	packApp: packApp
};