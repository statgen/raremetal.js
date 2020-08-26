import { dbeta, pchisq, pnorm, dgamma, dchisq, qchisq, qnorm, qgamma } from '../../src/app/rstats.js';
import { assert } from 'chai';
import sqlite3 from 'sqlite3';

function* range(start, end, increment = 1) {
  for (let i = start; i < end; i += increment) {
    yield i;
  }
}

function rdiff(arr) {
  return [...range(0, arr.length - 1, 2)].map((x) => arr[x + 1] - arr[x]);
}

function cartesianProduct(a, b, ...c) {
  const f = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
  if (b) {
    return cartesianProduct(f(a, b), ...c);
  } else {
    return a;
  }
}

function nearlyEqual(a, b, epsilon = 0.00001) {
  let absA = Math.abs(a);
  let absB = Math.abs(b);
  let diff = Math.abs(a - b);

  if (a === b) {
    return true;
  } else if (a === 0 || b === 0 || diff < Number.MIN_VALUE) {
    return diff < (epsilon * Number.MIN_VALUE);
  } else {
    return diff / Math.min((absA + absB), Number.MAX_VALUE) < epsilon;
  }
}

// function arrayStrictEqual(a1, a2) {
//   if (a1.length !== a2.length) { throw 'Arrays must be equal length'; }
//   for (let i = 0; i < a1.length; i++) {
//     assert.strictEqual(a1[i], a2[i]);
//   }
// }

function arrayCloseTo(a1, a2, tol) {
  if (a1.length !== a2.length) {
    throw 'Arrays must be equal length';
  }
  for (let i = 0; i < a1.length; i++) {
    assert.closeTo(a1[i], a2[i], tol);
  }
}

describe('rstats.js', function() {
  describe('qnorm()', function() {
    it('simple test', function() {
      assert.closeTo(qnorm(0.01, 0, 1, true, false), -2.326348, 1e-6);
      assert.closeTo(qnorm(0.01, 0, 1, false, false), 2.326348, 1e-6);
      assert.strictEqual(qnorm(0, 0, 1, true, false), Number.NEGATIVE_INFINITY);
      assert.strictEqual(qnorm(Number.NEGATIVE_INFINITY, 0, 1, true, true), Number.NEGATIVE_INFINITY);
      assert.strictEqual(qnorm(1, 0, 1, true, false), Number.POSITIVE_INFINITY);
      assert.strictEqual(qnorm(0, 0, 1, true, true), Number.POSITIVE_INFINITY);
      assert.isNaN(qnorm(1.1, 0, 0, 1, true, false));

      let p = [0.25, 0.001, 1e-20];
      let q_calc = p.map((x) => qnorm(x, 0, 1, true, false));
      let q_truth = [-0.6744897501960817, -3.090232306167814, -9.262340089798408];
      arrayCloseTo(q_calc, q_truth, 1e-14);

      assert.closeTo(qnorm(-1e5, 0, 1, true, true), -447.1974945, 1e-6);
    });
  });

  describe('qgamma()', function() {
    it('simple test', function() {
      const p = qgamma(0.5, 0.5, 2.0, true, false);
      assert.closeTo(p, 0.4549364, 1e-6);
    });
  });

  describe('qchisq()', function() {
    it('simple test', function() {
      const p = qchisq(0.5, 1, 0, true, false);
      assert.closeTo(p, 0.4549364, 1e-6);
    });
  });

  describe('dchisq()', function() {
    it('simple test', function() {
      assert.closeTo(dchisq(1, 1), 0.2419707, 1e-4);
      assert.closeTo(dchisq(30, 1), 2.228087e-08, 1e-6);
      assert.closeTo(dchisq(1481, 1), 4.940656e-324, 1e-6);
    });

    it('should have point mass at 0 when df=0', function() {
      assert.strictEqual(dchisq(0, 0), Infinity);
      for (let p = 1; p <= 16; p++) {
        let x = p / 16.0;
        let v = dchisq(x, 0);
        assert.strictEqual(v, 0);
      }
    });

    it('should result in 0 for very large x', function() {
      for (let x of [Infinity, 1e80, 1e50, 1e40]) {
        assert.strictEqual(dchisq(x, 10), 0);
      }
    });
  });

  describe('dgamma()', function() {
    it('simple test', function() {
      const d1 = dgamma(1, 1, 1);
      assert.closeTo(d1, 0.3678794, 0.00001);
    });

    it('should match values from d-p-q-r-tests.R', function() {
      // Increase timeout
      this.timeout(10000);

      const ar_sh = [2.43673426596086, 1.09017658223004, 0.384706110233022, 0.385003615289159, 1.24358539374194, 2.04396646966378,
        1.10155062033232, 0.884677795484837, 0.404479623939711, 0.681773620921921, 0.120182717404666, 1.14005899082886,
        0.41160916582694, 3.69444993480408, 0.132785982474101, 0.847321784843346, 0.391731910817245, 8.82113630560074,
        1.04317764763671, 0.600590319816989, 3.28870195407058, 1.6691367338817, 0.426085372492064, 0.35694712646813,
        1.13008056089379, 0.351880045999097, 0.236242206978862, 0.277155900380487, 1.49309944076602, 0.368926541895946];
      const ar_sig = [1.78014589704298, 1.6229295753714, 2.18320600998694, 3.65932610106183, 3.24395363336766, 2.67833914617233,
        3.27491360473738, 0.866317088088225, 3.63745627211444, 2.55749638577969, 0.412569575220895, 1.21976639884795,
        0.333820371574394, 0.763021368148305, 1.32587198483871, 0.446962304458462, 1.86856203341222, 1.91935797929959,
        1.18956734811467, 0.80748077225846, 1.90120159246297, 2.38006798387259, 0.27469167537512, 0.768245073374727,
        2.67755735992219, 0.973249246037425, 1.48151520910488, 0.857673271475687, 1.36314222551777, 3.69245416695441];
      const ar_x = [0.23, 0.29, 0.56, 0.67, 0.76, 0.81, 0.82, 0.91, 1.08, 1.12, 1.28, 1.29, 1.33, 1.33, 1.45, 1.55, 1.68, 1.74,
        1.82, 1.87, 2, 2.03, 2.14, 2.25, 2.25, 2.3, 2.32, 2.47, 2.48, 2.53, 2.54, 2.56, 2.62, 2.7, 2.89, 3.04,
        3.11, 3.51, 3.53, 3.6, 3.92, 4.06, 4.16, 4.53, 5.4, 5.53, 5.87, 6.6, 6.97, 9.98];
      for (let sh of ar_sh) {
        for (let sig of ar_sig) {
          for (let x of ar_x) {
            let v1 = dgamma(x, sh, sig);
            let v2 = dgamma(x / sig, sh, 1) / sig;
            assert.closeTo(v1, v2, 1e-6);
          }
        }
      }
    });
  });

  describe('pchisq()', function() {
    /**
     * These are the test cases provided in R-3.4.3/tests/d-p-q-r-tests.R.
     */
    it('should match expected values from d-p-q-r-tests.R', function() {
      let xB = [2000, 1e6, 1e50, Infinity];
      for (let df of [0.1, 1, 10]) {
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

      let lp = [...range(0, 201, 1)].map((x) => pchisq(Math.pow(2, -x), 100, 1, true, true));
      for (let v of lp) {
        assert.isFinite(v);
        assert.isAtMost(v, -184);
      }
      assert.closeTo(lp[200], -7115.10693158, 0.5);

      let dlp = rdiff(lp);
      let dd = dlp.slice(dlp.length - 30).map((x) => Math.abs(x - -34.65735902799));
      for (let x of dlp) {
        assert.isAbove(x, -34.66, `failed on x=${x}`);
        assert.isAtMost(x, -34.41, `failed on x=${x}`);
      }
      assert(dd.every((x) => x < 1e-8));

      assert.closeTo(pchisq(1, 1.01, 80, true, true), -34.57369629, 0.0001);
      assert.closeTo(pchisq(2, 1.01, 80 * (1 - 2e-16), true, true), -31.31514671, 0.0001);

      let th = [...range(1, 10), ...[...range(1, 4), 7].map((x) => Math.pow(10, x))].map((x) => x * 10);
      let pp = th.map((x) => pchisq(0, 0, x, true, true));
      pp.map((x, i) => {
        assert.closeTo(x, -th[i] / 2.0, 1e-1);
      });
    });

    it('should match expected values over a range of parameters', function(done) {
      let db = new sqlite3.Database('test/unit/pchisq.db');
      db.all('SELECT * FROM PCHISQ', function(err, rows) {
        for (let t of rows) {
          let [x, df, ncp, expected] = [t.x, t.df, t.ncp, t.expected].map(parseFloat);
          let actual = pchisq(x, df, ncp, t.tail, t.give_log);
          assert.closeTo(actual, expected, 0.0001, `failed on x=${x}, df=${df}, ncp=${ncp}, lower_tail=${t.tail}, log.p=${t.give_log}`);
        }

        done();
      });
    });

    it('should match additional edge cases', function() {
      // value of x < 0
      assert.equal(pchisq(-1.5, 10, 0, false, false), 1.0);
    });

  });

  describe('dbeta()', function() {
    it('should match expected values from d-p-q-r-tests.R', function () {
      let rlnorm_a = [26.8914, 39.6053, 45.4999, 85.1258, 97.8008, 118.5089, 120.5632, 146.7159, 174.024, 189.3219, 204.8265, 253.4271, 253.8619, 313.312, 346.7885, 432.674, 656.3784, 698.9867, 770.2827, 803.2988];
      let rlnorm_b = [179.4666, 194.8285, 209.4946, 245.788, 273.7723, 291.5742, 484.2903, 549.0146, 606.1852, 879.5376, 885.7796, 914.8445, 966.7912, 993.2479, 1049.001, 1129.0728, 1182.0789, 1828.4377, 2693.4411, 3027.3139];
      let x = [...range(0, 1, 0.1)];
      for (let t of cartesianProduct(x, rlnorm_a, rlnorm_b)) {
        let vNL = dbeta(t[0], t[1], t[2]);
        let vL = dbeta(t[0], t[1], t[2], true);
        assert.closeTo(vNL, Math.exp(vL), 0.001);
      }
    });

    it('should match expected values over a range of parameters', function(done) {
      // Edge cases
      assert.equal(dbeta(Infinity, 1, 1, true), -Infinity);
      assert.equal(dbeta(0, 1, 1, true), 0);
      assert.equal(dbeta(1, 1, 1, true), 0);

      // General parameters
      let db = new sqlite3.Database('test/unit/dbeta.db');
      db.all('SELECT * FROM DBETA', function(err, rows) {
        if (rows.length === 0) {
          throw new Error('Retrieved 0 rows from sqlite3 database');
        }

        for (let t of rows) {
          let [x, a, b, expected] = [t.x, t.a, t.b, t.expected].map(parseFloat);
          let actual = dbeta(x, a, b, t.give_log);

          if (isNaN(x)) {
            assert.isNaN(actual);
          } else if (!isFinite(x) || !isFinite(expected)) {
            assert.equal(actual, expected, `failed on x=${x}, a=${a}, b=${b}, log.p=${t.give_log}`);
          } else {
            assert(nearlyEqual(actual, expected, 0.001), `failed on x=${x}, a=${a}, b=${b}, log.p=${t.give_log}`);
          }
        }

        done();
      });
    });
  });

  describe('pnorm()', function() {
    it('should match expected values from d-p-q-r-tests.R', function () {
      let x = [-Infinity, -1e100, ...range(1, 7), 1e200, Infinity];
      let exp = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
      x.forEach((v, i) => {
        let actual = pnorm(v, 3, 0);
        assert.equal(actual, exp[i], `pnorm(${v},3,0) expected ${exp[i]} got ${actual}`);
      });

      let exp2 = [0, ...Array(8).fill(0.5), 1];
      x.forEach((v, i) => {
        let actual = pnorm(v, 3, Infinity);
        assert.equal(actual, exp2[i], `pnorm(${v},3,Inf) expected ${exp2[i]} got ${actual}`);
      });

      let z = [1.2616, 0.1422, 1.2383, -0.75, 0.7788, -0.8034, 0.1592, 2.046, 1.0922, -0.0049, 0.9458, -1.3031, -0.2147, 0.6323,
        0.4443, 0.5156, -0.9995, 1.5754, -1.6227, -0.0779, 1.8652, 0.5917, 0.497, -1.227, -1.067, 1.1307, 1.4506, 0.3941, 0.1166,
        -1.2651, 0.3122, -0.7621, 0.4518, 0.3998, 0.8039, 0.5097, -1.4709, -0.4076, -0.3053, 0.9183, -1.7226, -0.3332, -0.2315,
        0.3279, -0.2472, 1.0795, -0.3598, 0.4343, 0.0497, 0.7131, 1.1903, -0.1625, 0.0497, 0.1496, 0.9787, 0.926, 0.4562, -0.3203,
        0.949, -0.0795, 1.3487, 0.0824, 0.4419, 0.8125, 1.296, 1.9026, -0.4583, 0.0374, 0.6252, 1.5999, -0.6404, 0.29, 1.1315, 1.7466,
        2.8616, -0.1085, -0.0022, 1.0252, 1.8164, 0.79, 0.2236, 0.0955, -0.0526, 0.1262, 0.2345, 1.1784, -0.6072, 2.1711, -0.8096,
        -0.3959, -0.3017, 0.8944, -2.6268, 1.8283, 0.0046, 0.4118, 0.9103, -0.5463, -1.3732, -0.3442];

      z.forEach((v) => {
        let a = pnorm(v);
        let aLog = Math.log(a);
        let b = 1 - pnorm(-v);
        let c = 1 - pnorm(v, 0, 1, false, false);
        let d = pnorm(v, 0, 1, true, true);
        assert(nearlyEqual(a, b));
        assert(nearlyEqual(a, c));
        assert(nearlyEqual(aLog, d));
      });

      let y = [...range(1, 51), ...[...range(3, 11), 20, 50, 150, 250].map((x) => 10 ** x)];
      y = [...y.map((x) => -x), 0, ...y];
      for (let b of [true, false]) {
        y.forEach((v) => {
          assert(nearlyEqual(
            pnorm(-v, 0, 1, true, b),
            pnorm(+v, 0, 1, false, b)
          ));
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
      db.all('SELECT * FROM PNORM', function(err, rows) {
        if (rows.length === 0) {
          throw new Error('Retrieved 0 rows from sqlite3 database');
        }

        for (let t of rows) {
          let x = parseFloat(t.x);
          let expected = parseFloat(t.expected);
          let actual = pnorm(x, t.mu, t.sd, t.tail, t.give_log);

          if (isNaN(expected)) {
            assert.isNaN(actual);
          } else if (!isFinite(x) || !isFinite(expected)) {
            assert.equal(actual, expected, `failed on x=${x}, mu=${t.mu}, sd=${t.sd}, tail=${t.tail}, log=${t.give_log}, expected was ${expected}, got ${actual} instead`);
          } else {
            assert(nearlyEqual(actual, expected), `failed on x=${x}, mu=${t.mu}, sd=${t.sd}, tail=${t.tail}, log=${t.give_log}, expected was ${expected}, got ${actual} instead`);
          }
        }

        done();
      });
    });
  });
});
