//import { pchisq } from '../../src/app/rstats.js';
require("babel-register");
const { pchisq } = require("../../src/app/rstats.js");
const { assert } = require("chai");

function* range(start, end, increment=1) {
  for (let i = start; i < end; i += increment) {
    yield i;
  }
}

function rdiff(arr) {
  return [...range(0,arr.length-1,2)].map(x => arr[x+1] - arr[x]);
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
});
