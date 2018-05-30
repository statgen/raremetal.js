/**
 * Helper methods devoted to running aggregation tests in browser.
 *
 * @module helpers
 * @license MIT
 */

import numeric from 'numeric';

import { REGEX_EPACTS } from './constants.js';
import { VariantMask, ScoreStatTable, GenotypeCovarianceMatrix,
  AggregationTest, SkatTest, ZegginiBurdenTest } from './stats.js';

const _all_tests = [ZegginiBurdenTest, SkatTest];

/**
 * Look up aggregation tests by unique name.
 *
 * This is a helper for external libraries; it provides an immutable registry of all available tests.
 *
 * {key: {label: String, constructor: Object }
 * @type {{String: {label: String, constructor: function}}}
 */
const AGGREGATION_TESTS = Object.freeze(_all_tests.reduce(function(acc, constructor) {
  const inst = new constructor();  // Hack- need instance to access attributes
  acc[inst.key] = { label: inst.label, constructor: constructor };
  return acc;
}, {}));


/**
 * A container that stores aggregation tests and provides useful lookup methods on them.
 */
class AggregationTestContainer {
  /**
   * @constructor
   * @param {AggregationTest[]} tests An array of aggregation test instances
   * @param {Object} full_scorecov Parsed portal JSON object
   */
  constructor(tests, full_scorecov) {
    // TODO: Remove the lookup functionality of find a use
    this.tests = {};
    this.testKeyToLabel = {};

    this._full_scorecov = full_scorecov;

    for (let t of Object.values(tests)) {
      this.tests[t.key] = t;
      this.testKeyToLabel[t.key] = t.label;
    }
  }


  /**
   * Retrieve a test object given the test key. A test 'key' is a short identifier
   * that uniquely identifies which test was performed.
   * @param key {string} String key for the aggregation test.
   * @return {AggregationTest} An AggregationTest object.
   */
  getTest(key) {
    return this.tests[key];
  }

  /**
   * Run all tests and combine the results into a JSON-serializable payload
   * @return {Object} Rows of results, one per mask * group.
   */
  run() {
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

    results.data.masks = Object.values(this._full_scorecov.masks);
    for (let aggTest of Object.values(this.tests)) {
      const res = aggTest.run();

      res.forEach(one_result => {
        ['singleVariantResults', 'groupResults'].forEach(bucket => {
          // Merge the nested structure together
          Object.keys(results.data[bucket]).forEach(arr => {
            results.data[bucket][arr].push(...one_result[bucket][arr]);
          });
        });
      });
    }
    return results;
  }
}

/**
 * Make a test runner based on configuration. This is a helper method for using raremetal.js without worrying about
 *   internal data structures or class names.
 *
 *  In particular it can be used as a way to limit what masks are used for a given test.
 *
 * @public
 * @param {String[]|Object[]} options An array specifying the tests to run. If a string is specified, it will run the
 *  specified test name on all available masks. Alternately, this helper method can be told to run the tests only on a
 *    limited set of masks, using object with keys {name: String, mask: String, group: String}. `mask`, `group`, or
 *    both can be omitted to skip filtering on that field.
 * @param {Object} full_scorecov The full scorecov data in the format returned by `parsePortalJson`
 */
function makeTests(options, full_scorecov) {
  const tests = options.map(spec => {
    let inst_name;
    let scorecov;

    if (spec instanceof AggregationTest) {
      return spec;
    } else if (typeof spec === "string") {
      // Then run the specified test on all possible masks and groups
      inst_name = spec;
      scorecov = Object.values(full_scorecov.scorecov);
    } else if (typeof spec === "object") {
      // This mechanism allows running tests against a limited set of masks/groups. If a filter option is not specified,
      //   that field is not used as a filter.
      inst_name = spec.name;
      scorecov = Object.values(full_scorecov.scorecov)
        .filter(item => ((spec.mask || item.mask) === item.mask) && ((spec.group || item.group) === item.group));
    } else {
      throw new Error("Not implemented");
    }
    let inst_class = AGGREGATION_TESTS[inst_name];
    if (!inst_class) {
      throw new Error(`Cannot make unknown test type: ${spec}`);
    }
    return new inst_class.constructor(scorecov);
  });
  return new AggregationTestContainer(tests, full_scorecov);
}

/**
 * Parse the idealized portal response JSON for requesting covariance matrices.
 * A spec of this format can be found in src/docs/portal-api.md.
 * @public
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
    let parsedVariants = variants.map(x => x.match(REGEX_EPACTS));
    let positions = parsedVariants.map(x => parseInt(x[2]));
    let altAlleles = parsedVariants.map(x => x[4]);
    let refAlleles = parsedVariants.map(x => x[3]);

    // Scores
    let scoreTable = new ScoreStatTable();
    scoreTable.sampleSize = scoreBlock.nsamples;
    for (let i = 0; i < scoreBlock.scores.length; i++) {
      // Diagonal element of linearized (lower triangular) covariance matrix
      let n = i + 1;
      let variance = scoreBlock.covariance[n * (n + 1) / 2 - 1];
      let altFreq = scoreBlock.altFreq[i];
      let eaFreq = altFreq;
      let ea = altAlleles[i];
      let pvalue = scoreBlock.pvalue[i];
      let score = scoreBlock.scores[i];

      if (altFreq > 0.5) {
        score = -score;
        ea = refAlleles[i];
        eaFreq = 1 - altFreq;
      }

      scoreTable.appendScore(
        variants[i],
        positions[i],
        score,
        variance,
        altFreq,
        ea,
        eaFreq,
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

  // Run all tests/masks
  const container = makeTests(["zegginiBurden", "skat"], scoreCov);
  return container.run();
}

export { parsePortalJson, makeTests, AGGREGATION_TESTS, _example };
