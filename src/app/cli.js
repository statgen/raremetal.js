#!/usr/bin/env node

/**
 * Command-line interface for running aggregation tests locally in node.js
 * @module cli
 * @license MIT
 */

const {ArgumentParser} = require("argparse");
const {readMaskFileSync, extractScoreStats, extractCovariance} = require("./fio.js");
const {REGEX_EPACTS} = require("./constants.js");
const {testBurden} = require("./stats.js");
const fs = require("fs");
const yaml = require("js-yaml");

function getSettings() {
  let parser = new ArgumentParser({
    description: "Script for running gene-based tests with raremetal.js",
    addHelp: true
  });

  let subParsers = parser.addSubparsers({
    title: "Sub-commands",
    dest: "subcommand"
  });

  let single = subParsers.addParser("single", {addHelp: true});

  single.addArgument(["-m", "--mask"], {help: "Mask file defining variants assigned to each group"});
  single.addArgument(["-s", "--score"], {help: "File containing score statistics per variant"});
  single.addArgument(["-t", "--test"], {help: "Specify group-based test to run. Can be 'burden', 'skat'."});
  single.addArgument(["-c", "--cov"], {help: "File containing covariance statistics across windows of variants"});
  single.addArgument(["-g", "--group"], {help: "Only analyze 1 group/gene."});
  single.addArgument(["-o", "--out"], {help: "File to write results to."});

  let meta = subParsers.addParser("meta", {addHelp: true});
  meta.addArgument(["--spec"], {help: "YAML file specifying studies & their files."});

  return parser.parseArgs();
}

class Results {
  constructor() {
    this.results = [];
  }

  addResult(group, pvalue) {
    this.results.push({
      group: group,
      pvalue: pvalue,
    })
  }

  toString() {
    let s = "group\tpvalue\n";
    //let s = Object.keys(this.results[0]).join("\t") + "\n";
    for (let obj of this.results) {
      s += obj["group"] + "\t";
      s += obj["pvalue"].toExponential(2) + "\n";
    }
    return s;
  }
}

/**
 * Run aggregation tests on a single study
 * @param args
 * @return {Promise<Results>}
 */
async function single(args) {
  // Load mask file.
  const mask = readMaskFileSync(args.mask);

  // Run test on one group, or all groups
  const results = new Results();

  let total = args.group == null ? mask.size() : 1;
  let i = 1;
  for (let [group, groupVars] of mask) {
    if (args.group !== null && args.group !== group) {
      continue;
    }

    console.log(`Testing [${i}/${total}]: ${group} | nvariants: ${groupVars.length}`);
    let chrom = groupVars[0].match(REGEX_EPACTS)[1];
    let start = groupVars[0].match(REGEX_EPACTS)[2];
    let end = groupVars[groupVars.length - 1].match(REGEX_EPACTS)[2];
    let region = `${chrom}:${start}-${end}`;

    let scores = await extractScoreStats(args.score, region, groupVars);

    /**
     * During the loading of the score stats, we may have dropped some of the
     * group variants due to monomorphic or other QC issues.
     * Use scores.variants instead.
     */
    let cov = await extractCovariance(args.cov, region, scores.variants, scores);

    if (args.test === 'burden') {
      let [z, p] = testBurden(scores.u, cov.matrix, null);
      results.addResult(group, p);
    }
    else if (args.test === 'skat') {
      throw 'SKAT not yet implemented';
    }

    i += 1;
  }

  if (args.out != null) {
    // @todo should compress this
    fs.writeFileSync(args.out, results.toString(), {encoding: "utf8"});
  } else {
    console.log(results.toString());
  }

  return results;
}

/**
 * Calculate aggregation tests and meta-analyze them across multiple studies
 * @todo Reconsolidate single and meta later, they're basically the same code,
 *  but we need to get this tested ASAP...
 * @param args
 * @return {Promise<Results>}
 */
async function meta(args) {
  const spec = yaml.safeLoad(fs.readFileSync(args.spec, 'utf8'));

  // Load mask file.
  const mask = readMaskFileSync(spec.settings.mask);

  // Results
  const results = {};
  for (let test of spec.settings.tests) {
    results[test] = new Results();
  }

  let total = spec.settings.group == null ? mask.size() : 1;
  let i = 1;
  for (let [group, groupVars] of mask) {
    if (spec.settings.group != null && spec.settings.group !== group) {
      continue;
    }

    console.log(`Testing [${i}/${total}]: ${group} | nvariants: ${groupVars.length}`);
    let chrom = groupVars[0].match(REGEX_EPACTS)[1];
    let start = groupVars[0].match(REGEX_EPACTS)[2];
    let end = groupVars[groupVars.length - 1].match(REGEX_EPACTS)[2];
    let region = `${chrom}:${start}-${end}`;

    // Load the score statistics and covariance matrices in this region across all studies
    // Then merge them into the final scores/covariances
    let store = {};
    let finalScores = null;
    let finalCov = null;
    for (let [study, files] of Object.entries(spec.studies)) {
      let scores = await extractScoreStatsSync(files.scores, region, groupVars);

      /**
       * During the loading of the score stats, we may have dropped some of the
       * group variants due to monomorphic or other QC issues.
       * Use scores.variants instead.
       */
      let cov = await extractCovariance(files.cov, region, scores.variants, scores);

      store[study] = {
        scores: scores,
        cov: cov
      };

      if (finalScores == null) {
        finalScores = scores;
      } else {
        finalScores.add(scores);
      }

      if (finalCov == null) {
        finalCov = cov;
      } else {
        finalCov.add(cov);
      }
    }

    // Now run the tests with the final scores/covariances
    for (let test of spec.settings.tests) {
      if (test === 'burden') {
        let [z, p] = testBurden(finalScores.u, finalCov.matrix, null);
        results[test].addResult(group, p);
      }

      if (test === 'skat') {
        throw 'SKAT not yet implemented';
      }
    }

    i += 1;
  }

  // Write results for each test to separate file.
  for (let test of spec.settings.tests) {
    let out = spec.settings.output + "." + test + ".tab";
    let test_results = results[test];

    // @todo should compress this
    fs.writeFileSync(out, test_results.toString(), {encoding: "utf8"});
  }

  return results;
}

if (typeof require !== 'undefined' && require.main === module) {
  // Grab arguments
  const args = getSettings();
  console.log(args);

  let main;
  if (args.subcommand === "single") {
    main = single;
  } else if (args.subcommand === "meta") {
    main = meta;
  } else {
    console.log("Error: must specify command, either 'single' or 'meta'");
    process.exit(1);
  }

  main(args).then(result => {

  }).catch(error => {
    console.log(error);
  })
}
