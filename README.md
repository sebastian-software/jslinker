# JSLinker
Links all NodeJS/iojs dependencies and executables to one self-contained executable

[![Travis CI](https://travis-ci.org/sebastian-software/jslinker.svg?branch=master)](https://travis-ci.org/sebastian-software/jslinker)
[![Code Climate](https://codeclimate.com/github/sebastian-software/jslinker/badges/gpa.svg)](https://codeclimate.com/github/sebastian-software/jslinker)
[![npm version](https://badge.fury.io/js/jslinker.svg)](http://badge.fury.io/js/jslinker)
[![Dependency Status](https://gemnasium.com/sebastian-software/jslinker.svg)](https://gemnasium.com/sebastian-software/jslinker)
[![downloads per month](http://img.shields.io/npm/dm/jslinker.svg)](https://www.npmjs.org/package/jslinker)

# Installation

Run `npm install -g jslinker`

# Usage

You need a full working NodeJS/iojs application that is described by a package.json with an including script.start section.

- Go to the path the file *package.json* is in
- Run `npm install`
- Run `jslinker --engine iojs --version v2.3.1 --platform linux --arch x64`

Now there is a new file [packagename]-[package version]-[platform]-[arch] that is executable. This file has no external dependencies.

To get help you can simply run `jslink --help`.

# Limitations

- Internet connection is required (nodejs or iojs is downloaded in the requested version)
- Linux and Mac only
- A well formed package.json with an start script is required

# License

MIT style license, see license file
