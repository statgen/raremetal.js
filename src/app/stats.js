/**
 * Calculate group-based tests from score statistics
 * @module stats
 * @license MIT
 */

const num = require("numeric");
const jStat = require("jStat");
const qf = require("./qfc.js");
const rmath = require("lib-r-math.js");
const pchisq = rmath.ChiSquared().pchisq;

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
    this.label = null;
    this.id = null;
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
  size() { return this.groups.size }

  /**
   * Iterate over groups with syntax:
   * for (let [group, variants] in mask) { ... }
   * @return Iterator over entries, yields [group, array of variants]
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
  // subsetToVariants(variants) {
  //
  // }
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
 * Calculate typical SKAT weights using beta pdf
 * @param mafs Array of minor allele frequencies
 * @param a alpha defaults to 1
 * @param b beta defaults to 25
 */
function calcSkatWeights(mafs, a = 1, b = 25) {
  let weights = Array(mafs.length).fill(NaN);
  for (let i = 0; i < mafs.length; i++) {
    let w = jStat.beta.pdf(mafs[i], a, b);
    w *= w;
    weights[i] = w;
  }
  return weights;
}

/**
 * Calculate SKAT test
 *
 * @param {Number[]} u Vector of score statistics (length m, number of variants)
 * @param {Number[]} v Covariance matrix of score statistics (m x m)
 * @param {Number[]} w Weight vector (length m, number of variants)
 * @param {String} method Can be "satterthwaite", "davies", or "liu"
 *   The Satterthwaite approximation is fastSKAT
 *   Davies is the method used in the original Wu et al. SKAT paper
 * @return {Number[]} SKAT p-value
 */
function testSkat(u, v, w, method = "davies") {
  // Calculate Q
  let q = num.dot(num.dot(u,num.diag(w)),u);

  // Calculate lambdas
  let lambdas;
  try {
    let svd = num.svd(v);
    let sqrtS = num.sqrt(svd.S);
    let uT = num.transpose(svd.U);
    let eigenRhs = num.dot(num.dot(svd.U, num.diag(sqrtS)), uT);
    let eigenLhs = num.dot(eigenRhs, num.diag(w));
    let eigen = num.dot(eigenLhs, eigenRhs);
    let finalSvd = num.svd(eigen);
    lambdas = num.abs(finalSvd.S);
  } catch(error) {
    console.log(error);
    return [NaN, NaN];
  }

  if (num.sum(lambdas) < 0.0000000001) {
    console.error("Sum of lambda values for SKAT test is essentially zero");
    return [NaN, NaN];
  }

  // P-value method
  if (method === "satterthwaite") {
    throw 'Not implemented';
    //return _skatSatterthwaite(lambdas, q);
  } else if (method === "davies") {
    return _skatDavies(lambdas, q);
  } else if (method === "liu") {
    return _skatLiu(lambdas, q);
  } else {
    throw 'Not implemented';
  }
}

/**
 * Calculate SKAT p-value using Davies method
 * @param lambdas Eigenvalues of sqrtV * W * sqrtV
 * @param qstat SKAT test statistic U.T * W * U
 * @return {Number[]} pvalue
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
  let trace = Array(7).fill(0);
  let sigma = 0.0;
  let lim1 = 10000;
  let acc = 0.0001;
  let ifault = 0;
  let res = qf._qf(lambdas, nc1, n1, n, sigma, qstat, lim1, acc, trace, ifault);

  if (ifault > 0) {
    throw new Error("Mixture chi-square CDF returned an error code of " + ifault.toString());
  }

  res = 1.0 - res;
  return [qstat, res];
}

/**
 * Calculate SKAT p-value using Liu method
 * @param lambdas Eigenvalues of sqrtV * W * sqrtV
 * @param qstat SKAT test statistic U.T * W * U
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
 * Calculate SKAT p-value using Satterthwaite approximation
 */
/*
function _skatSatterthwaite(lambdas, qstat) {

}
/*

/**
 * Calculate VT test meta-analysis
 */
/*
function testVt(u, v, w) {

}
*/

module.exports = {ScoreStatTable, GenotypeCovarianceMatrix, VariantMask, testBurden, testSkat, calcSkatWeights};

