/**
 * Calculate aggregation tests and meta-analysis of these tests
 * using score statistics and covariance matrices in the browser.
 *
 * Modules related to command-line usage are not included in this bundle.
 *
 * @module browser
 * @license MIT
 */

const hail = require("./hail.js");
const stats = require("./stats.js");

module.exports = { hail, stats };
