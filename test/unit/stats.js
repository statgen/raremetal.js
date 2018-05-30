import fs from 'fs';

import { ZegginiBurdenTest, SkatTest } from '../../src/app/stats.js';
import { assert } from 'chai';
import { parsePortalJson } from '../../src/app/helpers';

describe('stats.js', function() {
  before(function () {
    // Load example JSON of portal response from requesting covariance in a region
    let jsonRaw = fs.readFileSync('test/integration/example.json');
    let json = JSON.parse(jsonRaw);
    this.scoreCov = parsePortalJson(json);
  });

  describe('ZegginiBurdenTest', function() {
    it('should return correct p-value for known u/cov (no weights)', function() {
      // Verify correctness of results
      let u = [ 1.26175, 3.45806, -4.90216, -7.05748 ];
      let cov = [ [ 23.902543, -0.01359241884, -0.01361261692, -0.1976943976 ],
        [ -0.01359241884, 23.90577896, -0.01371627432, -0.1992892636 ],
        [ -0.01361261692, -0.01371627432, 23.9075214, -0.1996334844 ],
        [ -0.1976943976, -0.1992892636, -0.1996334844, 320.2882088 ] ];
      let agg = new ZegginiBurdenTest();
      let [, pval] = agg.test(u,cov,null);
      let expectedPval = 0.7141;
      assert.closeTo(
        pval,
        expectedPval,
        0.001,
        'testBurden on known u/cov did not produce close enough p-value to expected'
      )
    });

    it('should return multiple result sets for multiple masks', function () {
      // Test the "high level" interface that coordinates sets of tests
      const onemask = this.scoreCov.scorecov[ Object.keys(this.scoreCov.scorecov)[0] ];
      const instance = new ZegginiBurdenTest([onemask, onemask]);
      const result = instance.run();

      assert.isArray(result);
      assert.equal(result.length, 2, 'Ran on two masks');
      assert.deepEqual(result[0], result[1], 'Same mask should give same results')
    });
  });

  describe('SkatTest', function() {
    it('should return correct p-value for known u/cov (standard weights)', function () {
      let u = [
        1.26175,
        3.45806,
        -4.90216,
        -7.05748
      ];
      let cov = [
        [
          23.902543,
          -0.01359241884,
          -0.01361261692,
          -0.1976943976
        ],
        [
          -0.01359241884,
          23.90577896,
          -0.01371627432,
          -0.1992892636
        ],
        [
          -0.01361261692,
          -0.01371627432,
          23.9075214,
          -0.1996334844
        ],
        [
          -0.1976943976,
          -0.1992892636,
          -0.1996334844,
          320.2882088
        ]
      ];
      let mafs = [
        0.000281496,
        0.000283886,
        0.000284308,
        0.00412922
      ];
      let agg = new SkatTest();
      let [, pval] = agg.test(u, cov, null, mafs);
      let expectedPval = 0.8110;
      assert.closeTo(
        pval,
        expectedPval,
        0.001,
        'SkatTest on known u/cov did not produce close enough p-value to expected'
      )
    });

    it('should use liu method when only 1 lambda', function() {
      let u = [ -1.56617 ];
      let cov = [[ 23.902543 ]];
      let mafs = [ 0.000282902 ];
      let agg = new SkatTest();
      let [, pval] = agg.test(u, cov, null, mafs);
      let expectedPval = 0.7487074306833961;
      assert.closeTo(
        pval,
        expectedPval,
        0.0000001,
        'SkatTest on known u/cov did not produce close enough p-value to expected'
      )
    });
  });
});
