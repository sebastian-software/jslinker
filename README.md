# JSLinker
Links all NodeJS/iojs dependencies and executables to one self-contained executable

# Installation

Run `npm install -g jslinker`

# Usage

You need a full working NodeJS/iojs application that is described by a package.json with an including script.start section.

- Go to the path the file *package.json* is in
- Run `npm install`
- Run `jslinker --engine iojs --version v2.3.1 --platform linux --arch x64`

Now there is a new file <packagename>-<package version>-<platform>-<arch> that is executable. This file has no external dependencies.

To get help you can simply run `jslink --help`.

# License

MIT style license, see license file
