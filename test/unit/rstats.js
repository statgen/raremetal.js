import { dbeta, pchisq, pnorm } from '../../src/app/rstats.js';
import { assert } from 'chai';
import * as yaml from 'js-yaml';
import fs from 'fs';
import sqlite3 from 'sqlite3';

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
      let tests = JSON.parse(fs.readFileSync('test/unit/pchisq.json'));
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
      let tests = yaml.safeLoad(fs.readFileSync('test/unit/dbeta.yaml', 'utf8'));
      for (let t of tests) {
        let actual = dbeta(t.x, t.a, t.b, yamlParseBoolean(t.give_log));
        if (isNaN(t.x)) { assert.isNaN(actual) }
        else if (!isFinite(t.x) || !isFinite(t.expected)) {
          assert.equal(actual, t.expected, `failed on x=${t.x}, a=${t.a}, b=${t.b}, log.p=${t.give_log}`);
        }
        else {
          assert(nearlyEqual(actual, t.expected, 0.001), `failed on x=${t.x}, a=${t.a}, b=${t.b}, log.p=${t.give_log}`);
        }
      }
    });
  });

  describe('pnorm()', function() {
    it('should match expected values from d-p-q-r-tests.R', function () {
      let x = [-Infinity, -1e100, ...range(1,7), 1e200, Infinity];
      let exp = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
      x.forEach((v, i) => {
        let actual = pnorm(v, 3, 0);
        assert.equal(actual, exp[i], `pnorm(${v},3,0) expected ${exp[i]} got ${actual}`);
      });

      let exp2 = [0, ...Array(8).fill(0.5), 1];
      x.forEach((v, i) => {
        let actual = pnorm(v, 3, Infinity);
        assert.equal(actual, exp2[i], `pnorm(${v},3,Inf) expected ${exp2[i]} got ${actual}`)
      });

      let z = [1.2616,0.1422,1.2383,-0.75,0.7788,-0.8034,0.1592,2.046,1.0922,-0.0049,0.9458,-1.3031,-0.2147,0.6323,
        0.4443,0.5156,-0.9995,1.5754,-1.6227,-0.0779,1.8652,0.5917,0.497,-1.227,-1.067,1.1307,1.4506,0.3941,0.1166,
        -1.2651,0.3122,-0.7621,0.4518,0.3998,0.8039,0.5097,-1.4709,-0.4076,-0.3053,0.9183,-1.7226,-0.3332,-0.2315,
        0.3279,-0.2472,1.0795,-0.3598,0.4343,0.0497,0.7131,1.1903,-0.1625,0.0497,0.1496,0.9787,0.926,0.4562,-0.3203,
        0.949,-0.0795,1.3487,0.0824,0.4419,0.8125,1.296,1.9026,-0.4583,0.0374,0.6252,1.5999,-0.6404,0.29,1.1315,1.7466,
        2.8616,-0.1085,-0.0022,1.0252,1.8164,0.79,0.2236,0.0955,-0.0526,0.1262,0.2345,1.1784,-0.6072,2.1711,-0.8096,
        -0.3959,-0.3017,0.8944,-2.6268,1.8283,0.0046,0.4118,0.9103,-0.5463,-1.3732,-0.3442];

      z.forEach((v, i) => {
        let a = pnorm(v);
        let aLog = Math.log(a);
        let b = 1 - pnorm(-v);
        let c = 1 - pnorm(v, 0, 1, false, false);
        let d = pnorm(v, 0, 1, true, true);
        assert(nearlyEqual(a, b));
        assert(nearlyEqual(a, c));
        assert(nearlyEqual(aLog, d));
      });

      let y = [...range(1,51), ...[...range(3,11), 20, 50, 150, 250].map(x => 10 ** x)];
      y = [...y.map(x => -x), 0, ...y];
      for (let b of [true, false]) {
        y.forEach(v => {
          assert(nearlyEqual(
            pnorm(-v, 0, 1, true, b),
            pnorm(+v, 0, 1, false, b)
          ))
        });
      }
    });

    it('should match expected values over a range of parameters', function(done) {
      // Edge cases
      assert.equal(pnorm(Infinity), 1);
      assert.equal(pnorm(-Infinity), 0);
      assert(nearlyEqual(pnorm(1e154, 0, 1, false, true), -5e307));

      // General parameters
      let db = new sqlite3.Database('test/unit/pnorm.db');
      db.all("SELECT * FROM PNORM", function(err, rows) {
        if (rows.length === 0) {
          throw new Error("Retrieved 0 rows from sqlite3 database");
        }

        for (let t of rows) {
          let x = parseFloat(t.x);
          let expected = parseFloat(t.expected);
          let actual = pnorm(x, t.mu, t.sd, t.tail, t.give_log);

          if (isNaN(expected)) { assert.isNaN(actual) }
          else if (!isFinite(x) || !isFinite(expected)) {
            assert.equal(actual, expected, `failed on x=${x}, mu=${t.mu}, sd=${t.sd}, tail=${t.tail}, log=${t.give_log}, expected was ${expected}, got ${actual} instead`);
          }
          else {
            assert(nearlyEqual(actual, expected), `failed on x=${x}, mu=${t.mu}, sd=${t.sd}, tail=${t.tail}, log=${t.give_log}, expected was ${expected}, got ${actual} instead`);
          }
        }

        done();
      });
    });
  });
});
