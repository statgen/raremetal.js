import { parsePortalJson, runAggregationTests }  from '../../src/app/helpers.js';
import { AGGREGATION_TESTS } from '../../src/app/stats.js';
import fs from 'fs';
import { assert } from 'chai';

describe('Full integration of covariance and aggregation tests', function() {
  describe('runAggregationTests()', function() {
    let results;

    before(function() {
      // Otherwise mocha will timeout
      this.timeout(10000);

      // Load example JSON of portal response from requesting covariance in a region
      let jsonRaw = fs.readFileSync('test/integration/example.json');
      let json = JSON.parse(jsonRaw);
      var scoreCov = parsePortalJson(json);

      // Run all tests/masks and return results
      results = runAggregationTests(AGGREGATION_TESTS, scoreCov);
    });

    it('should match expected burden p-value for HIC2', function() {
      let t = results.data.results.filter(x => x.group === 'HIC2' && x.test === 'zegginiBurden')[0];
      assert.closeTo(t.pvalue,0.42913956,0.001);
    });

    it('should match expected skat p-value for HIC2', function() {
      let t = results.data.results.filter(x => x.group === 'HIC2' && x.test === 'skat')[0];
      assert.closeTo(t.pvalue,0.765,0.001);
    });
  });
});
