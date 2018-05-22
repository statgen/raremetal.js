/**
 * Calculate group-based tests from score statistics.
 *
 * @module stats
 * @license MIT
 */

import * as qfc from './qfc.js';
import numeric from 'numeric';
import { pchisq, dbeta, pnorm } from './rstats.js';

class AggregationTest {
  constructor() {
    this.label = '';
    this.key = '';
    this.requiresMaf = false;
  }
}

class ZegginiBurdenTest extends AggregationTest {
  constructor() {
    super();
    this.key = 'zegginiBurden';
    this.label = 'Zeggini Collapsing Burden Test';
  }

  /**
   * Default weight function for burden test. All variants weighted equally. Only requires the number of variants
   * since they are all given the same weight value.
   * @param n {number} Number of variants.
   * @return {number[]} An array of weights, one per variant.
   */
  static weights(n) {
    return new Array(n).fill(1 / n);
  }

  /**
   * Calculate burden test from vector of score statistics and variances.
   * See {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#BURDEN_META_ANALYSIS|our wiki page} for more information.
   *
   * @param {Number[]} u Vector of score statistics (length m, number of variants)
   * @param {Number[]} v Covariance matrix of score statistics
   * @param {Number[]} w Weight vector (length m, number of variants)
   * @return {Number[]} Burden test statistic z and p-value
   */
  test(u, v, w) {
    for (let e of [u, v]) {
      if (!Array.isArray(e) || !e.length) {
        throw 'Please provide all required arrays';
      }
    }

    if (!(u.length === v.length)) {
      throw 'u and v must be same length';
    }

    if (w != null) {
      if (w.length !== u.length) {
        throw 'w vector must be same length as score vector u';
      }
    }
    else {
      w = ZegginiBurdenTest.weights(u.length);
    }

    // This is taken from:
    // https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#BURDEN_META_ANALYSIS
    let over = numeric.dot(w, u);
    let under = Math.sqrt(numeric.dot(numeric.dot(w, v), w));
    let z = over / under;

    // The -Math.abs(z) is because pnorm returns the lower tail probability from the normal dist
    // The * 2 is for a two-sided p-value.
    let p = pnorm(-Math.abs(z), 0, 1) * 2;
    return [z, p];
  }
}

class SkatTest extends AggregationTest {
  constructor() {
    super();
    this.label = 'SKAT Test';
    this.key = 'skat';
    this.requiresMaf = true;
  }

  /**
   * Calculate typical SKAT weights using beta density function.
   *
   * @function
   * @param mafs {number[]} Array of minor allele frequencies.
   * @param a {number} alpha defaults to 1.
   * @param b {number} beta defaults to 25.
   */
  static weights(mafs, a = 1, b = 25) {
    let weights = Array(mafs.length).fill(NaN);
    for (let i = 0; i < mafs.length; i++) {
      let w = dbeta(mafs[i], a, b, false);
      w *= w;
      weights[i] = w;
    }
    return weights;
  }

  /**
   * Calculate SKAT test. <p>
   *
   * The distribution function of the SKAT test statistic is evaluated using Davies' method by default.
   * In the special case where there is only 1 lambda, the Liu moment matching approximation method is used. <p>
   *
   * @function
   * @param {Number[]} u Vector of score statistics (length m, number of variants).
   * @param {Number[]} v Covariance matrix of score statistics (m x m).
   * @param {Number[]} w Weight vector (length m, number of variants). If weights are not provided, they will
   *  be calculated using the default weights() method of this object.
   * @param {Number[]} mafs A vector of minor allele frequencies. These will be used to calculate weights if
   *  they were not provided.
   * @return {Number[]} SKAT p-value.
   */
  test(u, v, w, mafs) {
    // Calculate weights (if necessary)
    if (w === undefined || w === null) {
      w = SkatTest.weights(mafs);
    }

    // Calculate Q
    let q = numeric.dot(numeric.dot(u,numeric.diag(w)),u);

    // Calculate lambdas
    let lambdas;
    try {
      let svd = numeric.svd(v);
      let sqrtS = numeric.sqrt(svd.S);
      let uT = numeric.transpose(svd.U);
      let eigenRhs = numeric.dot(numeric.dot(svd.U, numeric.diag(sqrtS)), uT);
      let eigenLhs = numeric.dot(eigenRhs, numeric.diag(w));
      let eigen = numeric.dot(eigenLhs, eigenRhs);
      let finalSvd = numeric.svd(eigen);
      lambdas = numeric.abs(finalSvd.S);
    } catch(error) {
      console.log(error);
      return [NaN, NaN];
    }

    if (numeric.sum(lambdas) < 0.0000000001) {
      console.error("Sum of lambda values for SKAT test is essentially zero");
      return [NaN, NaN];
    }

    // P-value method
    if (lambdas.length === 1) {
      // Davies method does not support 1 lambda
      // This is what raremetal does
      return _skatLiu(lambdas, q);
    }
    else {
      return _skatDavies(lambdas, q);
    }
  }
}

/**
 * Calculate SKAT p-value using Davies method.
 * @function
 * @param lambdas Eigenvalues of sqrtV * W * sqrtV.
 * @param qstat SKAT test statistic U.T * W * U.
 * @return {Number[]} Array of [Q statistic, p-value].
 * @private
 */
function _skatDavies(lambdas, qstat) {
  /**
   * lambdas - coefficient of jth chi-squared variable
   * nc1 - non-centrality parameters
   * n1 - degrees of freedom
   * n - number of chi-squared variables
   * sigma - coefficient of standard normal variable
   * qstat - point at which cdf is to be evaluated (this is SKAT Q stat usually)
   * lim1 - max number of terms in integration
   * acc - maximum error
   * trace - array into which the following is stored:
   *   trace[0]	absolute sum
   *   trace[1]	total number of integration terms
   *   trace[2]	number of integrations
   *   trace[3]	integration interval in final integration
   *   trace[4]	truncation point in initial integration
   *   trace[5]	s.d. of initial convergence factor
   *   trace[6]	cycles to locate integration parameters
   * ifault - array into which the following fault codes are stored:
   *   0 normal operation
   *   1 required accuracy not achieved
   *   2 round-off error possibly significant
   *   3 invalid parameters
   *   4 unable to locate integration parameters
   *   5 out of memory
   * res - store final value into this variable
   */
  let n = lambdas.length;
  let nc1 = Array(n).fill(0);
  let n1 = Array(n).fill(1);
  let sigma = 0.0;
  let lim1 = 10000;
  let acc = 0.0001;
  let res = qfc.qf(lambdas, nc1, n1, n, sigma, qstat, lim1, acc);
  let qfval = res[0];

  let pval = 1.0 - qfval;

  if (pval <= 0 || pval === 2.0) {
    // Routine adapted from raremetal
    let iter = 0;
    while ((iter < 10000) && (pval <= 0 || pval === 2.0)) {
      qstat *= 0.9999;
      res = qfc.qf(lambdas, nc1, n1, n, sigma, qstat, lim1, acc);
      qfval = res[0];
      pval = 1 - qfval;
      iter += 1;
    }
  }

  return [qstat, pval];
}

/**
 * Calculate SKAT p-value using Liu method.
 * @param lambdas Eigenvalues of sqrtV * W * sqrtV.
 * @param qstat SKAT test statistic U.T * W * U.
 * @return {Number[]} [qstat, pvalue]
 * @private
 */
function _skatLiu(lambdas, qstat) {
  let n = lambdas.length;
  let [c1, c2, c3, c4] = Array(4).fill(0.0);
  for (let i = 0; i < n; i++) {
    let ilambda = lambdas[i];
    c1 += ilambda;
    c2 += ilambda * ilambda;
    c3 += ilambda * ilambda * ilambda;
    c4 += ilambda * ilambda * ilambda * ilambda;
  }

  let s1 = c3 / Math.sqrt(c2 * c2 * c2);
  let s2 = c4 / (c2 * c2);
  let muQ = c1;
  let sigmaQ = Math.sqrt(2.0 * c2);
  let tStar = (qstat - muQ) / sigmaQ;

  let delta, l, a;
  if (s1 * s1 > s2) {
    a = 1.0 / (s1 - Math.sqrt(s1 * s1 - s2));
    delta = s1 * a * a * a - a * a;
    l = a * a - 2.0 * delta;
  } else {
    a = 1.0 / s1;
    delta = 0.0;
    l = c2 * c2 * c2 / (c3 * c3);
  }

  let muX = l + delta;
  let sigmaX = Math.sqrt(2.0) * a;
  let qNew = tStar * sigmaX + muX;
  let p;

  if (delta === 0) {
    p = pchisq(qNew,l,0,0);
  } else {
    // Non-central chi-squared
    p = pchisq(qNew,l,delta,0,0);
  }

  return [qstat, p];
}

/**
 * A container that stores aggregation tests and provides useful lookup methods on them.
 */
class AggregationTestContainer {
  /**
   * @constructor
   */
  constructor() {
    this.tests = {};
    this.testKeyToLabel = {};

    for (let t of Object.values(arguments)) {
      this.tests[t.key] = t;
      this.testKeyToLabel[t.key] = t.label;
    }
  }

  /**
   * Given an aggregation test key, return a suitable label for it.
   * For example, 'zegginiBurden' -> 'Zeggini collapsing burden test'.
   *
   * @param key {string} String key for the aggregation test.
   * @return {string} Long description label of the test.
   */
  getTestLabelFromKey(key) {
    return this.testKeyToLabel[key];
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
   * Iterate over all available tests in the container.
   */
  *[Symbol.iterator]() {
    for (let v of Object.values(this.tests)) {
      yield v;
    }
  }
}

function arraysEqual(a1,a2) {
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Class for storing a variant mask, which is a mapping from groups to lists of variants.
 * For example, "TCF7L2" -> ["variant1","variant2",...].
 * @class
 * @public
 */
class VariantMask {
  /**
   * @constructor
   */
  constructor() {
    this.groups = new Map();
    this.label = null;
    this.id = null;
  }

  /**
   * Add a variant to a group.
   * @function
   * @param group Group, for example a gene "TCF7L2"
   * @param variant Variant ID, usually "1:1_A/T"
   * @public
   */
  addVariantForGroup(group,variant) {
    if (this.groups.has(group)) {
      this.groups.get(group).push(variant);
    }
    else {
      let ar = [variant];
      this.groups.set(group,ar);
    }
  }

  /**
   * Create a group from a list of variants
   * @function
   * @param group {string} Group name. Usually a gene, for example "TCF7L2" or "ENSG000534311".
   * @param variants {string[]} Array of variants belonging to the group.
   *  These should be in EPACTS format, e.g. chr:pos_ref/alt.
   * @public
   */
  createGroup(group,variants) {
    this.groups.set(group,variants);
  }

  /**
   * Get the number of groups
   * @return {number} Number of groups.
   */
  size() { return this.groups.size }

  /**
   * Iterate over groups with syntax:
   * <pre>for (let [group, variants] in mask) { ... }</pre>
   * @return Iterator over entries, yields [group, array of variants]
   */
  [Symbol.iterator]() { return this.groups.entries() }

  /**
   * Retrieve a specific group's variants.
   * @param group {string} Group to retrieve.
   * @return {string[]} List of variants belonging to the group.
   */
  getGroup(group) {
    return this.groups.get(group);
  }
}

/**
 * Class for storing score statistics. <p>
 *
 * Assumptions:
 * <ul>
 *   <li> This class assumes you are only storing statistics on a per-chromosome basis, and not genome wide.
 *   <li> Score statistic direction is towards the minor allele.
 * </ul>
 */
class ScoreStatTable {
  /**
   * @constructor
   */
  constructor() {
    this.variants = [];
    this.positions = [];
    this.variantMap = new Map();
    this.positionMap = new Map();
    this.u = [];
    this.v = [];
    this.sampleSize = 0;
    this.altFreq = [];
    this.effectAllele = [];
    this.effectAlleleFreq = [];
  }

  appendScore(variant, position, u, v, altFreq, ea, eaFreq) {
    this.variants.push(variant);
    this.positions.push(position);

    this.variantMap.set(variant,this.variants.length-1);
    this.positionMap.set(position,this.positions.length-1);

    this.u.push(u);
    this.v.push(v);
    this.altFreq.push(altFreq);
    this.effectAllele.push(ea);
    this.effectAlleleFreq.push(eaFreq);
  }

  /**
   * Return the alternate allele frequency for a variant
   * @param variant
   * @return {number} Alt allele frequency
   */
  getAltFreqForVariant(variant) {
    let freq = this.altFreq[this.variantMap.get(variant)];
    if (freq == null) {
      throw new Error("Variant did not exist when looking up alt allele freq: " + variant);
    }

    return freq;
  }

  /**
   * Return the alternate allele frequency for a variant
   * @param position Variant position
   * @return {number} Alt allele frequency
   */
  getAltFreqForPosition(position) {
    let freq = this.altFreq[this.positionMap.get(position)];
    if (freq == null) {
      throw new Error("Position did not exist when looking up alt allele freq: " + position);
    }

    return freq;
  }

  /**
   * Retrieve the variant at a given position.
   * @param position Variant position
   */
  getVariantAtPosition(position) {
    let variant = this.variants(this.positionMap.get(position));
    if (variant == null) {
      throw new Error("Variant did not exist at position: " + position);
    }

    return variant;
  }

  /**
   * Combine this set of score statistics with another. See also {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#SINGLE_VARIANT_META_ANALYSIS}
   * for information on how statistics are combined.
   *
   * @param other {ScoreStatTable} Another set of score statistics with which to combine this object for the purposes
   *  of meta-analysis.
   * @return {*} No object is returned; this method runs in-place.
   */
  add(other) {
    // First confirm both matrices are the same shape
    let dimThis = this.dim();
    let dimOther = other.dim();
    if (!arraysEqual(dimThis,dimOther)) {
      throw "Scores cannot be added, dimensions are unequal";
    }

    // To combine the score stats, we only need to add each element
    // Same with sample sizes
    // Frequencies need to be added taking into account the differing sample sizes
    for (let i = 0; i < dimThis[0]; i++) {
      this.u[i] = this.u[i] + other.u[i];
      this.v[i] = this.v[i] + other.v[i];

      let sampleSizeThis = this.sampleSize[i];
      let sampleSizeOther = other.sampleSize[i];
      let sampleSizeTotal = sampleSizeThis + sampleSizeOther;

      this.sampleSize[i] = sampleSizeTotal;
      this.altFreq[i] = ((this.altFreq[i] * sampleSizeThis) + (other.altFreq[i] * sampleSizeOther)) / sampleSizeTotal;
    }
  }

  dim() {
    return this.u.length;
  }

  /**
   * Subset the score stats down to a subset of variants, in this exact ordering
   * @param variantList List of variants
   * @return {ScoreStatTable} Score statistics after subsetting (not in-place, returns a new copy)
   */
  subsetToVariants(variantList) {
    if (typeof variantList === "undefined") {
      throw new Error("Must specify list of variants when subsetting");
    }

    // First figure out which variants supplied are actually in this set of score stats
    variantList = variantList.filter(x => this.variantMap.has(x));

    // Subset each member to only those variants
    let idx = variantList.map(x => this.variantMap.get(x));
    let variants = idx.map(i => this.variants[i]);
    let positions = idx.map(i => this.positions[i]);
    let u = idx.map(i => this.u[i]);
    let v = idx.map(i => this.v[i]);
    let altFreq = idx.map(i => this.altFreq[i]);

    let variantMap = new Map(variants.map((element,index) => [element,index]));
    let positionMap = new Map(variants.map((element,index) => [element,index]));

    // Assemble new score table object
    let newTable = new ScoreStatTable();
    newTable.variants = variants;
    newTable.positions = positions;
    newTable.variantMap = variantMap;
    newTable.positionMap = positionMap;
    newTable.u = u;
    newTable.v = v;
    newTable.altFreq = altFreq;

    return newTable;
  }
}

/**
 * Class for storing genotype covariance matrices. <br/><br/>
 *
 * Assumptions:
 * <ul>
 *  <li> Covariances should be oriented towards the minor allele.
 *  <li> Variances on the diagonal are absolute values (they are not directional.)
 * </ul>
 *
 * @class
 */
class GenotypeCovarianceMatrix {
  /**
   * @constructor
   * @param matrix {number[][]} Pre-constructed matrix. Usually generated by the
   *  [extractCovariance]{@link module:fio~extractCovariance} function in fio.
   * @param variants {Map} Map of variants -> matrix position. Variants should be chr:pos_ref/alt format.
   * @param positions {Map} Map of variant position -> matrix position. Both positions should be integers.
   */
  constructor(matrix, variants, positions) {
    this.matrix = matrix;
    this.variants = variants;
    this.positions = positions;
  }

  /**
   * Determine whether matrix is complete.
   * Can specify i, j which are actual indices, or positions pos_i, pos_j which represent the positions of the variants.
   * @function
   * @public
   */
  isComplete(i, j, pos_i, pos_j) {
    if (typeof pos_i !== 'undefined') {
      i = this.positions.get(pos_i);
    }
    if (typeof pos_j !== 'undefined') {
      j = this.positions.get(pos_j);
    }

    let v;
    for (let m = 0; m < i; m++) {
      for (let n = 0; n < j; n++) {
        v = this.matrix[m][n];
        if (v == null || isNaN(v)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Return dimensions of matrix
   * @function
   * @public
   */
  dim() {
    let nrows = this.matrix.length;
    let ncols = this.matrix[0].length;
    return [nrows, ncols];
  }

  /**
   * Combine this covariance matrix with another.
   * This operation happens in place; this matrix will be overwritten with the new one.
   * Used in meta-analysis, see {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#SINGLE_VARIANT_META_ANALYSIS|our wiki}
   * for more information.
   * @function
   * @param other {GenotypeCovarianceMatrix} Another covariance matrix
   * @public
   */
  add(other) {
    // First confirm both matrices are the same shape
    let dimThis = this.dim();
    let dimOther = other.dim();
    if (!arraysEqual(dimThis,dimOther)) {
      throw "Covariance matrices cannot be added, dimensions are unequal";
    }

    // To combine the covariance matrices, we only need to add each element
    for (let i = 0; i < dimThis[0]; i++) {
      for (let j = 0; j < dimThis[1]; j++) {
        this.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
      }
    }
  }

  /**
   * Subset the covariance matrix down to a subset of variants, in this exact ordering
   * @todo Implement
   * @param variants List of variants
   * @return New GenotypeCovarianceMatrix after subsetting (not in-place)
   */
  // subsetToVariants(variants) {
  //
  // }
}

/**
 * Export an object containing all possible aggregation tests.
 * @type {AggregationTestContainer}
 */
const AGGREGATION_TESTS = new AggregationTestContainer(
  new ZegginiBurdenTest(),
  new SkatTest()
);

export { ScoreStatTable, GenotypeCovarianceMatrix, VariantMask, AggregationTest, ZegginiBurdenTest, SkatTest, AGGREGATION_TESTS };
