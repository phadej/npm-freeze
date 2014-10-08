# npm-freeze

**TL;DR**, you probably want to use [npm shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html).

> Dump versions of packages in `node_modules/`.

[![Build Status](https://secure.travis-ci.org/phadej/npm-freeze.svg?branch=master)](http://travis-ci.org/phadej/npm-freeze)
[![NPM version](https://badge.fury.io/js/npm-freeze.svg)](http://badge.fury.io/js/npm-freeze)
[![Dependency Status](https://david-dm.org/phadej/npm-freeze.svg)](https://david-dm.org/phadej/npm-freeze)
[![devDependency Status](https://david-dm.org/phadej/npm-freeze/dev-status.svg)](https://david-dm.org/phadej/npm-freeze#info=devDependencies)
[![Code Climate](https://img.shields.io/codeclimate/github/phadej/npm-freeze.svg)](https://codeclimate.com/github/phadej/npm-freeze)

## Synopsis

```sh
npm install -g npm-freeze

# Create version manifest in your project folder
npm-freeze manifest

# ... after a while check that freshly installed versions are still the same
rm -rf node_modules
npm install
npm-freeze check
```

## Screenshots

### Default options
![jsverify default](https://raw.githubusercontent.com/phadej/npm-freeze/master/screenshots/patch.png)

### --minor
![jsverify minor](https://raw.githubusercontent.com/phadej/npm-freeze/master/screenshots/minor.png)
