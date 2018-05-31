/**
 * Helper methods devoted to running aggregation tests in browser.
 *
 * @module helpers
 * @license MIT
 */

import numeric from 'numeric';
import { VariantMask, ScoreStatTable, GenotypeCovarianceMatrix, testBurden, testSkat, calcSkatWeights } from './stats.js';

/**
 * Parse the idealized portal response JSON for requesting covariance matrices.
 * A spec of this format can be found in src/docs/portal-api.md.
 * @param json JSON object from portal API response. An 'example.json' file is included in the root of this project.
 *  The [_example]{@link module:helpers~_example} function shows an example of how to use it.
 */
function parsePortalJson(json) {
  // Result storage
  let loaded = {
    masks: {},
    scorecov: {}
  };

  const data = json.data;

  /**
   * Store parsed masks to an object that looks like:
   * masks = { (group id): mask object }
   */
  let masks = {};
  for (let maskData of data.masks) {
    let mask = new VariantMask();
    mask.id = maskData.id;
    mask.label = maskData.label;

    for (let [group, groupData] of Object.entries(maskData.groups)) {
      mask.createGroup(group, groupData.variants);
    }

    masks[mask.id] = mask;
  }

  // Store masks for return
  loaded["masks"] = masks;

  // Load scores and covariance matrices
  for (let scoreBlock of data.scorecov) {
    let mask = masks[scoreBlock.mask];
    let variants = mask.getGroup(scoreBlock.group);
    let positions = variants.map(x => parseInt(x.match(/(chr)?(\w+):(\d+)_([A-Z]+)\/([A-Z]+)/)[3]));

    // Scores
    let scoreTable = new ScoreStatTable();
    scoreTable.sampleSize = scoreBlock.nsamples;
    for (let i = 0; i < scoreBlock.scores.length; i++) {
      // Diagonal element of linearized (lower triangular) covariance matrix
      let n = i + 1;
      let variance = scoreBlock.covariance[n * (n + 1) / 2 - 1];
      let altFreq = scoreBlock.altFreq[i];
      let pvalue = scoreBlock.pvalue[i];
      let score = scoreBlock.scores[i];

      if (altFreq > 0.5) {
        score = -score;
      }

      scoreTable.appendScore(
        variants[i],
        positions[i],
        score,
        variance,
        altFreq,
        NaN,
        NaN,
        pvalue
      );
    }

    // Preallocate matrix
    const n_variants = variants.length;
    let covmat = new Array(n_variants);
    for (let i = 0; i < n_variants; i++) {
      covmat[i] = new Array(n_variants).fill(null);
    }

    // Map from variant ID or position => matrix index
    const posMap = new Map();
    for (let i = 0; i < n_variants; i++) {
      let vobj = variants[i];
      posMap.set(vobj.pos, i);
    }

    // Load the covariance matrix from the response JSON
    let c = 0;
    for (let i = 0; i < n_variants; i++) {
      for (let j = i; j < n_variants; j++) {
        let v = scoreBlock.covariance[c];
        let iAltFreq = scoreTable.altFreq[i];
        let jAltFreq = scoreTable.altFreq[j];

        if (i !== j) {
          if ((iAltFreq > 0.5) ^ (jAltFreq > 0.5)) {
            v = -v;
          }
        }

        covmat[i][j] = v;
        covmat[j][i] = v;

        c += 1;
      }
    }

    covmat = numeric.mul(scoreTable.sampleSize, covmat);

    // Construct the covariance matrix object and store it
    let covMatrix = new GenotypeCovarianceMatrix(covmat, variants, posMap);

    // Store result
    loaded.scorecov[[scoreBlock.mask, scoreBlock.group]] = {
      mask: scoreBlock.mask,
      group: scoreBlock.group,
      nsamples: scoreBlock.nsamples,
      scores: scoreTable,
      covariance: covMatrix
    };
  }

  return loaded;
}

/**
 * Function to run multiple tests and masks.
 *
 * "Tests" means aggregation tests, for example burden or SKAT.
 *
 * A mask is a mapping from a group label to a list of variants. Usually the group is a gene ID or name
 * but in reality it can be anything.
 *
 * @param tests A mapping of test labels -> test functions.
 * @param scoreCov Object retrieved from parsePortalJson(). Contains masks, score statistics, and covariance matrices.
 * @param metaData An object that will be returned with the results. It could have an ID or description of what was tested.
 * @return {Promise<Object>} Rows of results, one per mask * group.
 */
function runAggregationTests(tests, scoreCov, metaData) {
  let results = {
    data: {
      masks: [],
      singleVariantResults: {
        variant: [],
        altFreq: [],
        pvalue: []
      },
      groupResults: {
        group: [],
        mask: [],
        test: [],
        pvalue: [],
        stat: []
      }
    }
  };

  Object.assign(results, metaData);
  results.data.masks = Object.values(scoreCov.masks);

  for (let scoreBlock of Object.values(scoreCov.scorecov)) {
    for (let [testLabel, testObject] of Object.entries(tests)) {
      let testFunc;
      let weightFunc;
      if (typeof testObject === 'function') {
        testFunc = testObject;
      }
      else if (typeof testObject === 'object') {
        weightFunc = testObject.weights;
        testFunc = testObject.test;
      }

      if (scoreBlock.scores.u.length === 0 || scoreBlock.covariance.matrix.length === 0) {
        continue;
      }

      // Calculate weights if necessary
      let w;
      if (weightFunc) {
        // Use default weights for now, will offer option to specify later
        w = weightFunc(scoreBlock.scores.altFreq.map(x => Math.min(x, 1 - x)));
      }

      let [stat, p] = testFunc(scoreBlock.scores.u, scoreBlock.covariance.matrix, w);

      // Store results for each group
      results.data.groupResults.group.push(scoreBlock.group);
      results.data.groupResults.mask.push(scoreBlock.mask);
      results.data.groupResults.test.push(testLabel);
      results.data.groupResults.pvalue.push(p);
      results.data.groupResults.stat.push(stat);

      // Store single-variant results
      results.data.singleVariantResults.variant = scoreBlock.scores.variants;
      results.data.singleVariantResults.altFreq = scoreBlock.scores.altFreq;
      results.data.singleVariantResults.pvalue = scoreBlock.scores.pvalue;
    }
  }

  return results;
}

/**
 * Example of running many aggregation tests + masks at once.
 * @param filename {string} Path to JSON object which contains portal API response for scores/covariance/masks.
 * @return {Promise<Object>} Result object, which matches the format of the "result JSON format"
 */
async function _example(filename) {
  // Load example JSON of portal response from requesting covariance in a region
  filename = filename || "example.json";
  const response = await fetch(filename, { credentials: 'include' });
  const json = await response.json();
  const scoreCov = parsePortalJson(json);

  const tests = {
    "zegginiBurden": testBurden,
    "skatLiu": {
      test: (u, v, w) => testSkat(u, v, w, "liu"),
      weights: calcSkatWeights
    },
    "skatDavies": {
      test: (u, v, w) => testSkat(u, v, w, "davies"),
      weights: calcSkatWeights
    }
  };

  /**
   * Example metadata to merge into the aggregation test result object.
   * Can be left undefined if not desired.
   */
  const metadata = {
    id: 100,
    description: "This is an example of running multiple tests and masks at once"
  };

  // Run all tests/masks
  return runAggregationTests(tests, scoreCov, metadata);
}

export { parsePortalJson, runAggregationTests, _example };
