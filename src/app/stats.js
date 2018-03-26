/**
 * Calculate group-based tests from score statistics
 * @module stats
 * @license MIT
 */

const num = require("numeric");
const jStat = require("jStat");

function arraysEqual(a1,a2) {
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Class for storing a variant mask, which is a mapping from groups to lists of variants
 * For example, "TCF7L2" -> ["variant1","variant2",...]
 */
class VariantMask {
  constructor() {
    this.groups = new Map();
  }

  /**
   * Add a variant to a group
   * @param group Group, for example a gene "TCF7L2"
   * @param variant Variant ID, usually "1:1_A/T"
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
   * @param group
   * @param variants
   */
  createGroup(group,variants) {
    this.groups.set(group,variants);
  }

  /**
   * Get the number of groups
   * @return {*}
   */
  size() { return this.groups.size() }

  /**
   * Iterate over groups with syntax:
   * for (let [group, variants] in mask) { ... }
   * @return {IterableIterator<[K , V]>}
   */
  [Symbol.iterator]() { return this.groups.entries() }

  /**
   * Retrieve a specific group's variants.
   * @param group
   * @return list of variants
   */
  getGroup(group) {
    return this.groups.get(group);
  }
}

/**
 * Class for storing score statistics
 *
 * Assumptions:
 *   * This class assumes you are only storing statistics on a per-chromosome basis, and not genome wide.
 *   * Score statistic direction is towards the minor allele
 */
class ScoreStatTable {
  constructor() {
    this.variants = [];
    this.positions = [];
    this.variantMap = new Map();
    this.positionMap = new Map();
    this.u = [];
    this.v = [];
    this.altFreq = [];
    this.sampleSize = 0;
  }

  appendScore(variant, position, u, v, altFreq) {
    this.variants.push(variant);
    this.positions.push(position);

    this.variantMap.set(variant,this.variants.length-1);
    this.positionMap.set(position,this.positions.length-1);

    this.u.push(u);
    this.v.push(v);
    this.altFreq.push(altFreq);
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
   * Combine this set of score statistics with another
   * https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#SINGLE_VARIANT_META_ANALYSIS
   * @param other
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
   * @todo Implement
   * @param variants List of variants
   * @return New ScoreStatTable after subsetting (not in-place)
   */
  subsetToVariants(variants) {

  }
}

class GenotypeCovarianceMatrix {
  constructor(matrix, variants, positions) {
    this.matrix = matrix;
    this.variants = variants;
    this.positions = positions;
  }

  /**
   * Determine whether matrix is complete
   * Can specify i, j which are actual indices
   * Or positions pos_i, pos_j which represent the positions of the variants
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
   */
  dim() {
    let nrows = this.matrix.length;
    let ncols = this.matrix[0].length;
    return [nrows, ncols];
  }

  /**
   * Combine this covariance matrix with another
   * This operation happens in place; this matrix will be overwritten with the new one
   * https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#SINGLE_VARIANT_META_ANALYSIS
   * @param other Another covariance matrix
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
  subsetToVariants(variants) {

  }
}

/**
 * Calculate burden test from vector of score statistics and variances
 *
 * @param {Number[]} u Vector of score statistics (length m, number of variants)
 * @param {Number[]} v Covariance matrix of score statistics
 * @param {Number[]} w Weight vector (length m, number of variants)
 * @return {Number[]} Burden test statistic z and p-value
 */
function testBurden(u, v, w) {
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
    w = new Array(u.length).fill(1 / u.length);
  }

  // This is taken from:
  // https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#BURDEN_META_ANALYSIS
  let over = num.dot(w, u);
  let under = Math.sqrt(num.dot(num.dot(w, v), w));
  let z = over / under;

  // The -Math.abs(z) is because jStat.normal.cdf returns the lower tail probability from the normal dist
  // The * 2 is for a two-sided p-value.
  let p = jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
  return [z, p];
}

/**
 * Calculate SKAT test
 *
 * @param {Number[]} u Vector of score statistics (length m, number of variants)
 * @param {Number[]} v Covariance matrix of score statistics (m x m)
 * @param {Number[]} w Weight vector (length m, number of variants)
 * @param {String} method Can be "satterthwaite", or "davies"
 *   The Satterthwaite approximation is fastSKAT
 *   Davies is the method used in the original Wu et al. SKAT paper
 * @return {Number} SKAT p-value
 */
function testSkat(u, v, w, method = "satterthwaite") {
  if (method === "satterthwaite") {
    return _skatSatterthwaite(u, v, w);
  } else if (method === "davies") {
    // Requires porting qfc.cpp to JS or compiling to asm.js...
    throw 'Not implemented';
  } else {
    throw 'Not implemented';
  }
}

/**
 * Apparently the Satterthwaite approximation (requires verification, not ready for use)
 * @todo what is q and why is it not used here?
 * @param u
 * @param v
 * @param w
 * @return {number}
 * @private
 */
function _skatSatterthwaite(u, v, w) {
  let m = u.length;
  let q = num.dot(num.dot(num.transpose(u), w), u);
  let vsqrt = num.sqrt(v);
  let eigMatrix = num.dot(num.dot(vsqrt, w), vsqrt);
  let lambdas = num.eig(eigMatrix).lambda.x;
  let [stat, s1, s2, s3] = Array(4).fill(0.0);
  let x;
  for (i = 0; i < m; i++) {
    stat += u[i] * u[i];
    x = lambdas[i];
    s1 += x;
    x *= x;
    s2 += x;
    x *= x;
    s3 += x;
  }
  let df = (s2 ** 3) / (s3 ** 2);
  let a = s3 / s2;
  let b = s1 - (s2 ** 2) / s3;
  return 1 - jStat.chisquare.cdf((stat - b) / a, df);
}

/**
 * Calculate VT test meta-analysis
 */
function testVt(u, v, w) {

}

module.exports = {ScoreStatTable, GenotypeCovarianceMatrix, VariantMask, testBurden, testSkat, testVt};

