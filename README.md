## raremetal.js

[![Build Status](https://travis-ci.com/statgen/raremetal.js.svg?branch=master)](https://travis-ci.com/statgen/raremetal.js)
[![Dependency Status](https://david-dm.org/statgen/raremetal.js.svg)](https://david-dm.org/statgen/raremetal.js)
[![devDependency Status](https://david-dm.org/statgen/raremetal.js/dev-status.svg)](https://david-dm.org/statgen/raremetal.js#info=devDependencies)

A package for performing rare variant aggregation tests and meta-analysis using score covariance matrices.

For a general overview of these types of tests and study design issues, refer to ["Rare-Variant Association Analysis: Study Designs and Statistical Tests". Lee et al, 2014.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4085641/)

The methods implemented in this package are described across a number of papers and websites.

**Collapsing burden test (specifically the Morris-Zeggini test)**:

* ["An evaluation of statistical approaches to rare variant analysis in genetic association studies." Morris et al, 2010.](https://www.ncbi.nlm.nih.gov/pubmed/19810025)

**SKAT test**:

* ["Rare-Variant Association Testing for Sequencing Data with the Sequence Kernel Association Test." Wu et al, 2011.](https://www.cell.com/ajhg/fulltext/S0002-9297%2811%2900222-9)

**Variable threshold test**:

* ["A General Framework for Detecting Disease Associations with Rare Variants in Sequencing Studies." Lin et al, 2011.](https://doi.org/10.1016/j.ajhg.2011.07.015)

**SKAT optimal test**:

* ["General Framework for Meta-analysis of Rare Variants in Sequencing Association Studies." Lee et al, 2013.](https://doi.org/10.1016/j.ajhg.2013.05.010)
* ["Optimal Tests for Rare Variant Effects in Sequencing Association Studies." Lee et al, 2012.](https://doi.org/10.1093/biostatistics/kxs014)

**Methods for aggregation tests on covariance matrices**:

* ["Meta-analysis of gene-level tests for rare variant association." Liu et al, 2013.](https://www.nature.com/articles/ng.2852)
* A summarized version of the Liu et al. methods available [on our wiki.](https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD)

This package is based partly on methods implemented in the following software:

* [RAREMETAL](https://genome.sph.umich.edu/wiki/RAREMETAL)
* [rvtests](https://github.com/zhanxw/rvtests)

## Usage

### Installation

The package can be installed with NPM:

`npm install --save raremetal.js`

### Importing

This package may be incorporated into both web/browser and node.js based projects.

On the web, include the `dist/raremetal.min.js` file in your site:

`<script src="/path/to/your/assets/raremetal.min.js" type="application/javascript"></script>`

Or alternatively via CDN:

`<script src="https://cdn.example/raremetal.min.js" type="application/javascript"></script>`

Alternatively, the module can be loaded via node.js:

```javascript
// In node.js
const raremetal = require("raremetal.js");

// Helper functions for browser, such as loading JSON defining covariance/masks.
const helpers = raremetal.helpers;

// Statistical functions for calculating aggregation tests.
const stats = raremetal.stats;
```

### Examples

The best working example of how to use the library can be found in LocusZoom. The [aggregation test example](http://statgen.github.io/locuszoom/examples/aggregation_tests.html) shows how LocusZoom uses the functions in [src/app/helpers.js](helpers.js.html) to: 

* Load score statistics and covariance matrices for genes within a genomic region.
* Calculate aggregation tests (burden, SKAT) for each gene in the region.

Functions in [src/app/helpers.js](helpers.js.html) are designed to load data in JSON format from an API (or a static JSON file.) The API format is specified [this PDF](portal-api.pdf). 

For examples of loading data and running tests using the command-line (CLI) version of this package, see 
[src/app/cli.js](cli.js.html). Scores and covariances are loaded from rvtest or RAREMETAL formatted files. When installing
this package, an executable script `raremetal.js` should be installed, which corresponds to [src/app/cli.js](cli.js.html). 

## Development

### Requirements

This package has been developed and tested using Node.js 10 LTS (Dubnium). It currently does not work with the latest version of Node.js, though we aim to patch that eventually. You can manage multiple Node.js versions using [nvm](https://github.com/creationix/nvm), and this package includes a `.nvmrc` file that specifies which version we are currently testing against.

If you would like to make changes to the core functionality within this module for development, the best method would be
to [fork the repository on Github](https://github.com/statgen/raremetal.js#fork-destination-box), and then clone your fork locally:

```
# Clone from github
git clone https://github.com/your_account/raremetal.js

# Install project dependencies
cd raremetal.js
npm install
```

Alternatively, you could clone directly from our repository with `git clone https://github.com/statgen/raremetal.js`.
This will make it difficult to contribute your changes back upstream to us, however.

Building some portions of the documentation (such as methods and API docs) require `pandoc` and a working `LaTeX` installation on your
system; you must install these separately. Already built documentation is provided in both the npm package and the git repository.

### Useful Commands

The following commands are particularly useful during development
- `npm test`: run unit tests and exit
- `npm run watch`: auto-run tests whenever code changes
- `npm run build`: build `dist/` files and documentation

[raremetal.js]: https://github.com/statgen/raremetal.js
