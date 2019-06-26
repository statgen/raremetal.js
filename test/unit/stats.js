import { assert } from 'chai';

import { ZegginiBurdenTest, SkatTest, SkatOptimalTest, VTTest, pmvnorm, calculate_mvt_pvalue } from '../../src/app/stats.js';

describe('stats.js', function() {
  describe('pmvnorm', function() {
    it('should return correct value for simple case', function() {
      const lower = new Array(4).fill(-0.68280434415179325);
      const upper = new Array(4).fill(0.68280434415179325);
      const mean = new Array(4).fill(0.0);
      const sigma = [
        [1.000,0.707,0.577,0.245],
        [0.707,1.000,0.816,0.347],
        [0.577,0.816,1.000,0.425],
        [0.245,0.347,0.425,1.000]
      ];

      const result = pmvnorm(lower, upper, mean, sigma);
      assert.closeTo(result.value, 0.12163363705851155, 0.001);
      assert.closeTo(result.error, 0.000020666222108512638, 0.001);
      assert.equal(result.inform, 0);
    });

    it('should return correct value when inform==3 is triggered', function() {
      const lower = new Array(9).fill(-2.2287371197803769);
      const upper = new Array(9).fill(2.2287371197803769);
      const mean = new Array(9).fill(0.0);
      const sigma = [
        [1.000, 0.632, 0.498, 0.391, 0.323, 0.262, 0.184, 0.135, 0.127],
        [0.632, 1.000, 0.788, 0.618, 0.511, 0.414, 0.290, 0.213, 0.201],
        [0.498, 0.788, 1.000, 0.785, 0.649, 0.526, 0.368, 0.270, 0.254],
        [0.391, 0.618, 0.785, 1.000, 0.827, 0.670, 0.469, 0.344, 0.324],
        [0.323, 0.511, 0.649, 0.827, 1.000, 0.810, 0.568, 0.416, 0.392],
        [0.262, 0.414, 0.526, 0.670, 0.810, 1.000, 0.942, 0.867, 0.818],
        [0.184, 0.290, 0.368, 0.469, 0.568, 0.942, 1.000, 0.981, 0.926],
        [0.135, 0.213, 0.270, 0.344, 0.416, 0.867, 0.981, 1.000, 0.944],
        [0.127, 0.201, 0.254, 0.324, 0.392, 0.818, 0.926, 0.944, 1.000]
      ];

      const result = pmvnorm(lower, upper, mean, sigma);
      assert.closeTo(result.value, 0.88037564067513052, 0.001);
      assert.closeTo(result.error, 0.00076046962293943772, 0.001);
      assert.equal(result.inform, 0);
    });
  });

  describe('calculate_mvt_pvalue', function() {
    it('should return correct value for simple case', function() {
      const scores = [
        0.301135449825287, 1.3324818019145408, 0.88212352191875065, 1.6497709708262918, 0.15047099201545067,
        0.6235437258715173, 1.3951211216723614, 0.50011485542337253
      ];
      const cov_t = [
        [1, 0.7069548502919164, 0.57707267772208493, 0.44680286178659967, 0.37754025932838237, 0.31572616611699494, 0.28069725681633245, 0.13418284713753337],
        [0.7069548502919164, 1, 0.81627706313837645, 0.63200481367325789, 0.5340291058846679, 0.44658950783508061, 0.39703740522024411, 0.18977304676363141],
        [0.57707267772208493, 0.81627706313837645, 1, 0.77424975045029376, 0.65421998300064288, 0.54709780574222966, 0.48639021848644914, 0.23246183492172764],
        [0.44680286178659967, 0.63200481367325789, 0.77424975045029376, 1, 0.84496237517762918, 0.70658894967493968, 0.62818551286263802, 0.30014846141434243],
        [0.37754025932838237, 0.5340291058846679, 0.65421998300064288, 0.84496237517762918, 1, 0.83621582520680438, 0.74339767272079949, 0.35521819286605033],
        [0.31572616611699494, 0.44658950783508061, 0.54709780574222966, 0.70658894967493968, 0.83621582520680438, 1, 0.88901032453212669, 0.42481580880011133],
        [0.28069725681633245, 0.39703740522024411, 0.48639021848644914, 0.62818551286263802, 0.74339767272079949, 0.88901032453212669, 1, 0.47731439030717948],
        [0.13418284713753337, 0.18977304676363141, 0.23246183492172764, 0.30014846141434243, 0.35521819286605033, 0.42481580880011133, 0.47731439030717948, 1]
      ];
      const t_max = 1.6497709708262918;
      const result = calculate_mvt_pvalue(scores, cov_t, t_max);
      assert.closeTo(result, 0.060143850853423546, 0.001);
    })
  });

  describe('VTTest', function() {
    it('simple test case', function() {
      const u = [-1.1983600000000001, 8.4673099999999994, 2.4368799999999999, -1.74072];
      const cov = [
        [35.999521600000001, -0.073957332399999992, -0.021069833400000001, -0.091371064400000007],
        [-0.073957332399999992, 83.542530400000004, -0.047519894799999997, -0.2060421076],
        [-0.021069833400000001, -0.047519894799999997, 23.926510440000001, -0.058631327999999996],
        [-0.091371064400000007, -0.2060421076, -0.058631327999999996, 97.791066799999996],
      ];
      const mafs = [0.0004395216, 0.00099127976258790436, 0.00028191799999999998, 0.0012230639437412097];
      const agg = new VTTest();
      const [tmax, pval] = agg.run(u, cov, null, mafs);
      const expectedPval = 0.80328082770889286;
      const expectedTmax = 0.8111221126845517;
      assert.closeTo(pval, expectedPval, 0.001);
      assert.closeTo(tmax, expectedTmax, 0.001);
    });
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

  describe('SkatOptimalTest', function() {
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
      let agg = new SkatOptimalTest();
      let [, pval] = agg.run(u, cov, null, mafs);
      let expectedPval = 0.6156647276107277;
      assert.closeTo(
        pval,
        expectedPval,
        0.001,
        'SkatOptimalTest on known u/cov did not produce close enough p-value to expected'
      )
    });

    it('another edge case', function() {
      let u = [-1.19836, 8.46731, 2.43688, -1.74072];
      let cov = [
        [ 35.9995216, -0.07395733239999999, -0.0210698334, -0.09137106440000001 ],
        [ -0.07395733239999999, 83.5425304, -0.0475198948, -0.2060421076 ],
        [ -0.0210698334, -0.0475198948, 23.92651044, -0.058631327999999996 ],
        [ -0.09137106440000001, -0.2060421076, -0.058631327999999996, 97.7910668 ],
      ];
      let mafs = [0.000439398, 0.000991001, 0.000281918, 0.00122272];
      let agg = new SkatOptimalTest();
      let [, pval] = agg.run(u, cov, null, mafs);
      let expectedPval = 0.779274359;
      assert.closeTo(
        pval,
        expectedPval,
        1e-6,
        'SkatOptimalTest on known u/cov did not produce close enough p-value to expected'
      )
    });

    it('scores and covariance matrix are all the same value', function() {
      let u = [5.90907, 5.90907];
      let cov = [[47.7780604, 47.7780604], 47.7780604, 47.7780604];
      let mafs = [0.00056243, 0.00056243];
      let agg = new SkatOptimalTest();
      let [, pval] = agg.run(u, cov, null, mafs);
      assert.isNaN(pval);
    });
  });
});
