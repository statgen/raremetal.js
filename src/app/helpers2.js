/**
 * Helper methods for running aggregation tests
 *
 * This wraps internal functionality and provides utilities for reading and writing expected API formats
 */
import numeric from "numeric";
import { REGEX_EPACTS } from "./constants";
import { _AggregationTest, SkatTest, ZegginiBurdenTest } from "./stats2";

const _all_tests = [ZegginiBurdenTest, SkatTest];

/**
 * Look up aggregation tests by unique name.
 *
 * This is a helper for external libraries; it provides an immutable registry of all available tests.
 * TODO would be nice to get rid of this?
 *
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
 * Helper object for reading and interpreting variant data
 */
class PortalVariantsHelper {
  constructor(variants_array) {
    this._variants = variants_array;
    this._variant_lookup = this.parsePortalVariantData(variants_array);
  }

  get data() {  // Raw unparsed data
    return this._variants;
  }

  parsePortalVariantData(variants) {
    // Read an array of variants. Parse names into position/ref/alt, and assign altFreq to MAF.
    // Return a hash keyed on variant ID for quick lookups.
    let lookup = {};
    variants.forEach(data => {
      let { variant, altFreq, pvalue, score } = data;
      let [_, chrom, pos, ref, effect, __] = variant.match(REGEX_EPACTS);  // eslint-disable-line no-unused-vars

      let effectFreq;

      // All calculations assume that scores and covar terms
      if (altFreq > 0.5) {  // TODO: verify assumption that scores belong to variants, not groups
        score = -score;
        effect = ref;
        effectFreq = 1 - altFreq;
      }

      lookup[variant] = {
        variant,
        chrom,
        pos,
        pvalue,
        score,
        effectAllele: effect,
        altFreq: altFreq,
        effectFreq: effectFreq
      };
    });
    return lookup;
  }

  getAltFreq(variant_names) {
    // Get the raw "alt frequency" reported by the API for the specified variants. This may or may not refer to the
    //  effect allele. This raw data is useful when deciding how to interpret, eg, covariance terms.
    return variant_names.map(name => this._variant_lookup[name].effectFreq);
  }

  getEffectFreq(variant_names) {
    // Get the allele
    return variant_names.map(name => this._variant_lookup[name].effectFreq);
  }

  getScores(variant_names) {
    // Get single-variant scores
    return variant_names.map(name => this._variant_lookup[name].score);
  }

  getGroupVariants(variant_names) {
    // Return all that is known about a given set of variants
    return variant_names.map(name => this._variant_lookup[name]);
  }
}

// Utility class. Provides helper methods to access information about groups and generate subsets
class PortalGroupHelper {
  constructor(groups) {
    this._groups = groups;
    this._lookup = this._generateLookup(groups);
  }

  get data() {  // Raw unparsed data
    return this._groups;
  }

  byMask(selection) {  // str or array
    // Get all groups that identify as a specific category of mask- "limit the analysis to loss of function variants
    // in any gene"
    if (!Array.isArray(selection)) {
      selection = [selection]
    }
    selection = new Set(selection);

    const subset = this._groups.filter(group => selection.has(group.mask));
    return new this.constructor(subset);
  }

  byGroup(selection) {  // str or array
    // Get all groups based on a specific group name, regardless of mask. Eg, "all the ways to analyze data for a
    // given gene".
    if (!Array.isArray(selection)) {
      selection = [selection]
    }
    selection = new Set(selection);

    const subset = this._groups.filter(group => selection.has(group.group));
    return new this.constructor(subset);
  }

  _generateLookup(groups) {
    // We don't transform data, so this is a simple name -> position mapping
    return groups.reduce((acc, item, idx) => {
      const key = this._getKey(item.mask, item.group);
      acc[key] = idx;
      return acc;
    }, {});
  }

  _getKey(mask_name, group_name) {
    return `${mask_name},${group_name}`;
  }

  getOne(mask_name, group_name) {
    // Get a single group that is fully and uniquely identified by group + mask
    const key = this._getKey(mask_name, group_name);
    const pos = this._lookup[key];
    return this._groups[pos];
  }

  makeCovarianceMatrix(group, alt_freqs) {
    // Helper method that expands the portal covariance format into a full matrix.
    // Load the covariance matrix from the response JSON
    const n_variants = group.variants.length;
    let covmat = new Array(n_variants);
    for (let i = 0; i < n_variants; i++) {
      covmat[i] = new Array(n_variants).fill(null);
    }

    let c = 0;
    for (let i = 0; i < n_variants; i++) {
      for (let j = i; j < n_variants; j++) {
        let v = group.covariance[c];
        let iAltFreq = alt_freqs[i];
        let jAltFreq = alt_freqs[j];

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

    covmat = numeric.mul(group.nSamples, covmat);
    return covmat;
  }
}

// Helper method that coordinates multiple tests on a series of masks
class TestRunner {
  constructor(groups, variants, test_names=[]) {
    this.groups = groups;
    this.variants = variants;
    this._tests = [];

    test_names.forEach(name => this.addTest(name));

    this._results = [];
  }

  addTest(test) {
    // Add a new test by name, or directly from an instance
    // TODO Find a way to do this without using the registry
    if (typeof test === 'string') {
      let type = AGGREGATION_TESTS[test];
      if (!type) {
        throw new Error(`Cannot make unknown test type: ${test}`);
      }
      test = new type.constructor();
    } else if (!(test instanceof _AggregationTest)) {
      throw new Error('Must specify test as name or instance');
    }


    this._tests.push(test);
    return test;
  }

  run() {
    // Run every test on every group in the container and return results
    let results = [];

    this._tests.forEach(test => {
      this.groups.data.forEach(group => {
        results.push(this._runOne(test, group));
      });
    });

    return results;
  }

  _runOne(test, group) {
    // Helper method that translates portal data into the format expected by a test
    const variants = group.variants;
    const scores = this.variants.getScores(variants);
    const altFreqs = this.variants.getAltFreq(variants);
    const cov = this.groups.makeCovarianceMatrix(group, altFreqs);
    const mafs = this.variants.getEffectFreq(variants);
    // TODO: Tests have an extra argument weights that never seems to be used.... consider revising method signature
    let weights;

    const [ stat, pvalue ] = test.run(scores, cov, weights, mafs);
    return {
      'group': group.group,
      'mask': group.mask,
      'test': test.key,
      stat,
      pvalue
    };
  }

  toJSON() { // Output calculation results in a format that matches the "precomputed results" endpoint
    if (!this._results.length) {
      this._results = this.run();
    }
    return {
      data: {
        variants: this.variants.data,
        groups: this.groups.data,
        results: this._results
      }
    };
  }
}


function parsePortalJSON(json) {
  const data = json.data || json;
  const groups = new PortalGroupHelper(data.groups);
  const variants = new PortalVariantsHelper(data.variants);
  return [groups, variants];
}

export { PortalVariantsHelper as _PortalVariantsHelper , PortalGroupHelper as _PortalGroupHelper }; // testing only

export { parsePortalJSON, TestRunner };
