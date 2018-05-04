/**
 * These are the original test values supplied with the qfc.c source code.
 */

import * as qfc from '../../src/app/qfc.js';

describe('qfc.js', function() {
  describe('qf()', function() {
    describe('Davies\' test suite', function () { 
      let testJson = require('./qfc.json');
      let count = 0;
      for (var testCase of testJson) {
        var result = qfc.qf(
          testCase['lambda'],
          testCase['noncen'],
          testCase['df'],
          testCase['r'],
          testCase['sigma'],
          testCase['c'],
          testCase['lim'],
          testCase['acc']
        );

        it('should match expected qf value for parameter set ' + count, function() {
          let computedQf = result[0];
          let expectedQf = testCase['qfval'];
          assert.closeTo(computedQf,expectedQf,0.001);
        });

        it('should match ifault value for parameter set ' + count, function() {
          let ifault = result[1];
          assert.equal(ifault,0);
        });

        it('should match integration debug values for parameter set ' + count, function() {
          let computedTrace = result[2];
          let actualTrace = testCase['trace'];
          for (let i = 0; i < 6; i++) {
            assert.closeTo(actualTrace[i],computedTrace[i],0.001); 
          }
        });

        count += 1;
      }
    });

    describe('Edge cases found from testing genome-wide', function() {
      it('case 1', function() {
        let lambdas = [ 164121.3743475122,
          14747.802766005561,
          14747.076530665458,
          14721.947692685235 ];
        let nc1 = [
          0,
          0,
          0,
          0
        ];
        let n1 = [
          1,
          1,
          1,
          1
        ];
        let n = 4;
        let sigma = 0;
        let acc = 0.0001;
        let lim = 10000;
        let qstat = 48692.70492647851;
        let res = qfc.qf(lambdas, nc1, n1, n, sigma, qstat, lim, acc);
        assert.closeTo(res[0],0.1891,0.001)
      })
    });
  });
});

