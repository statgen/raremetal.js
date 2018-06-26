import { assert } from 'chai';

import { ZegginiBurdenTest, SkatTest } from '../../src/app/stats.js';

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

  describe('SkatTest', function() {
    it('should return correct p-value for edge case where Davies p-value is 0', function() {
      let scores = [1.78855, 39.5782, -0.87731, 4.04614, -0.75007, 146.723];
      let cov = [
        [7.994158379999999,-0.0546119717,-0.0017337170499999999,-0.00260057096,-0.000866857602,-0.216713939],
        [-0.0546119717,62.5785693,-0.013653016,-0.020479524,-0.00682649877,-0.7064881980000001],
        [-0.0017337170499999999, -0.013653016,1.9998364100000001,-0.00065014274,-0.000216713939,-0.054178623200000005],
        [-0.00260057096,-0.020479524,-0.00065014274,2.99943618,-0.00032507137,-0.0812678425],
        [-0.000866857602,-0.00682649877,-0.000216713939,-0.00032507137,1.00002435,-0.027089311600000002],
        [-0.216713939,-0.7064881980000001,-0.054178623200000005,-0.0812678425,-0.027089311600000002,249.262611]
      ];
      let mafs = [0.000433369, 0.00341278, 0.000108342, 0.000162514, 0.0000541712, 0.0135428];
      let agg = new SkatTest();
      let [, pval] = agg.run(scores, cov, null, mafs);
      let expectedPval = 2.4240441146275055e-24;
      assert.closeTo(pval, expectedPval, 0.001);
    });

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
