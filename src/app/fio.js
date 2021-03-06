/**
 * Methods for loading score statistics and covariance matrices from local files. This is primarily used by the CLI.
 * @module fio
 * @license MIT
 */

import fs from 'fs';
import readline from 'readline';
import { execSync, spawn } from 'child_process';
import { REGEX_EPACTS } from './constants.js';
import numeric from '../lib/numeric-1.2.6';
import zlib from 'zlib';

/**
 * An enum denoting score/covariance statistics file format.
 * @type {{RAREMETAL: number, RVTEST: number}}
 */
const STATS_FORMAT = {
  'RAREMETAL': 0,
  'RVTEST': 1,
};

/**
 * Helper function to sort a list of variants (in EPACTS format) by position.
 * @function
 * @param a Variant 1
 * @param b Variant 2
 * @return {number} Comparison integer (0, -1, or 1.)
 * @private
 */
function _variantSort(a, b) {
  let pos_a = parseInt(a.match(REGEX_EPACTS)[2]);
  let pos_b = parseInt(b.match(REGEX_EPACTS)[2]);

  if (pos_a < pos_b) {
    return -1;
  }

  if (pos_a > pos_b) {
    return 1;
  }

  return 0;
}

function arraysEqual(a1, a2) {
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
  addVariantForGroup(group, variant) {
    if (this.groups.has(group)) {
      this.groups.get(group).push(variant);
    } else {
      let ar = [variant];
      this.groups.set(group, ar);
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
  createGroup(group, variants) {
    this.groups.set(group, variants);
  }

  /**
   * Get the number of groups
   * @return {number} Number of groups.
   */
  size() {
    return this.groups.size;
  }

  /**
   * Iterate over groups with syntax:
   * <pre>for (let [group, variants] in mask) { ... }</pre>
   * @return Iterator over entries, yields [group, array of variants]
   */
  [Symbol.iterator]() {
    return this.groups.entries();
  }

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
    this.pvalue = [];
  }

  /**
   * Add a variant and relevant data on it into the table.
   *
   * @param variant {string} Variant (chr:pos_ref/alt)
   * @param position {number} Integer position of variant
   * @param u {number} Score statistic
   * @param v {number} Variance of score statistic
   * @param altFreq {number} Alternate allele frequency
   * @param ea {string} Effect allele
   * @param eaFreq {number} Effect allele frequency
   * @param pvalue {number} Single variant p-value
   */
  appendScore(variant, position, u, v, altFreq, ea, eaFreq, pvalue) {
    this.variants.push(variant);
    this.positions.push(position);

    this.variantMap.set(variant, this.variants.length - 1);
    this.positionMap.set(position, this.positions.length - 1);

    this.u.push(u);
    this.v.push(v);
    this.altFreq.push(altFreq);
    this.effectAllele.push(ea);
    this.effectAlleleFreq.push(eaFreq);
    this.pvalue.push(pvalue);
  }

  /**
   * Return the alternate allele frequency for a variant
   * @param variant
   * @return {number} Alt allele frequency
   */
  getAltFreqForVariant(variant) {
    let freq = this.altFreq[this.variantMap.get(variant)];
    if (freq == null) {
      throw new Error(`Variant did not exist when looking up alt allele freq: ${variant}`);
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
      throw new Error(`Position did not exist when looking up alt allele freq: ${position}`);
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
      throw new Error(`Variant did not exist at position: ${position}`);
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
    if (!arraysEqual(dimThis, dimOther)) {
      throw 'Scores cannot be added, dimensions are unequal';
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
    if (typeof variantList === 'undefined') {
      throw new Error('Must specify list of variants when subsetting');
    }

    // First figure out which variants supplied are actually in this set of score stats
    variantList = variantList.filter((x) => this.variantMap.has(x));

    // Subset each member to only those variants
    let idx = variantList.map((x) => this.variantMap.get(x));
    let variants = idx.map((i) => this.variants[i]);
    let positions = idx.map((i) => this.positions[i]);
    let u = idx.map((i) => this.u[i]);
    let v = idx.map((i) => this.v[i]);
    let altFreq = idx.map((i) => this.altFreq[i]);

    let variantMap = new Map(variants.map((element, index) => [element, index]));
    let positionMap = new Map(variants.map((element, index) => [element, index]));

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
    if (!arraysEqual(dimThis, dimOther)) {
      throw 'Covariance matrices cannot be added, dimensions are unequal';
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

// async function readMaskFile(fpath) {
//   const rl = readline.createInterface(fs.createReadStream(fpath))
//
//   // Async start reading lines into array, formatting as necessary
//   const groups = {};
//   rl.on("line", (line) => {
//     let ar = line.trim().split("\t");
//     let group = ar[0];
//     let variants = ar[1].split(/\s+/);
//     groups[group] = variants;
//   })
//
//   // Return a promise that is fulfilled when readline is finished reading lines
//   const promise = new Promise(function (resolve, reject) {
//     rl.on("close", () => {
//       resolve(groups)
//     })
//   })
//
//   // Will resolve to object of groups, key is group,
//   // value is list of variants
//   return promise;
// }

/**
 * Read groups from a mask file.
 * @function
 * @param {string} fpath Path to mask file.
 * @return {VariantMask} A VariantMask object that stores a mapping of groups to lists of variants.
 * @public
 */
function readMaskFileSync(fpath) {
  const data = fs.readFileSync(fpath, { encoding: 'utf8' });
  const mask = new VariantMask();
  for (let line of data.split('\n')) {
    line = line.trim();
    if (line === '') {
      continue;
    }

    let ar = line.split('\t');
    let group = ar[0];
    let variants = ar.slice(1);

    // Enforce all variants must be on same chromosome
    let n_uniq = (new Set(variants.map((x) => x.match(REGEX_EPACTS)[1]))).size;
    if (n_uniq > 1) {
      throw `All variants for group ${group} must be on same chromosome`;
    }

    // Enforce that variants are in sorted order by position
    variants.sort(_variantSort);

    // Add group to the mask object
    mask.createGroup(group, variants);
  }

  return mask;
}

/**
 * Extract score statistics from a file (either rvtest or raremetal format).
 * @param {string} fpath - The path to the bgzipped score statistics file (one variant per line).
 * @param {string} region - Region containing the variants. Should be formatted in the typical "1:1-4000".
 * @param {string[]} variants - A list of variants to specifically extract, in this order. If a list of variants is not
 *  provided, all variants will be extracted in the region.
 * @return {module:stats~ScoreStatTable} An object containing statistics per variant, including:
 *  <ul>
 *    <li> Chromosome and position
 *    <li> Score statistic
 *    <li> Variance of the score statistic
 *    <li> Reference allele
 *    <li> Alternate allele and frequency
 *    <li> Effect allele and frequency
 *    <li> Number of genotyped samples present in the analysis when the score statistics were calculated
 *  </ul>
 */
async function extractScoreStats(fpath, region, variants) {
  // Figure out format.
  const fileFormat = await detectFormat(fpath);

  let colChrom, colPos, colRef, colAlt, colU, colV, colAltFreq, colEffectAllele, colPvalue;
  if (fileFormat === STATS_FORMAT.RAREMETAL) {
    colChrom = 0;
    colPos = 1;
    colRef = 2;
    colAlt = 3;
    colAltFreq = 5;
    colU = 13;
    colV = 14;
    colEffectAllele = 3;
    colPvalue = 16;
  } else if (fileFormat === STATS_FORMAT.RVTEST) {
    colChrom = 0;
    colPos = 1;
    colRef = 2;
    colAlt = 3;
    colAltFreq = 5;
    colU = 12;
    colV = 13;
    colEffectAllele = 3;
    colPvalue = 15;
  } else {
    throw new Error('Unrecognized covariance matrix file format');
  }

  // Read in data in region from tabix
  const lines = execSync(`tabix -h ${fpath} ${region}`, { encoding: 'utf8' });

  const given_variants = variants != null;
  if (given_variants) {
    if (!Array.isArray(variants) || !variants.length) {
      throw 'Variants must be an array';
    }
  }

  const scoreTable = new ScoreStatTable();
  const line_array = lines.split('\n');
  for (let e of line_array) {
    e = e.trim();
    if (e === '') {
      continue;
    }

    if (e.startsWith('##AnalyzedSamples')) {
      scoreTable.sampleSize = parseInt(e.trim().replace('##AnalyzedSamples=', ''));
    } else {
      let ar = e.split('\t');
      let variant = `${ar[colChrom]}:${ar[colPos]}_${ar[colRef]}/${ar[colAlt]}`;
      let position = parseInt(ar[colPos]);
      let u = parseFloat(ar[colU]);
      let sqrt_v = parseFloat(ar[colV]);
      let altFreq = parseFloat(ar[colAltFreq]);
      let ea = ar[colEffectAllele];
      let eaFreq = altFreq;
      let pvalue = parseFloat(ar[colPvalue]);

      // Drop variants that are monomorphic. We can't use them.
      // @todo: Need to log this somehow, research JS logging packages
      if (altFreq === 0) {
        continue;
      }

      /*
       * The variant's effect direction in the score stat file is coded towards
       * the alternate allele. However, we want the effect coded towards the minor allele,
       * since most rare variant tests assume you are counting the rare/minor allele.
       */
      if (altFreq > 0.5) {
        // Effect allele is now the reference allele, not the alt allele.
        ea = ar[colRef];

        // Flip the score stat direction.
        u = -u;

        // Effect allele frequency
        eaFreq = 1 - altFreq;
      }

      if (!given_variants || variants.includes(variant)) {
        scoreTable.appendScore(variant, position, u, sqrt_v, altFreq, ea, eaFreq, pvalue);
      }
    }
  }

  return scoreTable;
}

/**
 * Find the number of variants in a region of a covariance matrix file.
 * @function
 * @public
 * @param {string} covarFile Path to covariance matrix file
 * @param {string} region Region string, e.g. 1:1-4000
 * @returns {number} Number of variants in the region
 */
function getNumberOfVariantsFromCovarianceFile(covarFile, region) {
  const cmd = `tabix ${covarFile} ${region}`;
  const lines = execSync(cmd, { encoding: 'utf8' });
  const positions = new Set();
  for (let e of lines.split('\n')) {
    if (e.startsWith('#')) {
      continue;
    }
    if (e.trim() === '') {
      continue;
    }

    let pos_array = e.split('\t')[4].split(',');
    pos_array.forEach((x) => positions.add(x));
  }
  return positions.size;
}

/**
 * Determine whether the file is in rvtest or raremetal format.
 * @param fpath {string} Path to file (can be covariance or score stats).
 * @return {number} STATS_FORMAT.RAREMETAL or STATS_FORMAT.RVTEST.
 */
function detectFormat(fpath) {
  let stream = fs.createReadStream(fpath);
  let gzstream = stream.pipe(zlib.createGunzip());
  let format = null;

  return new Promise((resolve, reject) => {
    gzstream.on('readable', () => {
      let head = gzstream.read(100);
      let programName = head.toString().split('\n')[0].split('=')[1];
      if (programName === 'Rvtests') {
        format = STATS_FORMAT.RVTEST;
        resolve(format);
      } else if (programName === 'RareMetalWorker') {
        format = STATS_FORMAT.RAREMETAL;
        resolve(format);
      } else {
        reject(Error('Could not determine format of covariance matrix file'));
      }
    });
  });
}

/**
 * Extract covariance matrix from a file.
 * If variants are provided, only extract a matrix for the given variants. This only requires a single pass of the file.
 * If no variants are provided, a double pass is done - one to figure out the size of the matrix, the next to read it.
 *
 * <p>
 *
 * This function assumes you have tabix installed, and it exists on your PATH.
 * You can download tabix by visiting {@link http://www.htslib.org/download/|htslib.org}.
 *
 * <p>
 *
 * We assume that the file being loaded is a covariance matrix file produced by either
 * {@link https://genome.sph.umich.edu/wiki/RAREMETAL_Documentation RAREMETAL} or
 * {@link https://github.com/zhanxw/rvtests rvtests}. We specifically assume that, per these file formats, scores and
 * covariances are oriented towards the alternate allele when reading. However, when storing, covariances are stored flipped
 * towards the *minor allele*, as this is typically the convention used in aggregation tests. The covariance matrix is
 * also multiplied by the sample size, since per convention, RAREMETAL and rvtests both divide each element by the sample
 * size before writing out.
 *
 * @function
 * @param {string} fpath Path to covariance matrix file.
 * @param {string} region Region string, e.g. 1:1-40000.
 * @param {string[]} variants Array of variants to extract in this order. Variants should be EPACTS format, e.g. 1:4_A/G.
 * @param {ScoreStatTable} scoreStats Object containing score statistics and other required information.
 *   This is needed because rvtest and raremetalworker both normalize the covariance matrix by the sample size.
 * @returns {Promise<GenotypeCovarianceMatrix>} A genotype covariance matrix.
 */
async function extractCovariance(fpath, region, variants, scoreStats) {
  const fileFormat = await detectFormat(fpath);
  let colCov, colPos;
  //let colChrom = 0;

  if (fileFormat === STATS_FORMAT.RAREMETAL) {
    colCov = 3;
    colPos = 2;
  } else if (fileFormat === STATS_FORMAT.RVTEST) {
    colCov = 5;
    colPos = 4;
  } else {
    throw new Error('Unrecognized covariance matrix file format');
  }

  const given_variants = variants != null;

  if (given_variants) {
    if (!Array.isArray(variants) || !variants.length) {
      throw 'Variants must be an array';
    }

    // Remove duplicates
    let vset = new Set(variants);
    if (vset.size !== variants.length) {
      throw `Duplicate variants given when extracting covariance matrix: \n${variants}`;
    }
  }

  // Preallocate matrix
  const n_variants = (variants != null) ? variants.length : getNumberOfVariantsFromCovarianceFile(fpath, region);
  let covmat = new Array(n_variants);
  for (let i = 0; i < n_variants; i++) {
    covmat[i] = new Array(n_variants).fill(null);
  }

  // Map from variant ID or position => matrix index
  // We may need to re-order variants according to the variants argument
  const vdict = new Map();
  const positions = new Map();
  if (given_variants) {
    for (let i = 0; i < n_variants; i++) {
      let v = variants[i];
      let p = parseInt(v.match(REGEX_EPACTS)[2]);
      vdict.set(variants[i], i);
      positions.set(p, i);
    }
  }

  // Call tabix and prepare to extract the region of interest
  // This uses readline to iterate over the results from tabix line by line
  const cmd = `tabix ${fpath} ${region}`;
  const proc = spawn(cmd, [], { shell: true });
  const rl = readline.createInterface(proc.stdout);

  // Async start reading lines into array, formatting as necessary
  let next = Math.max(...positions.values()) + 1 ? positions.size : 0;
  let stored_value = false;
  rl.on('line', (e) => {
    let ar = e.trim().split('\t');
    let rowPositions = ar[colPos].split(',').map((x) => parseInt(x));

    if (!given_variants) {
      // Only parse all of the positions in the row if we weren't given variants
      // by the user. Otherwise, we only care about the positions of those specific variants,
      // which were added above.
      for (let p of rowPositions) {
        if (!positions.has(p)) {
          positions.set(p, next);
          next += 1;
        }
      }
    }

    // Binary traits will have extra information including the covariance
    // of the trait with covariates, and genotypes with covariates
    // First: covariance between genotypes
    // Second: covariance between genotypes and covariates
    // Third: covariance between covariates
    let [cov_geno,, ] = ar[colCov].split(':');

    // At least cov_geno must be defined
    if (typeof cov_geno === 'undefined') {
      throw 'Could not extract genotype covariance';
    } else {
      cov_geno = cov_geno.split(',').map((x) => parseFloat(x));
    }

    if (!positions.has(rowPositions[0])) {
      // The first variant in the list of positions is the one for which the rest
      // of the positions are paired, e.g. (P1,P2), (P1,P3), (P1,P4), etc.
      // So if this one isn't one we care about, just move on.
      //console.log("Skipping variant at position ",tmp_pos[0]," - variant was not requested for analysis");
      return;
    }

    // Read genotype covariance into matrix
    let i = positions.get(rowPositions[0]);
    let i_alt_freq = scoreStats.getAltFreqForPosition(rowPositions[0]);
    for (let g = 0; g < cov_geno.length; g++) {
      let rowPos = rowPositions[g];
      if (positions.has(rowPos)) {
        let j = positions.get(rowPos);
        let v = parseFloat(cov_geno[g]);
        let j_alt_freq = scoreStats.getAltFreqForPosition(rowPos);

        /**
         * The score stats file codes variant genotypes towards the alt allele. If the alt allele frequency
         * is > 0.5, that means we're not counting towards the minor (rare) allele, and we need to flip it around.
         * We don't flip when i == j because that element represents the variance of the variant itself, which is
         * invariant to which allele we code towards (but covariance is not.)
         * We also don't flip when both the i variant and j variant need to be flipped (the ^ is XOR) because it would
         * just cancel out.
         */
        if (i !== j) {
          if ((i_alt_freq > 0.5) ^ (j_alt_freq > 0.5)) {
            v = -v;
          }
        }

        covmat[i][j] = v;
        covmat[j][i] = v;
        stored_value = true;
      }
    }
  });

  // Return a promise that is fulfilled when readline is finished reading lines
  return new Promise(function(resolve, reject) {
    rl.on('close', () => {
      // We're finished reading, perform the final steps and then resolve the promise.
      // For some reason rvtest/RAREMETAL divide by the sample size.
      if (stored_value) {
        // We successfully read at least 1 value into the covariance matrix
        covmat = numeric.mul(scoreStats.sampleSize, covmat);
        let covobj = new GenotypeCovarianceMatrix(covmat, variants, positions);
        resolve(covobj);
      } else {
        reject(Error('No values read from covariance matrix'));
      }
    });
  });
}

/**
 * Extract covariance matrix from a file
 * THIS VERSION IS CURRENTLY BROKEN DUE TO A NODE.JS LIMITATION ON BUFFER SIZE
 */
// function extractCovarianceSync(fpath,region,variants,sampleSize) {
//   const cmd = `tabix ${fpath} ${region}`;
//   const lines = execSync(cmd,{encoding: "utf8",maxBuffer: 68719476736}).trim().split("\n");
//   const given_variants = variants != null;
//
//   if (given_variants) {
//     if (!Array.isArray(variants) || !variants.length) {
//       throw "Variants must be an array";
//     }
//
//     // Remove duplicates
//     vset = new Set(variants);
//     if (vset.size !== variants.length) {
//       throw 'Duplicate variants given when extracting covariance matrix: \n' + variants
//     }
//   }
//
//   // Preallocate matrix
//   const n_variants = (variants != null) ? variants.length : getNumberOfVariantsFromCovarianceFile(fpath,region);
//   let covmat = new Array(n_variants);
//   for (let i = 0; i < n_variants; i++) {
//     covmat[i] = new Array(n_variants).fill(null);
//   }
//
//   // Map from variant ID or position => matrix index
//   // We may need to re-order variants according to the variants argument
//   const vdict = new Map();
//   const positions = new Map();
//   if (given_variants) {
//     for (let i = 0; i < n_variants; i++) {
//       let v = variants[i];
//       let p = parseInt(v.match(REGEX_EPACTS)[2]);
//       vdict.set(variants[i],i);
//       positions.set(p,i);
//     }
//   }
//
//   // Read data and assign values into matrix
//   let next = Math.max(...positions.values()) + 1 ? positions.size : 0;
//   for (let e of lines) {
//     let ar = e.trim().split("\t");
//
//     let tmp_pos = ar[4].split(",").map(x => parseInt(x));
//
//     if (!given_variants) {
//       // Only parse all of the positions in the row if we weren't given variants
//       // by the user. Otherwise, we only care about the positions of those specific variants,
//       // which were added above.
//       for (let p of tmp_pos) {
//         if (!positions.has(p)) {
//           positions.set(p,next);
//           next += 1;
//         }
//       }
//     }
//
//     // Binary traits will have extra information including the covariance
//     // of the trait with covariates, and genotypes with covariates
//     let [cov_geno,cov_geno_covar,cov_covar] = ar[5].split(":");
//
//     // At least cov_geno must be defined
//     if (typeof cov_geno === 'undefined') { throw 'Could not extract genotype covariance'; }
//     else { cov_geno = cov_geno.split(",").map(x => parseFloat(x)); }
//
//     if (!positions.has(tmp_pos[0])) {
//       // The first variant in the list of positions is the one for which the rest
//       // of the positions are paired, e.g. (P1,P2), (P1,P3), (P1,P4), etc.
//       // So if this one isn't one we care about, just move on.
//       //console.log("Skipping variant at position ",tmp_pos[0]," - variant was not requested for analysis");
//       continue;
//     }
//
//     // Read genotype covariance into matrix
//     let i = positions.get(tmp_pos[0])
//     for (let g = 0; g < cov_geno.length; g++) {
//       if (positions.has(tmp_pos[g])) {
//         let j = positions.get(tmp_pos[g]);
//         let v = parseFloat(cov_geno[g]);
//         covmat[i][j] = v;
//         covmat[j][i] = v;
//       }
//     }
//   }
//
//   // For some reason rvtest/RAREMETAL divide by the sample size.
//   covmat = num.mul(sampleSize,covmat);
//
//   return new GenotypeCovarianceMatrix(covmat,variants,positions);
// }

export { readMaskFileSync, extractScoreStats, extractCovariance, detectFormat };

