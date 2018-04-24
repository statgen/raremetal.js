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

import helpers from './helpers.js';
import stats from './stats.js';


// TODO: For now the "rollup" of each module's contents must be maintained manually, but there are TC39 proposals
//   (eg export-ns-from) for language features that will eventually streamline this process
export { helpers, stats };
