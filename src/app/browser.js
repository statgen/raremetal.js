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

import * as helpers from './helpers.js';
import * as stats from './stats.js';

export { helpers, stats };
