/**
 * Methods for loading score statistics and covariance matrices from local files. This is primarily used by the CLI.
 * @module fio
 * @license MIT
 */

import fs from 'fs';
import readline from 'readline';
import { execSync, spawn } from 'child_process';
import REGEX_EPACTS from './constants.js';
import { ScoreStatTable, GenotypeCovarianceMatrix, VariantMask } from './stats.js';
import numeric from 'numeric';
import zlib from 'zlib';

/**
 * An enum denoting score/covariance statistics file format.
 * @type {{RAREMETAL: number, RVTEST: number}}
 */
const STATS_FORMAT = {
  "RAREMETAL": 0,
  "RVTEST": 1
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
  let pos_a = a.match(REGEX_EPACTS)[2];
  let pos_b = b.match(REGEX_EPACTS)[2];

  if (pos_a < pos_b) {
    return -1
  }

  if (pos_a > pos_b) {
    return 1;
  }

  return 0;
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
  const data = fs.readFileSync(fpath, { encoding: "utf8" });
  const mask = new VariantMask();
  for (let line of data.split("\n")) {
    line = line.trim();
    if (line === '') {
      continue;
    }

    let ar = line.split("\t");
    let group = ar[0];
    let variants = ar.slice(1);

    // Enforce all variants must be on same chromosome
    let n_uniq = (new Set(variants.map(x => x.match(REGEX_EPACTS)[1]))).size;
    if (n_uniq > 1) {
      throw `All variants for group ${group} must be on same chromosome`;
    }

    // Enforce that variants are in sorted order by position
    variants.sort(_variantSort);

    // Add group to the mask object
    mask.createGroup(group,variants);
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

  let colChrom, colPos, colRef, colAlt, colU, colV, colAltFreq, colEffectAllele;
  if (fileFormat === STATS_FORMAT.RAREMETAL) {
    colChrom = 0;
    colPos = 1;
    colRef = 2;
    colAlt = 3;
    colAltFreq = 5;
    colU = 13;
    colV = 14;
    colEffectAllele = 3;
  }
  else if (fileFormat === STATS_FORMAT.RVTEST) {
    colChrom = 0;
    colPos = 1;
    colRef = 2;
    colAlt = 3;
    colAltFreq = 5;
    colU = 12;
    colV = 13;
    colEffectAllele = 3;
  }
  else {
    throw new Error("Unrecognized covariance matrix file format");
  }

  // Read in data in region from tabix
  const lines = execSync(`tabix -h ${fpath} ${region}`, { encoding: "utf8" });

  const given_variants = variants != null;
  if (given_variants) {
    if (!Array.isArray(variants) || !variants.length) {
      throw "Variants must be an array";
    }
  }

  const scoreTable = new ScoreStatTable();
  const line_array = lines.split("\n");
  for (let e of line_array) {
    e = e.trim();
    if (e === "") {
      continue;
    }

    if (e.startsWith("##AnalyzedSamples")) {
      scoreTable.sampleSize = parseInt(e.trim().replace("##AnalyzedSamples=", ""));
    }
    else {
      let ar = e.split("\t");
      let variant = `${ar[colChrom]}:${ar[colPos]}_${ar[colRef]}/${ar[colAlt]}`;
      let position = parseInt(ar[colPos]);
      let u = parseFloat(ar[colU]);
      let sqrt_v = parseFloat(ar[colV]);
      let altFreq = parseFloat(ar[colAltFreq]);
      let ea = ar[colEffectAllele];
      let eaFreq = altFreq;

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
        scoreTable.appendScore(variant, position, u, sqrt_v, altFreq, ea, eaFreq);
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
  const lines = execSync(cmd, { encoding: "utf8" });
  const positions = new Set();
  for (let e of lines.split("\n")) {
    if (e.startsWith("#")) continue;
    if (e.trim() === "") continue;

    let pos_array = e.split("\t")[4].split(",");
    pos_array.forEach(x => positions.add(x));
  }
  return positions.size;
}

/**
 * Determine whether the file is in rvtest or raremetal format.
 * @param fpath {string} Path to file (can be covariance or score stats).
 * @return {number} STATS_FORMAT.RAREMETAL or STATS_FORMAT.RVTEST.
 */
async function detectFormat(fpath) {
  let stream = fs.createReadStream(fpath);
  let gzstream = stream.pipe(zlib.createGunzip());
  let format = null;

  return new Promise((resolve,reject) => {
    gzstream.on("readable",() => {
      let head = gzstream.read(100);
      let programName = head.toString().split("\n")[0].split("=")[1];
      if (programName === "Rvtests") {
        format = STATS_FORMAT.RVTEST;
        resolve(format);
      }
      else if (programName === "RareMetalWorker") {
        format = STATS_FORMAT.RAREMETAL;
        resolve(format);
      }
      else {
        reject("Could not determine format of covariance matrix file");
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
  }
  else if (fileFormat === STATS_FORMAT.RVTEST) {
    colCov = 5;
    colPos = 4;
  }
  else {
    throw new Error("Unrecognized covariance matrix file format");
  }

  const given_variants = variants != null;

  if (given_variants) {
    if (!Array.isArray(variants) || !variants.length) {
      throw "Variants must be an array";
    }

    // Remove duplicates
    let vset = new Set(variants);
    if (vset.size !== variants.length) {
      throw 'Duplicate variants given when extracting covariance matrix: \n' + variants;
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
  rl.on("line", (e) => {
    let ar = e.trim().split("\t");
    let rowPositions = ar[colPos].split(",").map(x => parseInt(x));

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
    let [cov_geno,,] = ar[colCov].split(":");

    // At least cov_geno must be defined
    if (typeof cov_geno === 'undefined') {
      throw 'Could not extract genotype covariance';
    }
    else {
      cov_geno = cov_geno.split(",").map(x => parseFloat(x));
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
    rl.on("close", () => {
      // We're finished reading, perform the final steps and then resolve the promise.
      // For some reason rvtest/RAREMETAL divide by the sample size.
      if (stored_value) {
        // We successfully read at least 1 value into the covariance matrix
        covmat = numeric.mul(scoreStats.sampleSize, covmat);
        let covobj = new GenotypeCovarianceMatrix(covmat, variants, positions);
        resolve(covobj);
      } else {
        reject("No values read from covariance matrix");
      }
    })
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

