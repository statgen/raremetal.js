/**
 * Helper methods devoted to running a calculation
 */


const numeric = require("numeric");

const { VariantMask, ScoreStatTable, GenotypeCovarianceMatrix, testBurden, testSkat, calcSkatWeights } = require("./stats.js");

/**
 * Parse the idealized portal response JSON for requesting covariance matrices
 * A spec of this format can be found in src/docs/portal-api.md
 * @param json
 */
function parsePortalCovariance(json) {
  // Result storage
  let loaded = {
    masks: {},
    scorecov: {}
  };

  /**
   * Store parsed masks to an object that looks like:
   * masks = { (group id): mask object }
   */
  let masks = {};
  for (let maskData of json.data.masks) {
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
  for (let scoreBlock of json.scorecov) {
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
      let score = scoreBlock.scores[i];

      if (altFreq > 0.5) {
        score = -score;
      }

      scoreTable.appendScore(
        variants[i],
        positions[i],
        score,
        variance,
        altFreq
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
 * @param tests A mapping of test labels -> test functions
 * @param scoreCov Object retrieved from parsePortalCovariance(). Contains masks, score statistics, and covariance matrices.
 * @param metaData An object that will be returned with the results. It could have an ID or description of what was tested.
 * @return {Promise<Object>} Rows of results, one per mask * group
 */
function runAggregationTests(tests, scoreCov, metaData) {
  let results = {
    data: {
      masks: [],
      results: []
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

      let res = {
        group: scoreBlock.group,
        mask: scoreBlock.mask,
        test: testLabel,
        pvalue: NaN,
        stat: NaN
      };

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
      res.pvalue = p;
      res.stat = stat;

      results.data.results.push(res);
    }
  }

  return results;
}

/**
 * Example of running many tests + masks at once
 * @return {Promise<Object>} Result object, which matches the format of the "result JSON format"
 */
async function _example(filename) {
  // Load example JSON of portal response from requesting covariance in a region
  filename = filename || "example.json";
  const response = await fetch(filename, { credentials: 'include' });
  const json = await response.json();
  const scoreCov = parsePortalCovariance(json);

  const tests = {
    "zegginiBurden": testBurden,
    "skatLiu": {
      test: (u, v, w) => testSkat(u, v, w, "liu"),
      weights: calcSkatWeights
    }
  };
  const metadata = {
    id: 100, // This gets repeated in the response  TODO: Necessary?
    description: "This is an example of running multiple tests and masks at once"
  };

  // Run all tests/masks
  return runAggregationTests(tests, scoreCov, metadata);
}

module.exports =  { parsePortalCovariance, runAggregationTests, _example };
