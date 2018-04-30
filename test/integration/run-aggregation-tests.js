import { parsePortalJson, runAggregationTests }  from '../../src/app/helpers.js';
import { testBurden, testSkat, calcSkatWeights } from '../../src/app/stats.js';
const fs = require('fs');

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
      results = runAggregationTests(
        {
          'zegginiBurden': testBurden,
          'skatLiu': {
            test: (u, v, w) => testSkat(u, v, w, 'liu'),
            weights: calcSkatWeights
          },
          'skatDavies': {
            test: (u, v, w) => testSkat(u, v, w, 'davies'),
            weights: calcSkatWeights
          }
        },
        scoreCov,
        {
          id: 100, // This gets repeated in the response
          description: 'This is an example of running multiple tests and masks at once'
        }
      );
    });

    it('should match expected burden p-value for HIC2', function() {
      let t = results.data.results.filter(x => x.group === 'HIC2' && x.test === 'zegginiBurden')[0];
      assert.closeTo(t.pvalue,0.42913956,0.001);
    });

    it('should match expected skat liu p-value for HIC2', function() {
      let t = results.data.results.filter(x => x.group === 'HIC2' && x.test === 'skatLiu')[0];
      assert.closeTo(t.pvalue,0.739,0.001);
    });

    it('should match expected skat davies p-value for HIC2', function() {
      let t = results.data.results.filter(x => x.group === 'HIC2' && x.test === 'skatDavies')[0];
      assert.closeTo(t.pvalue,0.765,0.001);
    });
  });
});
