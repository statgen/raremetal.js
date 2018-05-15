/**
 * Functions for pretty-printing various data structures. <p>
 *
 * This should not be included in the browser bundle. The dependencies cause
 * a large increase in the download size (~ 200k -> 750k). And the pretty
 * printing does not work in the browser console anyway.
 *
 * @module print
 * @license MIT
 */

import Table from 'cli-table2';

/**
 * Pretty print a table of score statistics
 * @param scores
 */
function printScoreTable(scores) {
  let table = new Table({
    head: ["variant", "u", "sqrt_v", "alt_freq"]
  });

  for (let i = 0; i < scores.variants.length; i++) {
    table.push([
      scores.variants[i],
      scores.u[i],
      scores.v[i],
      scores.altFreq[i]
    ])
  }

  console.log(table.toString());
  console.log("\n");
}

/**
 * Pretty print the matrix to the console for debugging purposes
 * @param matrix
 */
function printCovarianceMatrix(matrix) {
  let pos = new Array(...matrix.positions.keys());
  let table = new Table({
    head: pos
  });
  table.push(...matrix.matrix);
  console.log(table.toString());
  console.log("\n");
}

export { printScoreTable, printCovarianceMatrix };