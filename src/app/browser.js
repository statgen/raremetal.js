/**
 * Calculate aggregation tests and meta-analysis of these tests
 * using score statistics and covariance matrices in the browser.
 *
 * This is the user-facing bundle, which exposes an API suitable for use in the web browser.
 * If using es6 modules exclusively, consider including those files directly for greater control.
 *
 * @module browser
 * @license MIT
 */

// For now, this will need to be built with webpack. For the purposes of future migration path we will attempt to
//   support es6 semantics where feasible in browser-facing code.
const helpers = require('./helpers.js');
const stats = require('./stats.js');

export { helpers, stats };
