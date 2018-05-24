import { ZegginiBurdenTest } from '../../src/app/stats.js';

describe('stats.js', function() {
  describe('ZegginiBurdenTest', function() {
    it('should return correct p-value for known u/cov (no weights)', function() {
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
    })
  })
});
