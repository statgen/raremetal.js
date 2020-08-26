# raremetal.js

[![Build Status](https://travis-ci.com/statgen/raremetal.js.svg?branch=master)](https://travis-ci.com/statgen/raremetal.js)
[![Dependency Status](https://david-dm.org/statgen/raremetal.js.svg)](https://david-dm.org/statgen/raremetal.js)
[![devDependency Status](https://david-dm.org/statgen/raremetal.js/dev-status.svg)](https://david-dm.org/statgen/raremetal.js#info=devDependencies)

A package for performing rare variant aggregation tests and meta-analysis using score covariance matrices.

For a general overview of these types of tests and study design issues, refer to ["Rare-Variant Association Analysis: Study Designs and Statistical Tests". Lee et al, 2014.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4085641/)

The methods implemented in this package are described across a number of papers and websites.

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

- [Methods](#methods)
- [Usage](#usage)
  - [Installation](#installation)
  - [Importing](#importing)
  - [Usage in the browser](#usage-in-the-browser)
  - [Usage on the server (CLI)](#usage-on-the-server-cli)
    - [Single study](#single-study)
    - [Meta-analysis of multiple studies (not well tested)](#meta-analysis-of-multiple-studies-not-well-tested)
    - [Examples](#examples)
      - [Test single gene/group](#test-single-genegroup)
      - [Test all genes/groups](#test-all-genesgroups)
- [Development](#development)
  - [Requirements](#requirements)
  - [Useful commands](#useful-commands)
  - [Internal testing](#internal-testing)

<!-- /code_chunk_output -->

## Methods

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
* [SKAT R package](https://cran.r-project.org/web/packages/SKAT/index.html)
* [MetaSKAT R package](https://cran.r-project.org/web/packages/MetaSKAT/index.html)

## Usage

### Installation

The package can be installed with NPM:

`npm install --save raremetal.js`

### Importing

This package may be incorporated into both web/browser and node.js based projects.

On the web, include the `dist/raremetal.js` file in your site:

`<script src="/path/to/your/assets/raremetal.js" type="application/javascript"></script>`

(if you are copying files over, make sure that `mvtdstpack.wasm` is in the same folder)

Or alternatively, you can automatically fetch all needed files via CDN:

`<script type="application/javascript" src="https://cdn.jsdelivr.net/npm/raremetal.js/dist/raremetal.js"
          crossorigin="anonymous"></script>`

Alternatively, the module can be loaded via node.js:

```javascript
// In node.js
const raremetal = require("raremetal.js");

// Helper functions for browser, such as loading JSON defining covariance/masks.
const helpers = raremetal.helpers;

// Statistical functions for calculating aggregation tests.
const stats = raremetal.stats;
```

### Usage in the browser

The best working example of how to use the library can be found in LocusZoom. The [aggregation test example](http://statgen.github.io/locuszoom/examples/aggregation_tests.html) shows how LocusZoom uses the functions in [src/app/helpers.js](helpers.js.html) to:

* Load score statistics and covariance matrices for genes within a genomic region.
* Calculate aggregation tests (burden, SKAT) for each gene in the region.

Functions in [src/app/helpers.js](helpers.js.html) are designed to load data in JSON format from an API (or a static JSON file.) The [API format](https://github.com/statgen/LDServer/blob/master/docs/raremetal-api.md) is the same as implemented in the [raremetal app](https://github.com/statgen/LDServer#raremetal-app) of the [LDServer](https://github.com/statgen/LDServer).

### Usage on the server (CLI)

A command line interface is included for running raremetal.js on a server or your local machine. You will need a recent version of node.js (12.0+ recommended.)

The CLI is fairly basic and mainly used for testing when [comparing to other software](#internal-testing).

#### Single study

```
usage: raremetal.js single [-h] [-m MASK] [-s SCORE] [-t TEST] [-c COV]
                           [-g GROUP] [--skato-rhos SKATO_RHOS] [-o OUT]
                           [--silent SILENT]


Optional arguments:
  -h, --help            Show this help message and exit.
  -m MASK, --mask MASK  Mask file defining variants assigned to each group
  -s SCORE, --score SCORE
                        File containing score statistics per variant
  -t TEST, --test TEST  Specify group-based test to run. Can be 'burden',
                        'skat'.
  -c COV, --cov COV     File containing covariance statistics across windows
                        of variants
  -g GROUP, --group GROUP
                        Only analyze 1 group/gene.
  --skato-rhos SKATO_RHOS
                        Specify rho values for SKAT-O as comma separated
                        string.
  -o OUT, --out OUT     File to write results to.
  --silent SILENT       Silence console output.
```

Possible tests for `-t` are `burden`, `skat-davies`, `skat-liu`, `vt`, and `skato`.


#### Meta-analysis of multiple studies (not well tested)

```
usage: raremetal.js meta [-h] [--spec SPEC]

Optional arguments:
  -h, --help   Show this help message and exit.
  --spec SPEC  YAML file specifying studies & their files.
```

The `--spec` YAML file should look like:

```yaml
studies:
  study1:
    scores: study1/rvtest.LDL.chrom22.MetaScore.assoc.gz
    cov: study1/rvtest.LDL.chrom22.MetaCov.assoc.gz
  study2:
    scores: study2/rvtest.LDL.chrom22.MetaScore.assoc.gz
    cov: study2/rvtest.LDL.chrom22.MetaCov.assoc.gz

settings:
  mask: masks/epacts.mask.chr22.tab
  tests:
    - burden
    - skato

  output: results/test_meta
```

#### Examples

##### Test single gene/group

```bash
#!/bin/bash
raremetal.js single \
  -s 'test.MetaScore.assoc.gz' \
  -c 'test.MetaCov.assoc.gz' \
  -m 'mask.tab' \
  -g 'MYGENE1' \
  -t 'skato' \
  -o 'results'
```

##### Test all genes/groups

Omit the `-g XXX` option and it will run over all groups present in the mask file.

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

### Useful commands

The following commands are particularly useful during development
- `npm run test`: run unit tests and exit
- `npm run dev`: auto-run tests whenever code changes
- `npm run build`: build `dist/` files and documentation

[raremetal.js]: https://github.com/statgen/raremetal.js

### Internal testing

Please see `/net/snowwhite/home/welchr/projects/covarmatrices/README.md` for details on how we compared raremetal.js with existing programs
such as (rvtest, RAREMETAL, MetaSKAT) on larger test sets of data (whole genome sequencing, or simulated data.) Unit tests were subsequently
derived from these larger tests to cover edge cases and extreme p-values.
