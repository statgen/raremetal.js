/**
 * Calculate group-based tests from score statistics.
 *
 * @module stats
 * @license MIT
 */

import * as qfc from './qfc.js';
import numeric from 'numeric';
import { pchisq, dbeta, pnorm } from './rstats.js';
import * as mvtdstpack from './mvtdstpack.js';
const { DoubleVec, IntVec, mvtdst } = mvtdstpack;

function makeDoubleVec(size) {
  const v = new DoubleVec();
  v.resize(size, NaN);
  return v;
}

function makeIntVec(size) {
  const v = new IntVec();
  v.resize(size, NaN);
  return v;
}

function copyToDoubleVec(arr) {
  const v = new DoubleVec();
  for (let i = 0; i < arr.length; i++) {
    v.push_back(arr[i]);
  }
  return v;
}

function emptyRowMatrix(nrows, ncols) {
  let m = new Array(nrows);
  for (let i = 0; i < nrows; i++) {
    m[i] = new Array(ncols).fill(NaN);
  }
  return m;
}

function cov2cor(sigma, corr) {
  for (let i = 0; i < sigma.length; i++) {
    for (let j = i; j < sigma[0].length; j++) {
      if (i === j) {
        corr[i][j] = 1.0;
      }
      else {
        corr[i][j] = corr[j][i] = sigma[i][j] / (Math.sqrt(sigma[i][i]) * Math.sqrt(sigma[j][j]));
      }
    }
  }
}

function pmvnorm(lower, upper, mean, sigma) {
  const n = sigma.length;
  const infin = makeIntVec(n);
  const delta = makeDoubleVec(n);
  const corrF = makeDoubleVec(n * (n-1) / 2);

  let corr = new Array(n);
  for (let i = 0; i < n; i++) {
    corr[i] = new Array(n).fill(NaN);
  }

  cov2cor(sigma, corr);

  // Populate corrF
  for (let j = 0; j < n; j++) {
    for (let i = j + 1; i < n; i++) {
      let k = j + 1 + ((i - 1) * i) / 2 - 1;
      corrF.set(k, corr[i][j]);
    }
  }

  // Calculate limits
  for (let i = 0; i < n; i++) {
    delta.set(i, 0.0);

    if (lower[i] !== Infinity && lower[i] !== -Infinity) {
      lower[i] = (lower[i] - mean[i]) / Math.sqrt(sigma[i][i]);
    }

    if (upper[i] !== Infinity && upper[i] !== -Infinity) {
      upper[i] = (upper[i] - mean[i]) / Math.sqrt(sigma[i][i]);
    }

    if (lower[i] === -Infinity) { infin.set(i, 0); }
    if (upper[i] === Infinity) { infin.set(i, 1); }
    if (lower[i] === -Infinity && upper[i] === Infinity) { infin.set(i, -1);}
    if (lower[i] !== -Infinity && upper[i] !== Infinity) { infin.set(i, 2); }
    if (lower[i] === -Infinity) { lower[i] = 0; }
    if (upper[i] === Infinity) { upper[i] = 0; }
  }

  let inform = 0;
  let value = 0.0;
  let error = 0.0;
  const df = 0;
  const maxpts = 50000;
  const abseps = 0.001;
  const releps = 0.0;

  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += infin.get(i);
  }

  if (sum === -n) {
    inform = 0;
    value = 1.0;
  }
  else {
    ({ error, inform, value } = mvtdst(n, df, copyToDoubleVec(lower), copyToDoubleVec(upper), infin, corrF, delta, maxpts, abseps, releps));
  }

  if (inform === 3) {
    // Need to make correlation matrix positive definite
    let trial = 0;
    while (inform > 1 && trial < 100) {
      let eig = numeric.eig(corr);
      let lambdas = eig.lambda.x;
      for (let i = 0; i < n; i++) {
        if (lambdas[i] < 0) {
          lambdas[i] = 0.0;
        }
      }

      let D = numeric.diag(lambdas);
      let V = eig.E.x;
      corr = numeric.dot(numeric.dot(V, D), numeric.transpose(V));
      let corr_diag = Array(n);
      for (let i = 0; i < n; i++) { corr_diag[i] = corr[i][i]; }
      let norm = numeric.dot(numeric.transpose([corr_diag]), [corr_diag]);

      for (let j = 0; j < n; j++) {
        for (let i = j + 1; i < n; i++) {
          let k = j + 1 + ((i - 1) * i) / 2 - 1;
          corrF.set(k, corr[i][j] / Math.sqrt(norm[i][j]));
        }
      }

      ({ error, inform, value } = mvtdst(n, df, copyToDoubleVec(lower), copyToDoubleVec(upper), infin, corrF, delta, maxpts, abseps, releps));
    }

    if (inform > 1) {
      value = -1.0;
    }
  }

  return {
    error: error,
    inform: inform,
    value: value
  };
}

/**
 * Base class for all aggregation tests.
 */
class AggregationTest {
  constructor() {
    this.label = '';
    this.key = '';

    this.requiresMaf = false;
  }

  run(u, v, w, mafs) { // todo update docstrings and call sigs
    throw new Error("Method must be implemented in a subclass");
  }
}

/**
 * Standard burden test that collapses rare variants into a total count of rare alleles observed per sample
 * in a group (e.g. gene). <p>
 *
 * See {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#BURDEN_META_ANALYSIS|our wiki page} for more information.
 * Also see the {@link https://www.ncbi.nlm.nih.gov/pubmed/19810025|paper} describing the method.
 *
 * @extends AggregationTest
 */
class ZegginiBurdenTest extends AggregationTest {
  constructor() {
    super(...arguments);
    this.key = 'burden';
    this.label = 'Burden Test';
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
   *
   * @param {Number[]} u Vector of score statistics (length m, number of variants)
   * @param {Number[]} v Covariance matrix of score statistics
   * @param {Number[]} w Weight vector (length m, number of variants)
   * @return {Number[]} Burden test statistic z and p-value
   */
  run(u, v, w) {
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

/**
 * Sequence kernel association test (SKAT). <p>
 *
 * See the {@link https://www.cell.com/ajhg/fulltext/S0002-9297%2811%2900222-9|original paper} for details on the
 * method, and {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#SKAT_META_ANALYSIS|our wiki} for information
 * on how the test is calculated using scores/covariances. <p>
 *
 * @extends AggregationTest
 */
class SkatTest extends AggregationTest {
  constructor() {
    super(...arguments);
    this.label = 'SKAT Test';
    this.key = 'skat';
    this.requiresMaf = true;

    /**
     * Skat test method. Only used for dev/testing.
     * Should not be set by user.
     * @private
     * @type {string}
     */
    this._method = 'auto';
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
    let weights = Array(mafs.length).fill(null);
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
  run(u, v, w, mafs) {
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
    if (this._method === 'liu') {
      // Only for debug purposes
      return _skatLiu(lambdas, q);
    }
    else if (this._method === 'davies') {
      return _skatDavies(lambdas, q);
    }
    else if (this._method === 'auto') {
      if (lambdas.length === 1) {
        // Davies method does not support 1 lambda
        // This is what raremetal does
        return _skatLiu(lambdas, q);
      }
      else {
        let daviesResult = _skatDavies(lambdas, q);
        if (isNaN(daviesResult[1])) {
          // Davies' method could not converge. Use R-SKAT's approach instead.
          return _skatLiu(lambdas, q);
        } else {
          return daviesResult;
        }
      }
    }
    else {
      throw new Error(`Skat method ${this._method} not implemented`);
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

  let converged = (res[1] === 0) && (pval > 0) && (pval <= 1);
  if (!converged) {
    pval = NaN;
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

export { AggregationTest as _AggregationTest };  // for unit testing only
export { SkatTest, ZegginiBurdenTest, pmvnorm, _skatDavies, _skatLiu };