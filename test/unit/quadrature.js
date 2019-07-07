import { assert } from 'chai';
import { GaussKronrod } from '../../src/app/quadrature.js';

describe('quadrature.js', function() {
  describe('GaussKronrod', function () {
    it('exp(-t*t / 2) from 0 to 10', function () {
      let integ = new GaussKronrod(21, 15);
      let f = x => Math.exp(-x * x / 2);
      let [result, ] = integ.integrate(f, 0, 10);
      assert.closeTo(result, 1.25331, 0.0001);
    });

    it('x * sin(x) from -20 to 20', function () {
      let integ = new GaussKronrod(21, 15);
      let f = x => Math.sin(x) * x;
      let [result, ] = integ.integrate(f, -20, 20);
      assert.closeTo(result, -14.497, 0.001);
    });
  });
});