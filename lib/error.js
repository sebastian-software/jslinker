"use strict";

var LinkerError = function(message, originalError) {
	this.name = "JSLinkerError";
	this.message = message;
	this.originalError = originalError;

	if (originalError) {
		this.stack = originalError.stack;
	} else {
		this.stack = (new Error()).stack;
	}
};

LinkerError.prototype = Object.create(Error.prototype);
LinkerError.prototype.constructor = LinkerError;

module.exports = {
	LinkerError: LinkerError
};