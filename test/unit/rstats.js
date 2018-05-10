//import { pchisq } from '../../src/app/rstats.js';
require('babel-register');
const rstats = require('../../src/app/rstats.js');
const { pchisq, dbeta } = rstats;
const { assert } = require('chai');
const yaml = require('js-yaml');
const fs = require('fs');

function* range(start, end, increment=1) {
  for (let i = start; i < end; i += increment) {
    yield i;
  }
}

function rdiff(arr) {
  return [...range(0,arr.length-1,2)].map(x => arr[x+1] - arr[x]);
}

function cartesianProduct(a, b, ...c) {
  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  if (b) return cartesianProduct(f(a, b), ...c); else return a;
}

function nearlyEqual(a, b, epsilon = 0.00001) {
  let absA = Math.abs(a);
  let absB = Math.abs(b);
  let diff = Math.abs(a - b);

  if (a === b) {
    return true;
  }
  else if (a === 0 || b === 0 || diff < Number.MIN_VALUE) {
    return diff < (epsilon * Number.MIN_VALUE);
  }
  else {
    return diff / Math.min((absA + absB), Number.MAX_VALUE) < epsilon;
  }
}

function yamlParseBoolean(x) {
  if (typeof x === 'boolean') {
    return x;
  }
  else if (typeof x === 'number') {
    return Boolean(x);
  }
  else if (typeof x === 'string') {
    if (x === 'yes') return true;
    if (x === 'no') return false;
    if (x === 'y') return true;
    if (x === 'n') return false;
    if (x === 'Y') return true;
    if (x === 'N') return false;
    if (x === 'true') return true;
    if (x === 'false') return false;
    if (x === 'on') return true;
    if (x === 'off') return false;
  }
  else {
    throw new Error('Unrecognized argument type for parsing YAML boolean: ' + x.toString());
  }
}

describe('rstats.js', function() {
  describe('pchisq()', function() {
    /**
     * These are the test cases provided in R-3.4.3/tests/d-p-q-r-tests.R.
     */
    it('should match expected values from d-p-q-r-tests.R', function() {
      let xB = [2000,1e6,1e50,Infinity];
      for (let df of [0.1,1,10]) {
        for (let ncp of [0, 1, 10, 100]) {
          for (let x of xB) {
            assert.equal(pchisq(x, df, ncp), 1, `parameters were: x=${x}, df=${df}, ncp=${ncp}`);
          }
        }
      }

      assert.equal(pchisq(-1, 0), 0);
      assert.equal(pchisq(0, 0), 0);
      assert.equal(pchisq(1, 0), 1);
      assert.equal(pchisq(-1, 0, 0, false), 1);
      assert.equal(pchisq(0, 0, 0, false), 1);
      assert.equal(pchisq(1, 0, 0, false), 0);

      for (let x = 500; x < 700; x++) {
        assert.isAtMost(pchisq(x, 1.01, 80), 1, `parameters were: x=${x}, df=1.01, ncp=80`);
      }

      assert.closeTo(pchisq(200, 4, 0.001, true, true), -3.851e-42, 0.0001);

      let lp = [...range(0, 201, 1)].map(x => pchisq(Math.pow(2, -x), 100, 1, true, true));
      for (let v of lp) {
        assert.isFinite(v);
        assert.isAtMost(v, -184);
      }
      assert.closeTo(lp[200], -7115.10693158, 0.5);

      let dlp = rdiff(lp);
      let dd = dlp.slice(dlp.length - 30).map(x => Math.abs(x - -34.65735902799));
      for (let x of dlp) {
        assert.isAbove(x,-34.66,`failed on x=${x}`);
        assert.isAtMost(x,-34.41,`failed on x=${x}`);
      }
      assert(dd.every(x => x < 1e-8));

      assert.closeTo(pchisq(1, 1.01, 80, true, true), -34.57369629, 0.0001);
      assert.closeTo(pchisq(2, 1.01, 80 * (1 - 2e-16), true, true), -31.31514671, 0.0001);

      let th = [...range(1,10),...[...range(1,4),7].map(x => Math.pow(10, x))].map(x => x * 10);
      let pp = th.map(x => pchisq(0, 0, x, true, true));
      pp.map((x,i) => { assert.closeTo(x, -th[i]/2.0, 1e-1) });
    });

    it('should match expected values over a range of parameters', function() {
      let tests = require("./pchisq.json");
      for (let t of tests) {
        let actual = pchisq(t.x, t.df, t.ncp, t.tail, t.give_log);
        assert.closeTo(actual, t.expected, 0.0001, `failed on x=${t.x}, df=${t.df}, ncp=${t.ncp}, lower_tail=${t.tail}, log.p=${t.give_log}`);
      }
    });

  });

  describe('dbeta()', function() {
    it('should match expected values from d-p-q-r-tests.R', function () {
      let rlnorm_a = [26.8914,39.6053,45.4999,85.1258,97.8008,118.5089,120.5632,146.7159,174.024,189.3219,204.8265,253.4271,253.8619,313.312,346.7885,432.674,656.3784,698.9867,770.2827,803.2988];
      let rlnorm_b = [179.4666,194.8285,209.4946,245.788,273.7723,291.5742,484.2903,549.0146,606.1852,879.5376,885.7796,914.8445,966.7912,993.2479,1049.001,1129.0728,1182.0789,1828.4377,2693.4411,3027.3139];
      let x = [...range(0,1,0.1)];
      for (let t of cartesianProduct(x, rlnorm_a, rlnorm_b)) {
        let vNL = dbeta(t[0], t[1], t[2]);
        let vL = dbeta(t[0], t[1], t[2], true);
        assert.closeTo(vNL, Math.exp(vL), 0.001);
      }
    });

    it('should match expected values over a range of parameters', function() {
      // Edge cases
      assert.equal(dbeta(Infinity, 1, 1, true), -Infinity);
      assert.equal(dbeta(0, 1, 1, true), 0);
      assert.equal(dbeta(1, 1, 1, true), 0);

      // General parameters
      let tests = yaml.safeLoad(fs.readFileSync("test/unit/dbeta.yaml", 'utf8'));
      for (let t of tests) {
        let actual = dbeta(t.x, t.a, t.b, yamlParseBoolean(t.give_log));
        if (!isFinite(t.x) || !isFinite(t.expected)) {
          assert.equal(actual, t.expected, `failed on x=${t.x}, a=${t.a}, b=${t.b}, log.p=${t.give_log}`);
        }
        else {
          assert(nearlyEqual(actual, t.expected, 0.001), `failed on x=${t.x}, a=${t.a}, b=${t.b}, log.p=${t.give_log}`);
        }
      }
    });
  });
});
