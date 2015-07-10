# JSLinker
Links all NodeJS/iojs dependencies and executables to one self-contained executable

<img src="https://travis-ci.org/sebastian-software/jslinker.svg?branch=master" />

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
