import { assert } from 'chai';

import { ZegginiBurdenTest, SkatTest, _skatDavies } from '../../src/app/stats.js';

describe('stats.js', function() {
  describe('ZegginiBurdenTest', function() {
    it('should return correct p-value for known u/cov (no weights)', function() {
      // Verify correctness of results
      let u = [ 1.26175, 3.45806, -4.90216, -7.05748 ];
      let cov = [ [ 23.902543, -0.01359241884, -0.01361261692, -0.1976943976 ],
        [ -0.01359241884, 23.90577896, -0.01371627432, -0.1992892636 ],
        [ -0.01361261692, -0.01371627432, 23.9075214, -0.1996334844 ],
        [ -0.1976943976, -0.1992892636, -0.1996334844, 320.2882088 ] ];
      let agg = new ZegginiBurdenTest();
      let [, pval] = agg.run(u,cov,null);
      let expectedPval = 0.7141;
      assert.closeTo(
        pval,
        expectedPval,
        0.001,
        'testBurden on known u/cov did not produce close enough p-value to expected'
      )
    });
  });

  describe('_skatDavies', function() {
    it('should return p-value > 0 for known extreme case', function() {
      let lambdas = [80966.14538109652, 33190.79877635288, 4893.311364910298, 1860.05790041185, 1243.4042974219005, 623.3896381571287];
      let qstat = 7836295.2889415305;
      let [_, pval] = _skatDavies(lambdas, qstat); // eslint-disable-line no-unused-vars
      assert.isAbove(pval, 0);
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
      let [, pval] = agg.run(u, cov, null, mafs);
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
      let [, pval] = agg.run(u, cov, null, mafs);
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
