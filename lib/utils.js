"use strict";

var fs = require("fs-extra");

var AppDirectory = require('appdirectory');
var dirs = new AppDirectory('jslinker');

var copyFile = function(src, dst, mode) {
	return new Promise(function(resolve, reject) {
		//console.log("Copy " + src + " to " + dst);

		fs.copy(src, dst, {
			mode: mode || 0o660
		}, function(err) {
			if (err) {
				return reject(err);
			}

			return resolve(dst);
		});
	});
};

var getAppCachePath = function() {
	var cachePath = dirs.userCache();

	fs.mkdirsSync(cachePath);

	return cachePath;
};

module.exports = {
	copyFile: copyFile,
	getAppCachePath: getAppCachePath
};