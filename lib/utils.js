"use strict";

var fs = require("fs-extra");

var copyFile = function(src, dst, mode) {
	return new Promise(function(resolve, reject) {
		console.log("Copy " + src + " to " + dst);

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

module.exports = {
	copyFile: copyFile
};