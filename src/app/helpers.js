/**
 * Helper methods for running aggregation tests
 *
 * This wraps internal functionality and provides utilities for reading and writing expected API formats
 */
import numeric from "numeric";
import { REGEX_EPACTS } from "./constants";
import { _AggregationTest, SkatTest, ZegginiBurdenTest, VTTest } from "./stats";

const _all_tests = [ZegginiBurdenTest, SkatTest, VTTest];

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
const AGGREGATION_TESTS = Object.freeze(_all_tests.reduce(function (acc, constructor) {
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
      let [_, chrom, pos, ref, alt, __] = variant.match(REGEX_EPACTS);  // eslint-disable-line no-unused-vars

      let effectFreq = altFreq;
      let effect = alt;

      /**
       * The variant's score statistic in the API is coded toward the alternate allele.
       * However, we want the effect coded towards the minor allele, since most rare variant tests assume
       * you are counting the rare/minor allele.
       */
      if (altFreq > 0.5) {
        /**
         * The effect allele is initially the alt allele. Since we're flipping it,
         * the "other" allele is the reference allele.
         */
        score = -score;
        effect = ref;

        // This is also now the minor allele frequency.
        effectFreq = 1 - altFreq;
      }

      lookup[variant] = {
        variant,
        chrom,
        pos,
        pvalue,
        score,
        altAllele: alt,
        effectAllele: effect,
        altFreq: altFreq,
        effectFreq: effectFreq
      };
    });
    return lookup;
  }

  isAltEffect(variant_names) {  // Some calculations are sensitive to whether alt is the minor (effect) allele
    return variant_names.map(name => {
      const variant_data = this._variant_lookup[name];
      return variant_data.altAllele === variant_data.effectAllele;
    });
  }

  getEffectFreq(variant_names) {
    // Get the allele freq for the minor (effect) allele
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

  makeCovarianceMatrix(group, is_alt_effect) {
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
        let iAlt = is_alt_effect[i];
        let jAlt = is_alt_effect[j];

        /**
         * The API spec codes variant genotypes towards the alt allele. If the alt allele frequency
         * is > 0.5, that means we're not counting towards the minor (rare) allele, and we need to flip it around.
         * We don't flip when i == j because that element represents the variance of the variant's score, which is
         * invariant to which allele we code towards (but covariance is not.)
         *
         * We also don't flip when both the i variant and j variant need to be flipped (the ^ is XOR) because it would
         * just cancel out.
         */
        if (i !== j) {
          if ((!iAlt) ^ (!jAlt)) {
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
class PortalTestRunner {
  constructor(groups, variants, test_names = []) {
    this.groups = groups;
    this.variants = variants;
    this._tests = [];

    test_names.forEach(name => this.addTest(name));
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
    // Helper method that translates portal data into the format expected by a test.
    const variants = group.variants;
    const scores = this.variants.getScores(variants);

    // Most calculations will require adjusting API data to ensure that minor allele is the effect allele
    const isAltEffect = this.variants.isAltEffect(variants);

    const cov = this.groups.makeCovarianceMatrix(group, isAltEffect);
    const mafs = this.variants.getEffectFreq(variants);
    let weights;  // TODO: The runner never actually uses the weights argument. Should it allow this?

    const [stat, pvalue] = test.run(scores, cov, weights, mafs);

    // The results describe the group + several new fields for calculation results.
    return {
      groupType: group.groupType,
      group: group.group,
      mask: group.mask,
      variants: group.variants,

      test: test.key,
      stat,
      pvalue
    };
  }

  toJSON(results) {
    // Output calculation results in a format that matches the "precomputed results" endpoint
    // By passing in an argument, user can format any set of results (even combining multiple runs)
    if (!results) {
      results = this.run();
    }

    return {
      data: {
        variants: this.variants.data,
        groups: results,
      }
    };
  }
}


function parsePortalJSON(json) {
  const data = json.data || json;
  const groups = new PortalGroupHelper(data.groups.map(item => {
    // Each group should have access to fields that, in portal json, are defined once globally
    item.nSamples = data.nSamples;
    item.sigmaSquared = data.sigmaSquared;
    return item;
  }));
  const variants = new PortalVariantsHelper(data.variants);
  return [groups, variants];
}

export { PortalVariantsHelper as _PortalVariantsHelper, PortalGroupHelper as _PortalGroupHelper }; // testing only

export { parsePortalJSON, PortalTestRunner };
