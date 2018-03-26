:warning: This package is under active development and not ready for production use. Results may be incorrect, documentation is likely not up to date and incorrect in many places. :warning:

## raremetal.js

A package for performing burden tests and meta-analysis using score covariance matrices

[![Travis build status](http://img.shields.io/travis/statgen/raremetal.js.svg?style=flat)](https://travis-ci.org/statgen/raremetal.js)
[![Dependency Status](https://david-dm.org/statgen/raremetal.js.svg)](https://david-dm.org/statgen/raremetal.js)
[![devDependency Status](https://david-dm.org/statgen/raremetal.js/dev-status.svg)](https://david-dm.org/statgen/raremetal.js#info=devDependencies)

## Synopsis

## Usage

### How to include in your project

This package may be directly incorporated into other javascript projects as a module, or by including 
`dist/raremetal.min.js` directly into your page (as a standalone file, or via a CDN option such as unpkg). 

`raremetal.js` also supports several packaging environments and may be used in both client and server side 
applications, including Node.js, ES6 modules, and Webpack. It may be installed from NPM:

`npm install --save raremetal.js`

For information about performance impacts of client-side computation, see [timing and performance estimates](https://github.com/statgen/raremetal.js/src/docs/timings.md).

### Examples

The instructions below assume that the module is being sourced directly into a page:

`<script src="https://cdn.example/raremetal.min.js" type="application/javascript"></script>`

...

## Development

### Requirements

This package has been developed and tested using Node.js 8 LTS (Carbon).

If you would like to make changes to the core functionality within this module for development, install package 
requirements as follows:

`npm install` 

Some portions of the documentation (such as methods) require `pandoc` and a working `LaTeX` installation on your 
system; you must install these separately.

### Useful Commands

The following commands are particularly useful during development 
- `npm test`: run unit tests and exit
- `npm run watch`: auto-run tests whenever code changes
- `npm run build`: build `dist/` files and update documentation

[raremetal.js]: https://github.com/statgen/raremetal.js

