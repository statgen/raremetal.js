import { assert } from 'chai';
import { GaussKronrod, ExpSinh } from '../../src/app/quadrature.js';

describe('quadrature.js', function() {
  describe('GaussKronrod', function () {
    it('exp(-t*t / 2) from 0 to 10', function () {
      let integ = new GaussKronrod(21, 15);
      let f = (x) => Math.exp(-x * x / 2);
      let [result ] = integ.integrate(f, 0, 10);
      assert.closeTo(result, 1.25331, 0.0001);
    });

    it('x * sin(x) from -20 to 20', function () {
      let integ = new GaussKronrod(21, 15);
      let f = (x) => Math.sin(x) * x;
      let [result ] = integ.integrate(f, -20, 20);
      assert.closeTo(result, -14.497, 0.001);
    });
  });

  describe('ExpSinh', function () {
    it('exp(-x) / sqrt(x)', function () {
      let integ = new ExpSinh();
      let f = (x) => Math.exp(-x) / Math.sqrt(x);
      let [result ] = integ.integrate(f);
      assert.closeTo(result, 1.77245, 0.0001);
    });

    it('1/x^2 from 1 to inf', function () {
      let integ = new ExpSinh();
      let f = (x) => 1 / (x ** 2);
      let [result ] = integ.integrate(f, 1, Number.POSITIVE_INFINITY);
      assert.closeTo(result, 1, 0.000001);
    });

    it('x * exp(-x^2) from 0 to inf', function () {
      let integ = new ExpSinh();
      let f = (x) => x * Math.exp(-Math.pow(x, 2));
      let [result ] = integ.integrate(f);
      assert.closeTo(result, 0.5, 0.000001);
    });
  });
});
