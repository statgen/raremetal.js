import fs from 'fs';
import { assert } from 'chai';

import { parsePortalJson, makeTests }  from '../../src/app/helpers.js';

describe('Full integration of covariance and aggregation tests', function() {
  describe('AggregationTestContainer', function() {
    before(function() {
      // Otherwise mocha will timeout
      this.timeout(10000);

      // Load example JSON of portal response from requesting covariance in a region
      let jsonRaw = fs.readFileSync('test/integration/example.json');
      let json = JSON.parse(jsonRaw);
      const scoreCov = parsePortalJson(json);

      // Run all tests/masks and return results
      const container = makeTests(['zegginiBurden', 'skat'], scoreCov);
      this.results = container.run();
    });

    it('should match expected burden p-value for HIC2', function() {
      let groupResults = this.results.data.groupResults;
      for (let i = 0; i < groupResults.length; i++) {
        if (groupResults.mask[i] === 'GENCODE-AF01' && groupResults.group[i] === 'ENSG00000169635' && groupResults.test[i] === 'zegginiBurden') {
          assert.closeTo(groupResults.pvalue[i],0.42913956,0.001);
        }
      }
    });

    it('should match expected skat liu p-value for HIC2', function() {
      let groupResults = this.results.data.groupResults;
      for (let i = 0; i < groupResults.length; i++) {
        if (groupResults.mask[i] === 'GENCODE-AF01' && groupResults.group[i] === 'ENSG00000169635' && groupResults.test[i] === 'skatLiu') {
          assert.closeTo(groupResults.pvalue[i],0.739,0.001);
        }
      }
    });

    it('should match expected skat davies p-value for HIC2', function() {
      let groupResults = this.results.data.groupResults;
      for (let i = 0; i < groupResults.length; i++) {
        if (groupResults.mask[i] === 'GENCODE-AF01' && groupResults.group[i] === 'ENSG00000169635' && groupResults.test[i] === 'skatDavies') {
          assert.closeTo(groupResults.pvalue[i],0.765,0.001);
        }
      }
    });
  });
});
