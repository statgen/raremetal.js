/**
 * Calculate aggregation tests and meta-analysis of these tests
 * using score statistics and covariance matrices in the browser.
 *
 * Modules related to command-line usage are not included in this bundle.
 *
 * @module browser
 * @license MIT
 */

const {VariantMask, ScoreStatTable, GenotypeCovarianceMatrix, testBurden, testSkat} = require("./stats.js");
const fetch = require("node-fetch");

/**
 * Check if we're running in node.js or browser
 * Borrows code from https://github.com/iliakan/detect-node (MIT)
 * @return {boolean}
 */
function isNode() {
  return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}

async function parsePortalJson(json) {
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
      mask.createGroup(group,groupData.variants);
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
      let variance = scoreBlock.covariance[n*(n+1)/2-1];

      scoreTable.appendScore(
        variants[i],
        positions[i],
        scoreBlock.scores[i],
        variance,
        scoreBlock.altFreq[i]
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
      for (let j = 0; j < i + 1; j++) {
        covmat[i][j] = scoreBlock.covariance[c];
        covmat[j][i] = scoreBlock.covariance[c];
        c += 1;
      }
    }

    // Construct the covariance matrix object and store it
    let covMatrix = new GenotypeCovarianceMatrix(covmat,variants,posMap);

    // Store result
    loaded.scorecov[[scoreBlock.mask,scoreBlock.group]] = {
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
 * Example of running many tests + masks at once
 * @return {Promise<void>}
 * @private
 */
async function _example() {
  // Load example JSON of portal response from requesting covariance in a region
  let json;
  if (isNode()) {
    const fs = require("fs");
    let jsonRaw = fs.readFileSync("example.json");
    json = JSON.parse(jsonRaw);
  }
  else {
    const response = await fetch("example.json");
    json = await response.json();
  }

  return parsePortalJson(json);

  // Run all tests/masks
  /*
  let results = await runAggregationTests(
    {
      "Collapsing burden test": testBurden,
      "SKAT test": testSkat,
    },
    {
      "PTV": {
        mask: mask1,
        label: "Only protein truncating variants",
        type: "gene"
      },
      "LOF": {
        mask: mask2,
        label: "Loss of function variants",
        type: "gene"
      }
    },
    score_cov,
    {
      id: 100, // This gets repeated in the response
      description: "This is an example of running multiple tests and masks at once"
    }
  );

  return results;
  */
}

module.exports = {parsePortalJson, _example};
