import { assert } from 'chai';
import mvtmodule from '../../src/app/mvtdstpack.js';
// This is a webassembly module, so tests are promise-based to ensure it has loaded first
const mvtdstpack = mvtmodule();


describe('mvtdstpack.js', function() {
  describe('Test mvtdst', function() {
    it('should return correct values', function() {
      return mvtdstpack.then((module) => {
        // Parameters
        let n = 4;
        let df = 0;

        let lower = new module.DoubleVec();
        lower.push_back(-0.68280434415179325);
        lower.push_back(-0.68280434415179325);
        lower.push_back(-0.68280434415179325);
        lower.push_back(-0.68280434415179325);

        let upper = new module.DoubleVec();
        upper.push_back(0.68280434415179325);
        upper.push_back(0.68280434415179325);
        upper.push_back(0.68280434415179325);
        upper.push_back(0.68280434415179325);

        let infin = new module.IntVec();
        infin.push_back(2);
        infin.push_back(2);
        infin.push_back(2);
        infin.push_back(2);

        let corr = new module.DoubleVec();
        corr.push_back(0.7068817630734282);
        corr.push_back(0.5769894472718361);
        corr.push_back(0.81624431021682053);
        corr.push_back(0.24500706924085489);
        corr.push_back(0.34659039585584789);
        corr.push_back(0.42460934167161291);

        let delta = new module.DoubleVec();
        delta.push_back(0);
        delta.push_back(0);
        delta.push_back(0);
        delta.push_back(0);

        let maxpts = 50000;
        let abseps = 0.001;
        let releps = 0.0;
        let result = module.mvtdst(n, df, lower, upper, infin, corr, delta, maxpts, abseps, releps);
        assert.equal(result.inform, 0);
        assert.closeTo(result.value, 0.12164661836389246, 0.001);
        assert.closeTo(result.error, 0.000031585624965638197, 0.001);
      });
    });
  });
});
